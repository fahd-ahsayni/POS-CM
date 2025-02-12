import { Category, Product, ProductSelected } from "@/interfaces/product";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
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
  openDrawerCombo: boolean;
  setOpenDrawerCombo: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCombo: any | null;
  setSelectedCombo: React.Dispatch<React.SetStateAction<any | null>>;
  currentMenu: string | null | undefined;
  setCurrentMenu: React.Dispatch<
    React.SetStateAction<string | null | undefined>
  >;
  breadcrumbs: Category[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<Category[]>>;
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

  /**
   * @Combo
   * !! Dont forget edit Type in the context !!
   */
  const [openDrawerCombo, setOpenDrawerCombo] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<any | null>(null);

  const [currentMenu, setCurrentMenu] = useState<string | null | undefined>(null);

  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);

  // Define callbacks at the top level
  const handleSetViews = useCallback((view: string) => setViews(view), []);
  const handleSetCategory = useCallback(
    (cat: Category | null) => setCategory(cat),
    []
  );

  const contextValue = useMemo(
    () => ({
      views,
      setViews: handleSetViews,
      selectedProducts,
      setSelectedProducts,
      openDrawerVariants,
      setOpenDrawerVariants,
      selectedProduct,
      setSelectedProduct,
      quantityPerVariant,
      setQuantityPerVariant,
      category,
      setCategory: handleSetCategory,
      subCategory,
      setSubCategory,
      openDrawerCombo,
      setOpenDrawerCombo,
      selectedCombo,
      setSelectedCombo,
      currentMenu,
      setCurrentMenu,
      breadcrumbs,
      setBreadcrumbs,
    }),
    [
      views,
      selectedProducts,
      openDrawerVariants,
      selectedProduct,
      quantityPerVariant,
      category,
      subCategory,
      handleSetViews,
      handleSetCategory,
      openDrawerCombo,
      setOpenDrawerCombo,
      selectedCombo,
      setSelectedCombo,
      currentMenu,
      breadcrumbs,
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
  if (context === null) {
    throw new Error(
      "useLeftViewContext must be used within a LeftViewProvider"
    );
  }
  return context;
};
