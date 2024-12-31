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
  _id?: string;
  id?: string;
  name: string;
  position: string;
  image: string | null;
  phone: string;
  sex: string;
  has_pos: boolean;
  email: string;
  admin_password: string | null;
  rfid: string | null;
  admin_rfid: string | null;
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
  uom_id: {
    _id: string;
    name: string;
  };
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

// Common types for order items
interface OrderItemBase {
  notes: string[];
  quantity: number;
  suite_commande: boolean;
  order_type_id: string;
}

// Type for combo sub-items (products and supplements)
interface ComboItem {
  variants: Array<{
    _id: string;
    name: string;
    quantity: number;
    customer_index: number;
    order_type_id: string;
  }>;
  supplements: Array<{
    _id: string;
    name: string;
    quantity: number;
    price_ttc: number;
    customer_index: number;
    order_type_id: string;
  }>;
}

// Type for product variants
interface ProductVariantInfo {
  name: string;
  uom_id?: { _id: string };
  price_ttc?: number;
}

// Main product type
export interface ProductSelected extends OrderItemBase {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  variants: any[];
  customer_index: number;
  order_type_id: string;
  is_combo?: boolean;
  combo_items?: ComboItem;
}

// Type guard for combo products
export const isComboProduct = (product: ProductSelected): product is ProductSelected & { is_combo: true } => {
  return product.is_combo === true;
};

export interface FilterCriteria {
  employee: string;
  orderType: string;
  status: string;
}
