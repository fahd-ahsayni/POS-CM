import { setCustomerCount } from "@/store/slices/order/create-order.slice";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { TYPE_OF_ORDER_VIEW } from "../constants";

interface RightViewState {
  views: string;
  selectedOrderType: string | null;
  customerIndex: number;
  tableNumber: string;
  orderType: string | null;
}

interface RightViewContextType extends RightViewState {
  setViews: (view: string) => void;
  setSelectedOrderType: (type: string | null) => void;
  setCustomerIndex: (index: number) => void;
  setTableNumber: (number: string) => void;
  setOrderType: (type: string | null) => void;
}

const RightViewContext = createContext<RightViewContextType>({} as RightViewContextType);

export const RightViewProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<RightViewState>({
    views: TYPE_OF_ORDER_VIEW,
    selectedOrderType: null,
    customerIndex: 1,
    tableNumber: "",
    orderType: TYPE_OF_ORDER_VIEW,
  });

  const updateState = useCallback(<K extends keyof RightViewState>(
    key: K,
    value: RightViewState[K]
  ) => {
    setState(prev => ({ ...prev, [key]: value }));
  }, []);

  const handlers = useMemo(() => ({
    setViews: (view: string) => updateState('views', view),
    setSelectedOrderType: (type: string | null) => updateState('selectedOrderType', type),
    setCustomerIndex: (index: number) => updateState('customerIndex', index),
    setTableNumber: (number: string) => updateState('tableNumber', number),
    setOrderType: (type: string | null) => updateState('orderType', type),
  }), [updateState]);

  useEffect(() => {
    setCustomerCount(state.customerIndex);
  }, [state.customerIndex]);

  const contextValue = useMemo(
    () => ({
      ...state,
      ...handlers
    }),
    [state, handlers]
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
    throw new Error("useRightViewContext must be used within RightViewProvider");
  }
  return context;
};
