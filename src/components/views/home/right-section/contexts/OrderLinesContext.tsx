import { createContext, ReactNode, useContext, useState, useCallback } from "react";

interface OrderLinesContextType {
  expandedCustomers: Record<number, boolean>;
  toggleCustomer: (index: number) => void;
  toggleAllCustomers: () => void;
  initializeCustomer: (index: number) => void;
}

const OrderLinesContext = createContext<OrderLinesContextType | null>(null);

export function OrderLinesProvider({ children }: { children: ReactNode }) {
  const [expandedCustomers, setExpandedCustomers] = useState<Record<number, boolean>>({});

  const toggleCustomer = useCallback((index: number) => {
    setExpandedCustomers(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const toggleAllCustomers = useCallback(() => {
    setExpandedCustomers(prev => {
      const keys = Object.keys(prev);
      const targetState = !keys.every(k => prev[Number(k)]);
      
      return keys.reduce((acc, k) => ({
        ...acc,
        [Number(k)]: targetState
      }), {});
    });
  }, []);

  const initializeCustomer = useCallback((index: number) => {
    setExpandedCustomers(prev => {
      const newState = index > 1 
        ? Object.keys(prev).reduce((acc, k) => ({
            ...acc,
            [Number(k)]: false
          }), {})
        : { ...prev };
      
      return { ...newState, [index]: true };
    });
  }, []);

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
