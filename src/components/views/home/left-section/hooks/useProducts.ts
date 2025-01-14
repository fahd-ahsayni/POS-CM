import { extractProducts } from "@/functions/extractProducts";
import { Product } from "@/types/product.types";
import { useCallback, useState, useMemo } from "react";
import { useRightViewContext } from "../../right-section/contexts/RightViewContext";
import { useLeftViewContext } from "../contexts/LeftViewContext";
import { useProductSelection } from "./useProductSelection";

export const useProducts = (initialProducts?: Product[]) => {
  const [state, setState] = useState({
    products: initialProducts || [],
    loading: true,
  });

  const contextValues = useLeftViewContext();
  const { orderType, customerIndex } = useRightViewContext();

  const {
    selectedProducts,
    setSelectedProducts,
    setOpenDrawerVariants,
    setSelectedProduct,
    setOpenDrawerCombo,
    setSelectedCombo,
  } = useMemo(() => contextValues, [contextValues]);

  const productSelectionOptions = useMemo(
    () => ({
      selectedProducts,
      setSelectedProducts,
      customerIndex,
      orderType,
    }),
    [selectedProducts, setSelectedProducts, customerIndex, orderType]
  );

  const { addOrUpdateProduct } = useProductSelection(productSelectionOptions);

  const loadProducts = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const storedGeneralData = localStorage.getItem("generalData");
      if (storedGeneralData) {
        const parsedData = JSON.parse(storedGeneralData);
        const extractedProducts = extractProducts(parsedData.categories);
        setState({ products: extractedProducts, loading: false });
      }
    } catch (error) {
      console.error("Error loading products:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const handleProductClick = useCallback(
    (product: Product) => {
      const variant = product.variants[0];
      if (product.variants.length === 1) {
        if (variant.is_menu) {
          setSelectedCombo(variant);
          setOpenDrawerCombo(true);
        } else {
          addOrUpdateProduct(product, variant._id);
        }
      } else if (product.variants.length > 1) {
        setSelectedProduct(product);
        setOpenDrawerVariants(true);
      }
    },
    [
      addOrUpdateProduct,
      setOpenDrawerVariants,
      setSelectedProduct,
      setOpenDrawerCombo,
      setSelectedCombo,
    ]
  );

  return {
    ...state,
    selectedProducts,
    handleProductClick,
    loadProducts,
    setProducts: useCallback(
      (products: Product[]) => setState((prev) => ({ ...prev, products })),
      []
    ),
  };
};
