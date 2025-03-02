import { BaseEntity, Tax, UnitOfMeasure } from "./common";
import { OrderLineDiscount } from "./order";

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
  is_ordred?: boolean;
  image: string;
  is_active: boolean;
  is_available: boolean;
  barcode: string;
  default_price?: number;
  reference: string;
  is_menu: boolean;
  is_quantity_check: boolean;
  notes: string[];
  product_id: string;
  suite_commande: boolean;
  tax_id: Tax;
  steps: any[];
  uom_id: UnitOfMeasure;
  stages_timing: any;
  menus: {
    menu_id: string;
    price_ttc: number;
    _id: string;
  }[];
  supplements?: Array<{
    _id: string;
    name: string;
    price_ttc: number;
    default_price?: number;
    quantity?: number;
    menus?: Array<{
      menu_id: string;
      price_ttc: number;
    }>;
  }>;
}

interface MenuProduct {
  _id: string; // Unique identifier for the menu product
  menu_id: string; // ID of the associated menu
  product_id: string; // ID of the associated product
  archived: boolean; // Indicates if the item is archived
  is_displayed: boolean; // Indicates if the item is displayed
  in_mobile: boolean; // Indicates if the item is available on mobile
  in_pos: boolean; // Indicates if the item is available in POS (Point of Sale)
  createdAt: string; // Timestamp of when the item was created
  updatedAt: string; // Timestamp of the last update
  __v: number; // Version key for Mongoose
}

export interface Product extends BaseEntity {
  active: boolean;
  image: string | null;
  name: string;
  description: string | null;
  menus: MenuProduct[];
  sequence: number;
  category_id: string;
  variants: ProductVariant[];
  quantity?: number;
  customer_index?: number;
}

export interface ProductSelected extends Product {
  product_variant_id: string;
  quantity: number;
  suite_ordred: boolean;
  discount?: OrderLineDiscount;
  price_ttc?: number;
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
  _animation?: "reverse" | string;
}

export const isComboProduct = (
  product: ProductSelected
): product is ProductSelected & { is_combo: true } => {
  return product.is_combo === true;
};

export interface Step {
  _id: string;
  name: string;
  stepIndex: number;
  is_required: boolean;
  is_supplement: boolean;
  product_variant_id: string;
  number_of_products: number;
  product_variant_ids: ProductVariant[];
}
