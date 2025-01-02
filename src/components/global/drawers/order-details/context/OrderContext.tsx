import { createContext, useContext, ReactNode, useState } from "react";
import { Order, OrderLine } from "@/types/getDataByDay";

interface OrderContextType {
  selectedOrder: Order | null;
  openOrderDetails: boolean;
  setSelectedOrder: (order: Order | null) => void;
  setOpenOrderDetails: (open: boolean) => void;
  orderLines: OrderLine[];
  setOrderLines: React.Dispatch<React.SetStateAction<OrderLine[]>>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);

  const value = {
    selectedOrder,
    openOrderDetails,
    setSelectedOrder,
    setOpenOrderDetails,
    orderLines,
    setOrderLines,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider");
  }
  return context;
};
