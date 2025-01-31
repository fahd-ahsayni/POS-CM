import { updateCustomerDisplay } from "@/components/global/Customer-display/useCustomerDisplay";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { ProductSelected } from "@/interfaces/product";
import { useCallback } from "react";

export const useProductQuantity = () => {
  const { setSelectedProducts, currentMenu } = useLeftViewContext();

  const updateQuantity = useCallback(
    (product: ProductSelected, newQuantity: number) => {
      if (newQuantity < 0) return;

      setSelectedProducts((prevProducts) => {
        if (newQuantity === 0) {
          return prevProducts.filter((item) => {
            return !(
              item.id === product.id &&
              item.customer_index === product.customer_index &&
              JSON.stringify(item.notes) === JSON.stringify(product.notes)
            );
          });
        }

        return prevProducts.map((item) =>
          item.id === product.id &&
          item.customer_index === product.customer_index &&
          JSON.stringify(item.notes) === JSON.stringify(product.notes)
            ? {
                ...item,
                quantity: newQuantity,
                price: calculateProductPrice(item, currentMenu, newQuantity)
                  .totalPrice,
              }
            : item
        );
      });
    },
    [setSelectedProducts, currentMenu]
  );

  const incrementQuantity = useCallback(
    (product: ProductSelected) => {
      updateQuantity(product, product.quantity + 1);
    },
    [updateQuantity]
  );

  const decrementQuantity = useCallback(
    (product: ProductSelected) => {
      updateQuantity(product, product.quantity - 1);
    },
    [updateQuantity]
  );

  return { incrementQuantity, decrementQuantity, updateQuantity };
};
