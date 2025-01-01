import { calculateSelectedProductsTotal } from "@/functions/calculateSelectedProductsTotal";
import { updateOrder } from "@/functions/updateOrder";
import { Category, Product, ProductSelected } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { BsXLg } from "react-icons/bs";
import { useDispatch } from "react-redux";

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
}

const LeftViewContext = createContext<LeftViewContextType | null>(null);

export const LeftViewProvider = ({ children }: { children: ReactNode }) => {
  const [views, setViews] = useState("AllCategories");
  const [selectedProducts, setSelectedProducts] = useState<ProductSelected[]>(
    []
  );
  
  console.log(selectedProducts);

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
  const [comboOrderLine, setComboOrderLine] = useState<any | null>(null);

  const dispatch = useDispatch();

  const updateOrderTotal = useCallback(() => {
    dispatch(
      updateOrder({
        total_amount: calculateSelectedProductsTotal(selectedProducts as any)
          .total,
      })
    );
  }, [dispatch, selectedProducts]);

  useEffect(() => {
    updateOrderTotal();
  }, [updateOrderTotal]);

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
