interface OrderState {
  _id?: string;
  waiter_id: string | null;
  coaster_call: string | null;
  urgent: boolean | false;
  shift_id: string;
  table_id: string | null;
  delivery_guy_id: string | null;
  discount: any | null;
  client_id: string | null;
  customer_count: number;
  notes: string;
  one_time: boolean;
  total_amount: number;
  changed_price: number | null;
  order_type_id: string | null;
  orderlines: any[];
  changed_price_reason?: string;
  changed_price_confirmed_by?: string;
}

interface OrderSliceState {
  data: OrderState;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

interface OrderLineDiscount {
  discount_id: string;
  reason: string;
  confirmed_by: string | number;
}

interface SetOrderTypePayload {
  order_type_id: string | null;
  table_id?: string | null;
  client_id?: string | null;
  coaster_call?: string | null;
}

interface PriceCalculation {
  basePrice: number;
  supplementsTotal: number;
  unitPrice: number;
  totalPrice: number;
}
