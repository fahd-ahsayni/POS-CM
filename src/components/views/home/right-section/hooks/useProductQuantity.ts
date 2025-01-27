import { updateCustomerDisplay } from "@/components/global/Customer-display/useCustomerDisplay";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { ProductSelected } from "@/interfaces/product";
import { useCallback } from "react";

export const useProductQuantity = () => {
  const { setSelectedProducts, currentMenu } = useLeftViewContext();

  const updateQuantity = useCallback(
    (product: ProductSelected, newQuantity: number) => {
      if (newQuantity < 0) return; // Prevent negative quantities

      setSelectedProducts((prevProducts) => {
        if (newQuantity === 0) {
          // Remove product if quantity is 0
          const updatedProducts = prevProducts.filter((item) => {
            if (item.is_combo && product.is_combo) {
              return !(
                item.id === product.id &&
                item.customer_index === product.customer_index
              );
            }
            return !(
              item.product_variant_id === product.product_variant_id &&
              item.customer_index === product.customer_index
            );
          });
          updateCustomerDisplay(updatedProducts);
          return updatedProducts;
        }

        // Update quantity for existing product
        const updatedProducts = prevProducts.map((item) => {
          // For combo products
          if (item.is_combo && product.is_combo) {
            return item.id === product.id &&
              item.customer_index === product.customer_index
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
            item.customer_index === product.customer_index
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
