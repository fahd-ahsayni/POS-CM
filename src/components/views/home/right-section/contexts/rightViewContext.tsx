import { createContext, useContext, useState, ReactNode } from "react";
import { ON_PLACE_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";

// Create a context for the tab state
const RightViewContext = createContext<{
  views: string;
  setViews: (view: string) => void;
  selectedOrderType: string | null;
  setSelectedOrderType: (type: string | null) => void;
  customerIndex: number;
  setCustomerIndex: (index: number) => void;
  tableNumber: number;
  setTableNumber: (number: number) => void;
  orderType: string | null;
  setOrderType: (type: string | null) => void;
  selectedCustomer: number;
  setSelectedCustomer: (customer: number) => void;
} | null>(null);

// Create a provider component
export const RightViewProvider = ({ children }: { children: ReactNode }) => {
  const [views, setViews] = useState(TYPE_OF_ORDER_VIEW);
  const [selectedOrderType, setSelectedOrderType] = useState<string | null>(
    null
  );

  const [customerIndex, setCustomerIndex] = useState(1);
  const [orderType, setOrderType] = useState<string | null>(ON_PLACE_VIEW);
  const [tableNumber, setTableNumber] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<number>(1);

  return (
    <RightViewContext.Provider
      value={{
        views,
        setViews,
        selectedOrderType,
        setSelectedOrderType,
        customerIndex,
        setCustomerIndex,
        tableNumber,
        setTableNumber,
        orderType,
        setOrderType,
        selectedCustomer,
        setSelectedCustomer,
      }}
    >
      {children}
    </RightViewContext.Provider>
  );
};

// Custom hook to use the TabContext
export const useRightViewContext = () => {
  const context = useContext(RightViewContext);
  if (!context) {
    return {
      views: TYPE_OF_ORDER_VIEW,
      setViews: () => {},
      selectedOrderType: null,
      setSelectedOrderType: () => {},
      customerIndex: 1,
      setCustomerIndex: () => {},
      tableNumber: 1,
      setTableNumber: () => {},
      orderType: ON_PLACE_VIEW,
      setOrderType: () => {},
      selectedCustomer: 1,
      setSelectedCustomer: () => {},
    };
  }
  return context;
};
