import { Product } from "../types";

export const calculateSelectedProductsTotal = (
  selectedProducts: Product[]
): number => {
  return selectedProducts.reduce(
    (total, product) => total + product.price * (product.quantity || 1),
    0
  );
};
