import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { ProductSelected } from "@/types/product.types";
import { useCallback } from "react";

export const useProductQuantity = () => {
  const { setSelectedProducts, currentMenu } = useLeftViewContext();

  const incrementQuantity = useCallback(
    (product: ProductSelected) => {
      setSelectedProducts((prevProducts) =>
        prevProducts.map((item) =>
          (item.is_combo
            ? item.id === product.id
            : item.product_variant_id === product.product_variant_id) &&
          item.customer_index === product.customer_index
            ? {
                ...item,
                quantity: item.quantity + 1,
                price: calculateProductPrice(
                  item,
                  currentMenu,
                  item.quantity + 1
                ).totalPrice,
              }
            : item
        )
      );
    },
    [setSelectedProducts, currentMenu]
  );

  const decrementQuantity = useCallback(
    (product: ProductSelected) => {
      setSelectedProducts((prevProducts) =>
        prevProducts
          .map((item) =>
            (item.is_combo
              ? item.id === product.id
              : item.product_variant_id === product.product_variant_id) &&
            item.customer_index === product.customer_index
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                  price: calculateProductPrice(
                    item,
                    currentMenu,
                    item.quantity - 1
                  ).totalPrice,
                }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
    },
    [setSelectedProducts, currentMenu]
  );

  return { incrementQuantity, decrementQuantity };
};
