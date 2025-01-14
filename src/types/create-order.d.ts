interface OrderState {
  waiter_id: number | null;
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
  changed_price: number;
  order_type_id: string | null;
  orderlines: any[];
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

interface UpdateOrderLinePayload {
  _id: string;
  customerIndex: number;
  orderLine: {
    quantity?: number;
    discount?: OrderLineDiscount;
    // ... other possible fields
  };
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