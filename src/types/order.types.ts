import { BaseEntity } from "./common.types";
import { User } from "./user.types";
import { ProductVariant } from "./product.types";
import { Shift } from "./pos.types";

export type OrderSelectionType =
  | "onPlace"
  | "takeAway"
  | "delivery"
  | "ownDelivery"
  | "tableConfirmation"
  | null;

export interface OrderType extends BaseEntity {
  menu_id?: string;
  name: string;
  sequence: number;
  select_table: boolean;
  select_delivery_boy: boolean;
  select_client: boolean;
  select_coaster_call: boolean;
  in_mobile: boolean;
  type: OrderSelectionType; // Using the new type instead of string
  image: string;
  parent_id: string | null;
  children: OrderType[];
  delivery_product_variant_id?: string | null;
}

export interface OrderLineDiscount {
  discount_id: string;
  reason: string;
  confirmed_by: string;
}

export interface OrderLine extends BaseEntity {
  price: number;
  discount_amount: number;
  discount?: OrderLineDiscount; // Added optional discount
  customer_index: number;
  notes: string[];
  quantity: number;
  cancelled_qty: number;
  suite_commande: boolean;
  suite_ordred: boolean;
  high_priority: boolean;
  is_paid: boolean;
  is_ordred: boolean;
  product_variant_id: ProductVariant;
  order_type_id: OrderType;
  combo_prod_ids: unknown[];
  combo_supp_ids: unknown[];
}

export interface Order extends BaseEntity {
  ref: string;
  order_number: number;
  orderline_ids: OrderLine[];
  discount_amount: number;
  total_amount: number;
  notes: string[] | null;
  customer_count: number;
  one_time: boolean;
  urgent: boolean;
  status: string;
  client_id: string;
  shift_id: Shift | null;
  table_id: string | null;
  waiter_id: string | null;
  order_type_id: OrderType;
  delivery_guy_id: string | null;
  number_of_place: number;
  created_by: User;
  updated_by: string | null;
  coaster_call: number | null;
  archived: boolean;
  changed_price: number | null;
}
