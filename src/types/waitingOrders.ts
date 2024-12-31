import { OrderType, ProductVariant } from "./getDataByDay";

export interface WaitingOrderLine {
  product_variant_id: string;
  quantity: number;
  price: number;
  customer_index: number;
  notes: string[];
  is_paid: boolean;
  is_ordred: boolean;
  suite_commande: boolean;
  variant?: ProductVariant;
}

export interface WaitingOrder {
  _id: string;
  createdAt: string;
  created_by: {
    name: string;
    _id: string;
  };
  order_type_id: OrderType;
  total_amount: number;
  orderLines: WaitingOrderLine[];
}
