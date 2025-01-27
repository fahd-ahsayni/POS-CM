import { BaseEntity } from "./common";
import { User } from "./user";

export interface PosData {
  _id: string;
  name: string;
  printer_ip: string;
  order_types: string[];
  user_id?: User;
  createdAt: string;
  updatedAt: string;
  shift: Shift | null;
}
export interface DayData {
  _id: string;
  name: string;
  opening_time: string;
  closing_time: null | string;
  status: string;
  revenue_system: number;
  revenue_declared: number;
  difference: number;
  cancel_total_amount: number;
  is_archived: boolean;
  opening_employee_id: string;
  createdAt: string;
  updatedAt: string;
}

// Shift interface for tracking work periods
export interface Shift extends BaseEntity {
  closing_time: string | null;
  starting_balance: number;
  status: string;
  cashdraw_number: string | null;
  day_id: string;
  user_id: User;
  closed_by: string | null;
  pos_id: string;
  shift_number: number;
  opening_time: string;
}
