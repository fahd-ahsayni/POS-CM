import { v4 as uuidv4 } from 'uuid';
import { ProductSelected } from '@/interfaces/product';

/**
 * Ensures a product has consistent ID properties
 * @param product The product to ensure IDs for
 * @returns The product with consistent IDs
 */
export const ensureProductIds = (product: ProductSelected): ProductSelected => {
  const uniqueId = product.id || product._id || uuidv4();
  
  return {
    ...product,
    id: uniqueId,
    _id: uniqueId
  };
};

/**
 * Creates a new instance of a product with unique IDs
 * @param product The product to clone
 * @returns A new product instance with unique IDs
 */
export const createNewProductInstance = (product: ProductSelected): ProductSelected => {
  const uniqueId = uuidv4();
  
  return {
    ...product,
    id: uniqueId,
    _id: uniqueId
  };
};

/**
 * Finds a product by its exact ID (either id or _id)
 * @param products Array of products to search
 * @param productId The ID to search for
 * @param customerIndex Optional customer index to match
 * @returns The found product or undefined
 */
export const findProductById = (
  products: ProductSelected[],
  productId: string,
  customerIndex?: number
): ProductSelected | undefined => {
  return products.find(p => 
    (p.id === productId || p._id === productId) && 
    (customerIndex === undefined || p.customer_index === customerIndex)
  );
};
