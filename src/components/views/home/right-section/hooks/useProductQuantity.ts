import { useCallback } from 'react';
import { useLeftViewContext } from '@/components/views/home/left-section/contexts/leftViewContext';
import { ProductSelected } from '@/types';

export const useProductQuantity = () => {
  const { setSelectedProducts } = useLeftViewContext();

  const incrementQuantity = useCallback((product: ProductSelected) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.product_variant_id === product.product_variant_id &&
        item.customer_index === product.customer_index
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              price: (item.price / item.quantity) * (item.quantity + 1) // Update total price
            }
          : item
      )
    );
  }, [setSelectedProducts]);

  const decrementQuantity = useCallback((product: ProductSelected) => {
    setSelectedProducts((prevProducts) =>
      prevProducts
        .map((item) =>
          item.product_variant_id === product.product_variant_id &&
          item.customer_index === product.customer_index
            ? { 
                ...item, 
                quantity: item.quantity - 1,
                price: (item.price / item.quantity) * (item.quantity - 1) // Update total price
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, [setSelectedProducts]);

  return {
    incrementQuantity,
    decrementQuantity
  };
};