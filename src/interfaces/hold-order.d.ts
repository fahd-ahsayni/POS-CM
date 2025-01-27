import { OrderLine, OrderType } from "./order";
import { Shift } from "./pos";
import { Table } from "./table";
import { User } from "./user";

export interface Order {
  _id: string;
  ref: string;
  order_number: number;
  discount_amount: number;
  total_amount: number;
  notes: string;
  customer_count: number;
  one_time: boolean;
  urgent: boolean;
  status: "new" | "paid" | "cancelled";
  client_id?: string | null;
  shift_id: string;
  table_id?: string | null;
  waiter_id?: string | null;
  order_type_id: string;
  delivery_guy_id?: string | null;
  number_of_place: number;
  created_by: User;
  updated_by: string;
  orderline_ids: OrderLine[];
  archived: boolean;
  coaster_call?: string | null;
  discount?: any | null;
  createdAt: string;
  updatedAt: string;
}
