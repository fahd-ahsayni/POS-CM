import { Category, Product, ProductSelected } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

interface LeftViewContextType {
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
  setCategory: (category: Category | null) => void;
  subCategory: Category | null;
  setSubCategory: React.Dispatch<React.SetStateAction<Category | null>>;
}

const LeftViewContext = createContext<LeftViewContextType | null>(null);

export const LeftViewProvider = ({ children }: { children: ReactNode }) => {
  const [views, setViews] = useState("AllCategories");
  const [selectedProducts, setSelectedProducts] = useState<ProductSelected[]>(
    []
  );
  const [openDrawerVariants, setOpenDrawerVariants] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantityPerVariant, setQuantityPerVariant] = useState<number>(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [subCategory, setSubCategory] = useState<Category | null>(null);

  const contextValue = useMemo(
    () => ({
      views,
      setViews: useCallback((view: string) => setViews(view), []),
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
      subCategory,
      setSubCategory,
    }),
    [
      views,
      selectedProducts,
      openDrawerVariants,
      selectedProduct,
      quantityPerVariant,
      category,
      subCategory,
    ]
  );

  return (
    <LeftViewContext.Provider value={contextValue}>
      {children}
    </LeftViewContext.Provider>
  );
};

export const useLeftViewContext = () => {
  const context = useContext(LeftViewContext);
  if (!context) {
    throw new Error(
      "useLeftViewContext must be used within a LeftViewProvider"
    );
  }
  return context;
};
