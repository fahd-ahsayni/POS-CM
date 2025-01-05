import { ProductSelected } from "../types";

interface Discount {
  _id: string;
  name: string;
  value: number;
  type: "percentage" | string;
}

interface SalesCalculation {
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
}

export const calculateSelectedProductsTotal = (
  selectedProducts: ProductSelected[],
  discount?: Discount | null,
  taxRate: number = 10
): SalesCalculation => {
  const rawTotal = selectedProducts.reduce((sum, product) => {
    const unitPrice =
      product.variants[0]?.price_ttc || product.price / product.quantity;
    const basePrice = unitPrice * (product.quantity || 0);

    const supplementsTotal = product.is_combo
      ? product.combo_items?.supplements?.reduce((suppTotal, supp) => {
          const suppUnitPrice = supp.price_ttc;
          return suppTotal + suppUnitPrice * supp.quantity;
        }, 0) || 0
      : 0;

    return sum + basePrice + supplementsTotal;
  }, 0);

  const tax = (rawTotal * taxRate) / (100 + taxRate);
  const subtotal = rawTotal - tax;

  let discountAmount = 0;
  if (discount) {
    discountAmount =
      discount.type === "percentage"
        ? (rawTotal * Number(discount.value)) / 100
        : Number(discount.value);
  }

  const total = subtotal + tax - discountAmount;

  return {
    subtotal,
    discountAmount,
    tax,
    total,
  };
};
