import { BaseEntity, Tax, UnitOfMeasure } from "./common.types";
import { OrderLineDiscount } from "./order.types";

export interface Menu extends BaseEntity {
  name: string;
  description: string;
  default: boolean;
  category_ids: string[];
  active: boolean;
  archived: boolean;
  in_pos: boolean;
  in_mobile: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  sequence: number;
  menu_ids: string[];
  image: string | null;
  parent_id: string | null;
  products: Product[];
  children: Category[];
}

export interface categories {
  menu: Menu;
  categories: Category[];
}

export interface ProductVariant extends BaseEntity {
  name: string;
  price_ttc: number;
  image: string;
  is_active: boolean;
  is_available: boolean;
  barcode: string;
  reference: string;
  is_menu: boolean;
  is_quantity_check: boolean;
  notes: string[];
  product_id: string;
  suite_commande: boolean;
  tax_id: Tax;
  uom_id: UnitOfMeasure;
  stages_timing: any;
  menus: {
    menu_id: string;
    price_ttc: number;
    _id: string;
  }[];
}

export interface Product extends BaseEntity {
  active: boolean;
  image: string | null;
  name: string;
  description: string | null;
  sequence: number;
  category_id: string;
  variants: ProductVariant[];
  quantity?: number;
}

export interface ProductSelected extends Product {
  id?: string;
  product_variant_id: string;
  quantity: number;
  discount?: OrderLineDiscount;
  price: number;
  customer_index: number;
  order_type_id: string;
  uom_id: string;
  notes: string[];
  is_paid: boolean;
  is_ordred: boolean;
  suite_commande: boolean;
  high_priority: boolean;
  is_combo?: boolean;
  combo_items?: {
    variants: any[];
    supplements: any[];
  };
}

export const isComboProduct = (
  product: ProductSelected
): product is ProductSelected & { is_combo: true } => {
  return product.is_combo === true;
};

export interface Step {
  _id: string;
  name: string;
  is_required: boolean;
  is_supplement: boolean;
  product_variant_id: string;
  number_of_products: number;
  product_variant_ids: ProductVariant[];
}
