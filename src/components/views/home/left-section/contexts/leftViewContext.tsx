import { Category, Product, ProductSelected } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

// Create a context for the tab state
const LeftViewContext = createContext<{
  views: string;
  setViews: (view: string) => void;
  selectedProducts: ProductSelected[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>;
  openDrawerVariants: boolean;
  setOpenDrawerVariants: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  quantityPerVariant: number;
  setQuantityPerVariant: React.Dispatch<React.SetStateAction<number>>;
  category: Category | null;
  setCategory: React.Dispatch<React.SetStateAction<Category | null>>;
} | null>(null);

// Create a provider component
export const LeftViewProvider = ({ children }: { children: ReactNode }) => {
  const [views, setViews] = useState("AllCategories");
  const [selectedProducts, setSelectedProducts] = useState<ProductSelected[]>(
    []
  );
  const [openDrawerVariants, setOpenDrawerVariants] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityPerVariant, setQuantityPerVariant] = useState<number>(0);

  // TODO: Categories Context
  const [category, setCategory] = useState<Category | null>(null);
  return (
    <LeftViewContext.Provider
      value={{
        views,
        setViews,
        selectedProducts,
        setSelectedProducts,
        openDrawerVariants,
        setOpenDrawerVariants,
        selectedProduct,
        setSelectedProduct,
        quantityPerVariant,
        setQuantityPerVariant,
        category,
        setCategory,
      }}
    >
      {children}
    </LeftViewContext.Provider>
  );
};

// Custom hook to use the TabContext
export const useLeftViewContext = () => {
  const context = useContext(LeftViewContext);
  if (!context) {
    throw new Error(
      "useLeftViewContext must be used within a LeftViewProvider"
    );
  }
  return context;
};
