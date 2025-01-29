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
          // Remove product if quantity is 0, matching notes as well
          const updatedProducts = prevProducts.filter((item) => {
            if (item.is_combo && product.is_combo) {
              return !(
                item.id === product.id &&
                item.customer_index === product.customer_index &&
                JSON.stringify(item.notes) === JSON.stringify(product.notes)
              );
            }
            return !(
              item.product_variant_id === product.product_variant_id &&
              item.customer_index === product.customer_index &&
              JSON.stringify(item.notes) === JSON.stringify(product.notes)
            );
          });
          updateCustomerDisplay(updatedProducts);
          return updatedProducts;
        }

        // Update quantity only for product with matching notes
        const updatedProducts = prevProducts.map((item) => {
          // For combo products
          if (item.is_combo && product.is_combo) {
            return item.id === product.id &&
              item.customer_index === product.customer_index &&
              JSON.stringify(item.notes) === JSON.stringify(product.notes)
              ? {
                ...item,
                quantity: newQuantity,
                price: calculateProductPrice(
                  item,
                  currentMenu,
                  newQuantity
                ).totalPrice,
              }
              : item;
          }

          // For regular products
          return item.product_variant_id === product.product_variant_id &&
            item.customer_index === product.customer_index &&
            JSON.stringify(item.notes) === JSON.stringify(product.notes)
            ? {
              ...item,
              quantity: newQuantity,
              price: calculateProductPrice(
                item,
                currentMenu,
                newQuantity
              ).totalPrice,
            }
            : item;
        });

        updateCustomerDisplay(updatedProducts);
        return updatedProducts;
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
