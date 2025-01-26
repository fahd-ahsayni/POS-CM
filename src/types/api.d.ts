// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export type UserPosition = "Cashier" | "Manager" | "Waiter" | "Livreur";

export interface LoginCredentials {
  id: string;
  password: string;
}

export interface RfidCredentials {
  rfid: string;
}

export interface ShiftData {
  starting_balance: string;
  pos_id: string;
}

// Add more interfaces as needed
