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
  discount?: Discount,
  taxRate: number = 10
): SalesCalculation => {
  const total = selectedProducts.reduce((sum, product) => {
    const basePrice = product.price * (product.quantity || 0);

    const supplementsTotal = product.is_combo
      ? product.combo_items?.supplements?.reduce(
          (suppTotal, supp) => suppTotal + supp.price_ttc * supp.quantity,
          0
        ) || 0
      : 0;

    return sum + basePrice + supplementsTotal;
  }, 0);

  // Work backwards to get subtotal
  const tax = (total * taxRate) / (100 + taxRate);
  const subtotalWithDiscount = total - tax;

  let subtotal = subtotalWithDiscount;
  if (discount) {
    subtotal =
      discount.type === "percentage"
        ? subtotalWithDiscount / (1 - discount.value / 100)
        : subtotalWithDiscount + discount.value;
  }

  return {
    subtotal,
    discountAmount: subtotal - subtotalWithDiscount,
    tax,
    total,
  };
};
