import { OrderType } from "@/interfaces/order";

export const useOrderType = () => {
  const getOrderType = (): OrderType | null => {
    try {
      const orderTypeStr = localStorage.getItem("orderType");
      return orderTypeStr ? JSON.parse(orderTypeStr) : null;
    } catch {
      return null;
    }
  };

  const isWaitersDisabled = (): boolean => {
    const orderType = getOrderType();
    // Only enable when either delivery boy OR table is true
    return !(orderType?.select_delivery_boy || orderType?.select_table);
  };

  const getWaitersLabel = (): string => {
    const orderType = getOrderType();
    return orderType?.select_delivery_boy ? "Delivery" : "Waiters";
  };

  return { isWaitersDisabled, getWaitersLabel };
};
