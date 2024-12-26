import { Category, Product } from "@/types";

export const extractProducts = (
  categories: Category[] | undefined
): Product[] => {
  if (!categories || !Array.isArray(categories)) {
    return [];
  }

  let allProducts: Product[] = [];

  categories.forEach((category) => {
    if (category?.products) {
      const productsWithPrice = category.products.map((product) => {
        const minPrice = product.variants
          ? Math.min(...product.variants.map((variant) => variant.price_ttc))
          : 0;
        return { ...product, price: minPrice };
      });
      allProducts = allProducts.concat(productsWithPrice);
    }
    if (category?.children && category.children.length > 0) {
      allProducts = allProducts.concat(extractProducts(category.children));
    }
  });

  return allProducts.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
};
