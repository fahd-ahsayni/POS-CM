import { User } from "./user.types";

// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Auth types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  id: string;
  password: string;
}

export interface RfidCredentials {
  rfid: string;
}

// Shift types
export interface ShiftData {
  starting_balance: string;
  pos_id: string;
}

export interface ShiftResponse {
  shift: {
    _id: string;
    starting_balance: string;
    pos_id: string;
  };
}

// User types
export type UserPosition = "Cashier" | "Manager" | "Waiter" | "Livreur";

// Order types
export interface OrderDiscount {
  order_id: string;
  discount_id: string;
  reason: string;
}

// Payment types
export interface PaymentData {
  order_id: string;
  amount: number;
  payment_method: string;
}

// Add more interfaces as needed
