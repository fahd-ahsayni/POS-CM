import { createContext, useContext, useState, ReactNode } from "react";

// Create a context for the tab state
const RightViewContext = createContext<{
  views: string;
  setViews: (view: string) => void;
  selectedOrderType: string | null;
  setSelectedOrderType: (type: string | null) => void;
} | null>(null);

// Create a provider component
export const RightViewProvider = ({ children }: { children: ReactNode }) => {
  const [views, setViews] = useState("TypeOfOrder");
  const [selectedOrderType, setSelectedOrderType] = useState<string | null>(null);
  return (
    <RightViewContext.Provider value={{ views, setViews, selectedOrderType, setSelectedOrderType }}>
      {children}
    </RightViewContext.Provider>
  );
};

// Custom hook to use the TabContext
export const useRightViewContext = () => {
  const context = useContext(RightViewContext);
  if (!context) {
    throw new Error(
      "useRightViewContext must be used within a RightViewProvider"
    );
  }
  return context;
};
