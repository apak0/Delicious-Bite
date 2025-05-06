import React, { createContext, useReducer, useState, useEffect } from "react";
import { Order, CartItem, OrderStatus, OrderItem, DbOrder } from "../types";
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

// Export the context and its type
export type { OrderContextType };
export const OrderContext = createContext<OrderContextType | undefined>(
  undefined
);

// Load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const savedCart = localStorage.getItem("delicious-bite-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart: CartItem[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("delicious-bite-cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

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

// Create provider component
export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, dispatch] = useReducer(cartReducer, [], loadCartFromStorage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  // Create a wrapper for cartDispatch that will also save to localStorage
  const cartDispatch: CartDispatch = (action) => {
    dispatch(action);
  };

  // Calculate cart total
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw new Error(userError.message);
      if (!user) {
        setOrders([]);
        return;
      }

      // Get user role
      const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (roleError) throw new Error(roleError.message);

      // Build the query based on user role
      let query = supabase.from("orders").select(`
          *,
          order_items:order_items (
            *,
            product:products (*)
          )
        `);

      // If user is not staff/admin, only show their own orders
      if (userData.role === "customer") {
        query = query.eq("user_id", user.id);
      }

      // Execute the query with sorting
      const { data: ordersData, error: fetchError } = await query.order(
        "created_at",
        { ascending: false }
      );

      if (fetchError) throw new Error(fetchError.message);

      // Transform the data to match your application's format
      const transformedOrders =
        ordersData?.map((order: DbOrder) => ({
          id: order.id,
          status: order.status,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerAddress: order.customer_address,
          totalAmount: order.total_amount,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          userId: order.user_id,
          items: order.order_items.map((item: OrderItem) => ({
            id: item.product_id,
            name: item.product.name,
            description: item.product.description,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.product.image_url,
            category: item.product.category,
            available: item.product.available,
            specialInstructions: item.special_instructions,
          })),
        })) || [];

      setOrders(transformedOrders);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching orders"
      );
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create the orderDispatch function
  const orderDispatch: OrderDispatch = async (action) => {
    switch (action.type) {
      case "ADD_ORDER": {
        try {
          setLoading(true);
          setError(null);

          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
          if (userError) throw new Error(userError.message);
          if (!user) throw new Error("User not found");

          const now = new Date().toISOString();
          const order = {
            ...action.payload,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            userId: user.id,
          };

          // Add the order
          const { error: orderError } = await supabase.from("orders").insert([
            {
              id: order.id,
              status: order.status,
              customer_name: order.customerName,
              customer_phone: order.customerPhone,
              customer_address: order.customerAddress,
              total_amount: order.totalAmount,
              created_at: order.createdAt,
              updated_at: order.updatedAt,
              user_id: order.userId,
            },
          ]);

          if (orderError) throw orderError;

          // Add order items
          const orderItems = order.items.map((item) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
            special_instructions: item.specialInstructions,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

          if (itemsError) throw itemsError;

          // Update local state
          setOrders((prev) => [order, ...prev]);
          return order;
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to create order"
          );
          console.error("Order creation error:", err);
          return null;
        } finally {
          setLoading(false);
        }
      }

      case "UPDATE_ORDER_STATUS": {
        try {
          setLoading(true);
          setError(null);

          const { id, status } = action.payload;
          const now = new Date().toISOString();

          const { error } = await supabase
            .from("orders")
            .update({ status, updated_at: now })
            .eq("id", id);

          if (error) throw error;

          // Update local state
          setOrders((prevOrders) => {
            return prevOrders.map((order) =>
              order.id === id ? { ...order, status, updatedAt: now } : order
            );
          });

          // Find and return the updated order
          return orders.find((order: Order) => order.id === id) || null;
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to update order status"
          );
          return null;
        } finally {
          setLoading(false);
        }
      }

      case "DELETE_ORDER": {
        try {
          setLoading(true);
          setError(null);

          const { error } = await supabase
            .from("orders")
            .delete()
            .eq("id", action.payload);

          if (error) throw error;

          // Update local state
          setOrders((prev) =>
            prev.filter((order) => order.id !== action.payload)
          );
          return null;
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to delete order"
          );
          return null;
        } finally {
          setLoading(false);
        }
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
