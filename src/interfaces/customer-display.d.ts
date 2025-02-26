export interface Product {
  customer_index: number;
  variants: Array<{
    name: string;
    price_ttc: number;
    menus?: Array<{ menu_id: string; price_ttc: number }>;
    default_price?: number;
    is_menu?: boolean;
  }>;
  name: string;
  quantity: number;
  price: number;
  is_combo?: boolean;
  combo_items?: {
    variants: Array<any>;
    supplements: Array<any>;
  };
  discount?: {
    discount_id: string;
    reason: string;
    confirmed_by: string;
  };
  product_variant_id?: string;
}

export interface GroupedProducts {
  [key: string]: Product[];
}
