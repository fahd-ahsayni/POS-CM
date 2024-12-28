interface Tax {
  _id: string;
  name: string;
  value: number;
}

interface UnitOfMeasure {
  _id: string;
  name: string;
}

interface ProductVariant {
  _id: string;
  name: string;
  price_ttc: number;
  image: string;
  is_active: boolean;
  in_mobile_pos: boolean;
  in_pos: boolean;
  is_available: boolean;
  barcode: string;
  reference: string;
  is_menu: boolean;
  is_quantity_check: boolean;
  product_id: string;
  tax_id: Tax;
  uom_id: UnitOfMeasure;
}

interface OrderType {
  _id: string;
  name: string;
  sequence: number;
  select_table: boolean;
  select_delivery_boy: boolean;
  select_client: boolean;
  select_coaster_call: boolean;
  in_mobile: boolean;
  type: string;
  image: string;
  parent_id: string | null;
  delivery_product_variant_id: string | null;
}

interface User {
  _id: string;
  name: string;
  position: string;
  kitchen_post_id: string | null;
  image: string | null;
  phone: string;
  sex: string;
  email: string;
  has_pos?: boolean;
  admin_password: string | null;
  rfid: string | null;
  admin_rfid: string | null;
}

interface Shift {
  _id: string;
  closing_time: string;
  starting_balance: number;
  status: string;
  cashdraw_number: string | null;
  day_id: string;
  user_id: User;
  closed_by: string;
  pos_id: string;
  shift_number: number;
  opening_time: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderLine {
  _id: string;
  price: number;
  discount_amount: number;
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
  combo_prod_ids: any[];
  combo_supp_ids: any[];
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  ref: string;
  order_number: number;
  orderline_ids: any[];
  __v: number;
  discount_amount: number;
  total_amount: number;
  notes: string[];
  customer_count: number;
  one_time: boolean | false;
  urgent: boolean | false;
  status: string;
  client_id: string;
  shift_id: object | null;
  table_id: string | null;
  waiter_id: string | null;
  order_type_id: object | null;
  delivery_guy_id: string | null;
  number_of_place: number;
  created_by: object | null;
  updated_by: string | null;
  createdAt: string;
  updatedAt: string;
  coaster_call: number | null;
  archived: boolean | false;
}

export type {
  Order,
  OrderLine,
  ProductVariant,
  OrderType,
  User,
  Shift,
  Tax,
  UnitOfMeasure,
};
