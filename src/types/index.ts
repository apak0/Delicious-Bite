// Type definitions for the application

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
}

export interface User {
  id: string;
  name: string;
  role: "customer" | "staff" | "admin";
}
