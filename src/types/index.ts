// Type definitions for the application

// Frontend types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  available: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  estimatedDeliveryTime?: string;
}

export interface User {
  id: string;
  name: string;
  role: "customer" | "staff" | "admin";
}

// Database types
export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  available: boolean;
}

export interface OrderItem {
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  special_instructions?: string;
  product: DbProduct;
}

export interface DbOrder {
  id: string;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  order_items: OrderItem[];
}
