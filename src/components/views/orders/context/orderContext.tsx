import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface OrdersContextProps {
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const OrdersContext = createContext<OrdersContextProps | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset currentPage to 0 whenever pageSize changes
  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize]);

  return (
    <OrdersContext.Provider value={{ pageSize, setPageSize, currentPage, setCurrentPage }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrdersContext = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrdersContext must be used within an OrdersProvider");
  }
  return context;
};