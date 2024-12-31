export interface Tax {
  _id: string;
  name: string;
  value: number;
}

export interface UOM {
  _id: string;
  name: string;
}

export interface ProductVariant {
  _id: string;
  name: string;
  price_ttc: number;
  image: string;
  is_active: boolean;
  is_available: boolean;
  barcode: string;
  reference: string;
  is_menu: boolean;
  is_quantity_check: boolean;
  product_id: string;
  tax_id: Tax;
  uom_id: UOM;
  stages_timing: any[]; // Define the type if `stages_timing` has a specific structure
}

export interface Step {
  _id: string;
  name: string;
  is_required: boolean;
  is_supplement: boolean;
  product_variant_id: string;
  number_of_products: number;
  product_variant_ids: ProductVariant[];
}

export interface Product {
  _id: string;
  name: string;
  price_ttc: number;
  image: string;
  is_active: boolean;
  is_available: boolean;
  barcode: string;
  reference: string;
  is_menu: boolean;
  is_quantity_check: boolean;
  product_id: string;
  tax_id: Tax;
  uom_id: UOM;
  stages_timing: any[];
  steps: Step[];
}
