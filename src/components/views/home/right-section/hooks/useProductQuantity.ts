import { useCallback } from 'react';
import { useLeftViewContext } from '@/components/views/home/left-section/contexts/leftViewContext';
import { ProductSelected } from '@/types';

export const useProductQuantity = () => {
  const { setSelectedProducts } = useLeftViewContext();

  const incrementQuantity = useCallback((product: ProductSelected) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((item) =>
        item._id === product._id &&
        item.customer_index === product.customer_index
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, [setSelectedProducts]);

  const decrementQuantity = useCallback((product: ProductSelected) => {
    setSelectedProducts((prevProducts) =>
      prevProducts
        .map((item) =>
          item._id === product._id &&
          item.customer_index === product.customer_index
            ? { ...item, quantity: item.quantity - 1 }
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