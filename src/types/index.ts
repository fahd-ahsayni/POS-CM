import { products } from "./../data/index";
export interface GeneralData {
  floors: object[];
  categories: Category[]; // Updated to include nested categories
  configs: object[];
  defineNote: object[];
  orderTypes: object[];
  discount: object[];
  paymentMethods: object[];
  waiters: object[];
  livreurs: object[];
}

export interface GeneralDataState {
  data: GeneralData;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  image?: string | null;
}
// Define types
export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string | null;
  sequence: number;
  category: string;
  description: string | null;
  active: boolean;
  variants: Variant[];
  quantity?: number;
}

export interface Variant {
  _id: string;
  name: string;
  price_ttc: number;
  image: string | null;
  is_active: boolean;
  is_available: boolean;
  barcode: string | null;
  reference: string | null;
  is_menu: boolean;
  is_quantity_check: boolean;
  products_id: string;
  stage_timing: string | null;
  tax_id: object | null;
  uom_id: object | null;
  step: object[] | string[];
}

export interface Category {
  _id: string;
  name: string;
  sequence: number;
  image: string | null;
  parent__id: string | null;
  products: Product[];
  children: Category[];
}

export interface OrderType {
  _id: string;
  name: string;
  sequence: number;
  select_table: boolean;
  select_delivery_boy: boolean;
  select_client: boolean;
  select_coaster_call: boolean;
  type: string;
  image: string | null;
  parent_id: null;
  delivery_product_variant_id: object | null;
  children: [];
}

export type OrderSelectionState = {
  selectedOrderType:
    | "onPlace"
    | "takeAway"
    | "delivery"
    | "ownDelivery"
    | "tableConfirmation"
    | null;
};

export interface ProductSelected extends Product {
  variant_id: string;
  quantity: number;
  customer_index: number;
  order_type_id: string;
  note?: string[];
  suite_commande?: boolean;
}
