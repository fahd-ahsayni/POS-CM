import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";
import { ON_PLACE_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";

interface RightViewContextType {
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
}

const RightViewContext = createContext<RightViewContextType | null>(null);

export const RightViewProvider = ({ children }: { children: ReactNode }) => {
  const [views, setViews] = useState(TYPE_OF_ORDER_VIEW);
  const [selectedOrderType, setSelectedOrderType] = useState<string | null>(null);
  const [customerIndex, setCustomerIndex] = useState(1);
  const [orderType, setOrderType] = useState<string | null>(ON_PLACE_VIEW);
  const [tableNumber, setTableNumber] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<number>(1);

  const contextValue = useMemo(
    () => ({
      views,
      setViews: useCallback((view: string) => setViews(view), []),
      selectedOrderType,
      setSelectedOrderType: useCallback((type: string | null) => setSelectedOrderType(type), []),
      customerIndex,
      setCustomerIndex: useCallback((index: number) => setCustomerIndex(index), []),
      tableNumber,
      setTableNumber: useCallback((number: number) => setTableNumber(number), []),
      orderType,
      setOrderType: useCallback((type: string | null) => setOrderType(type), []),
      selectedCustomer,
      setSelectedCustomer: useCallback((customer: number) => setSelectedCustomer(customer), []),
    }),
    [views, selectedOrderType, customerIndex, tableNumber, orderType, selectedCustomer]
  );

  return (
    <RightViewContext.Provider value={contextValue}>
      {children}
    </RightViewContext.Provider>
  );
};

export const useRightViewContext = () => {
  const context = useContext(RightViewContext);
  if (!context) {
    throw new Error("useRightViewContext must be used within a RightViewProvider");
  }
  return context;
};
