import { createContext, ReactNode, useContext, useState, useEffect } from "react";
type OrderLinesContextType = {
  expandedCustomers: Record<number, boolean>;
  toggleCustomer: (index: number) => void;
  toggleAllCustomers: () => void;
  initializeCustomer: (index: number) => void;
};
const OrderLinesContext = createContext<OrderLinesContextType | null>(null);
export function OrderLinesProvider({ children }: { children: ReactNode }) {
  const [expandedCustomers, setExpandedCustomers] = useState<
    Record<number, boolean>
  >({});
  const toggleCustomer = (index: number) => {
    setExpandedCustomers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  const toggleAllCustomers = () => {
    setExpandedCustomers((prev) => {
      const newState: Record<number, boolean> = {};
      const keys = Object.keys(prev);
      const targetState = !keys.every((k) => prev[Number(k)]);

      keys.forEach((k) => {
        newState[Number(k)] = targetState;
      });

      return newState;
    });
  };
  const initializeCustomer = (index: number) => {
    setExpandedCustomers((prev) => {
      const newState = { ...prev };
      if (index > 1) {
        Object.keys(newState).forEach(k => {
          newState[Number(k)] = false;
        });
      }
      newState[index] = true;
      return newState;
    });
  };
  const value = {
    expandedCustomers,
    toggleCustomer,
    toggleAllCustomers,
    initializeCustomer,
  };
  return (
    <OrderLinesContext.Provider value={value}>
      {children}
    </OrderLinesContext.Provider>
  );
}

export const useOrderLines = () => {
  const context = useContext(OrderLinesContext);
  if (!context) {
    throw new Error("useOrderLines must be used within OrderLinesProvider");
  }
  return context;
};
