import React, { createContext, useContext, useReducer, useState } from "react";
import { Order, CartItem, OrderStatus } from "../types";
import { initialOrders } from "../data/initialData";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabase";

// Define types for the context
type OrderAction =
  | {
      type: "ADD_ORDER";
      payload: Omit<Order, "id" | "createdAt" | "updatedAt">;
    }
  | {
      type: "UPDATE_ORDER_STATUS";
      payload: { id: string; status: OrderStatus };
    }
  | { type: "DELETE_ORDER"; payload: string };

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | {
      type: "UPDATE_SPECIAL_INSTRUCTIONS";
      payload: { id: string; instructions: string };
    };

type OrderDispatch = (action: OrderAction) => Promise<Order | null>;
type CartDispatch = (action: CartAction) => void;

type OrderContextType = {
  orders: Order[];
  cart: CartItem[];
  orderDispatch: OrderDispatch;
  cartDispatch: CartDispatch;
  cartTotal: number;
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
};

// Create the context
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Create provider component
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [cart, cartDispatch] = useReducer(cartReducer, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*, order_items(*)");

      if (fetchError) throw new Error(fetchError.message);

      setOrders(data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // Create an async orderDispatch function to handle database operations
  const orderDispatch: OrderDispatch = async (action) => {
    switch (action.type) {
      case "ADD_ORDER": {
        try {
          setLoading(true);
          setError(null);

          const now = new Date().toISOString();

          // Create the order data object
          const dbOrderData = {
            id: uuidv4(),
            created_at: now,
            updated_at: now,
            status: action.payload.status,
            customer_name: action.payload.customerName,
            customer_phone: action.payload.customerPhone,
            customer_address: action.payload.customerAddress,
            total_amount: action.payload.totalAmount,
          };

          // Extract order_items from the payload
          const { items } = action.payload;

          console.log("Submitting order:", dbOrderData);

          // Insert the order with proper field names
          const { data, error: orderError } = await supabase
            .from("orders")
            .insert([dbOrderData])
            .select()
            .single();

          if (orderError) {
            console.error("Order insertion error:", orderError);
            throw new Error(orderError.message);
          }

          console.log("Order created successfully:", data);

          // Insert the order items
          if (items && items.length > 0) {
            const orderItems = items.map((item) => ({
              order_id: data.id,
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
              special_instructions: item.specialInstructions || null,
            }));

            console.log("Creating order items:", orderItems);

            const { error: itemsError } = await supabase
              .from("order_items")
              .insert(orderItems);

            if (itemsError) {
              console.error("Order items insertion error:", itemsError);
              throw new Error(itemsError.message);
            }

            console.log("Order items created successfully");
          }

          // Convert from database format back to application format for local state
          const newOrder = {
            ...action.payload,
            id: data.id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };

          // Update the local state
          setOrders((prev) => [...prev, newOrder]);
          return data;
        } catch (err) {
          console.error("Complete error object:", err);
          setError(err instanceof Error ? err.message : "Failed to add order");
          return null;
        } finally {
          setLoading(false);
        }
        break;
      }

      case "UPDATE_ORDER_STATUS": {
        try {
          setLoading(true);
          setError(null);

          const { id, status } = action.payload;
          const updated_at = new Date().toISOString();

          const { data, error: updateError } = await supabase
            .from("orders")
            .update({ status, updated_at })
            .eq("id", id)
            .select()
            .single();

          if (updateError) throw new Error(updateError.message);

          // Update the local state
          setOrders((prev) =>
            prev.map((order) =>
              order.id === id ? { ...order, status, updated_at } : order
            )
          );

          return data;
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to update order status"
          );
          return null;
        } finally {
          setLoading(false);
        }
        break;
      }

      case "DELETE_ORDER": {
        try {
          setLoading(true);
          setError(null);

          const id = action.payload;

          // Delete the order items first due to foreign key constraint
          const { error: itemsDeleteError } = await supabase
            .from("order_items")
            .delete()
            .eq("order_id", id);

          if (itemsDeleteError) throw new Error(itemsDeleteError.message);

          // Delete the order
          const { data, error: deleteError } = await supabase
            .from("orders")
            .delete()
            .eq("id", id)
            .select()
            .single();

          if (deleteError) throw new Error(deleteError.message);

          // Update the local state
          setOrders((prev) => prev.filter((order) => order.id !== id));

          return data;
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to delete order"
          );
          return null;
        } finally {
          setLoading(false);
        }
        break;
      }

      default:
        return null;
    }
  };

  const value = {
    orders,
    cart,
    orderDispatch,
    cartDispatch,
    cartTotal,
    loading,
    error,
    fetchOrders,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

// Cart reducer function
function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];
    }
    case "REMOVE_FROM_CART":
      return state.filter((item) => item.id !== action.payload);
    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case "UPDATE_SPECIAL_INSTRUCTIONS":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, specialInstructions: action.payload.instructions }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

// Create hook for using the context
export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
