import { useMemo, useCallback } from "react";
import { ProductSelected } from "@/interfaces/product";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { toTitleCase } from "@/functions/string-transforms";

interface UseOrderLineProps {
  item: ProductSelected;
  currentMenu: string | null | undefined;
  customerIndex: number;
  setCustomerIndex: (index: number) => void;
}

export function useOrderLine({
  item,
  currentMenu,
  customerIndex,
  setCustomerIndex,
}: UseOrderLineProps) {
  const prices = useMemo(() => {
    return calculateProductPrice(item, currentMenu, item.quantity);
  }, [item, currentMenu]);

  const itemVariants = useMemo(
    () => ({
      initial: {
        opacity: 0,
        x: item._animation === "reverse" ? -20 : 20,
      },
      animate: {
        opacity: 1,
        x: 0,
      },
      exit: {
        opacity: 0,
        x: -20,
      },
    }),
    [item._animation]
  );

  const selectCustomer = useCallback(() => {
    if (item.customer_index && item.customer_index !== customerIndex) {
      setCustomerIndex(item.customer_index);
    }
  }, [item.customer_index, customerIndex, setCustomerIndex]);

  const getDisplayName = (variant: any) => {
    if (!variant) return "Unknown Product";
    return toTitleCase((variant.name || "Unknown Product").toLowerCase());
  };

  const isComboProduct = useMemo(
    () => item.is_combo || (item.variants?.[0]?.is_menu && item.combo_items),
    [item]
  );

  return {
    prices,
    itemVariants,
    selectCustomer,
    getDisplayName,
    isComboProduct,
  };
}
