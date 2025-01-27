import { ProductSelected } from "@/interfaces/product";

export const getMaxCustomerIndex = (products: ProductSelected[]): number => {
  if (!products || products.length === 0) return 1;

  return Math.max(...products.map((product) => product.customer_index));
};
