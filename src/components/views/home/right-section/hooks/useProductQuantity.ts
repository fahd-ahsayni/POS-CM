import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { ProductSelected } from "@/types";
import { useCallback } from "react";

export const useProductQuantity = () => {
  const { setSelectedProducts } = useLeftViewContext();

  const incrementQuantity = useCallback((product: ProductSelected) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((item) =>
        (item.is_combo ? item.id === product.id : item.product_variant_id === product.product_variant_id) &&
        item.customer_index === product.customer_index
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              price: item.is_combo 
                ? calculateComboPrice(item, item.quantity + 1)
                : (item.price / item.quantity) * (item.quantity + 1),
              combo_items: (item.is_combo && item.combo_items) ? {
                variants: item.combo_items.variants.map((v: any) => ({
                  ...v,
                  quantity: v.quantity * ((item.quantity + 1) / item.quantity)
                })),
                supplements: item.combo_items.supplements.map((s: any) => ({
                  ...s,
                  quantity: s.quantity * ((item.quantity + 1) / item.quantity)
                }))
              } : undefined
            }
          : item
      )
    );
  }, [setSelectedProducts]);

  const decrementQuantity = useCallback((product: ProductSelected) => {
    setSelectedProducts((prevProducts) =>
      prevProducts
        .map((item) =>
          (item.is_combo ? item.id === product.id : item.product_variant_id === product.product_variant_id) &&
          item.customer_index === product.customer_index
            ? { 
                ...item, 
                quantity: item.quantity - 1,
                price: item.is_combo 
                  ? calculateComboPrice(item, item.quantity - 1)
                  : (item.price / item.quantity) * (item.quantity - 1),
                combo_items: (item.is_combo && item.combo_items) ? {
                  variants: item.combo_items.variants.map((v: any) => ({
                    ...v,
                    quantity: v.quantity * ((item.quantity - 1) / item.quantity)
                  })),
                  supplements: item.combo_items.supplements.map((s: any) => ({
                    ...s,
                    quantity: s.quantity * ((item.quantity - 1) / item.quantity)
                  }))
                } : undefined
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, [setSelectedProducts]);

  // Helper function to calculate combo price
  const calculateComboPrice = (item: ProductSelected, newQuantity: number) => {
    const basePrice = item.variants[0].price_ttc;
    const supplementsTotal = item.combo_items?.supplements.reduce(
      (total, supp) => total + (supp.price_ttc * supp.quantity),
      0
    ) || 0;

    return (basePrice + supplementsTotal) * newQuantity;
  };

  return {
    incrementQuantity,
    decrementQuantity
  };
};
