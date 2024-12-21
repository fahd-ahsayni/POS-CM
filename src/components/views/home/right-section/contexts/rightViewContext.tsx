import { setCustomerCount } from "@/store/slices/order/createOrder";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ON_PLACE_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";

interface RightViewContextType {
  views: string;
  setViews: (view: string) => void;
  selectedOrderType: string | null;
  setSelectedOrderType: (type: string | null) => void;
  customerIndex: number;
  setCustomerIndex: (index: number) => void;
  tableNumber: string;
  setTableNumber: (number: string) => void;
  orderType: string | null;
  setOrderType: (type: string | null) => void;
  selectedCustomer: number;
  setSelectedCustomer: (customer: number) => void;
}

const RightViewContext = createContext<RightViewContextType>({} as RightViewContextType);

export const RightViewProvider = ({ children }: { children: ReactNode }) => {
  const [views, setViews] = useState(TYPE_OF_ORDER_VIEW);
  const [selectedOrderType, setSelectedOrderType] = useState<string | null>(null);
  const [customerIndex, setCustomerIndex] = useState(1);
  const [orderType, setOrderType] = useState<string | null>(ON_PLACE_VIEW);
  const [tableNumber, setTableNumber] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number>(1);

  // Define callbacks at the top level
  const handleSetViews = useCallback((view: string) => setViews(view), []);
  const handleSetOrderType = useCallback((type: string | null) => setSelectedOrderType(type), []);
  const handleSetCustomerIndex = useCallback((index: number) => setCustomerIndex(index), []);
  const handleSetTableNumber = useCallback((number: string) => setTableNumber(number), []);
  const handleSetType = useCallback((type: string | null) => setOrderType(type), []);
  const handleSetCustomer = useCallback((customer: number) => setSelectedCustomer(customer), []);

  useEffect(() => {
    setCustomerCount(customerIndex);
  }, [customerIndex]);

  useEffect(() => {
    console.log("views", views);
  }, [views]);

  const contextValue = useMemo(() => ({
    views,
    setViews: handleSetViews,
    selectedOrderType,
    setSelectedOrderType: handleSetOrderType,
    customerIndex,
    setCustomerIndex: handleSetCustomerIndex,
    tableNumber,
    setTableNumber: handleSetTableNumber,
    orderType,
    setOrderType: handleSetType,
    selectedCustomer,
    setSelectedCustomer: handleSetCustomer,
  }), [
    views,
    selectedOrderType,
    customerIndex,
    tableNumber,
    orderType,
    selectedCustomer,
    handleSetViews,
    handleSetOrderType,
    handleSetCustomerIndex,
    handleSetTableNumber,
    handleSetType,
    handleSetCustomer
  ]);

  return (
    <RightViewContext.Provider value={contextValue}>
      {children}
    </RightViewContext.Provider>
  );
};

export const useRightViewContext = () => {
  return useContext(RightViewContext);
};
