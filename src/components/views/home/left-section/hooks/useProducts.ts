import { Product, ProductVariant } from "@/types/product.types";
import { useCallback, useMemo, useState } from "react";
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
  const { currentMenu } = useLeftViewContext();

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

        // Filter products that belong to the current menu
        const extractedProducts = parsedData.products.filter(
          (product: Product) => {
            // Safety check for product and its properties
            if (!product || !Array.isArray(product.menus)) {
              console.warn("Invalid product structure:", product);
              return false;
            }

            // Check if product is in current menu
            const isInCurrentMenu = product.menus.some(
              (menuProduct) =>
                menuProduct?.menu_id === currentMenu &&
                menuProduct?.is_displayed === true &&
                menuProduct?.in_pos === true
            );

            if (!isInCurrentMenu) return false;

            // Safety check for variants array
            if (!Array.isArray(product.variants)) {
              console.warn("Product has no variants array:", product);
              return false;
            }

            // Include product if it has no variants
            if (product.variants.length === 0) return true;

            // Check for valid variants
            const hasValidVariant = product.variants.some(
              (variant: ProductVariant) => {
                if (!variant) return false;

                // Include variant if it's not menu-specific
                if (!variant.is_menu) return true;

                // Safety check for variant menus
                if (!Array.isArray(variant.menus)) return false;

                return variant.menus.some(
                  (menu) => menu?.menu_id === currentMenu
                );
              }
            );

            return hasValidVariant;
          }
        );

        setState({ products: extractedProducts, loading: false });
      }
    } catch (error) {
      console.error("Error loading products:", error);
      console.error("Error details:", {
        currentMenu,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      setState((prev) => ({ ...prev, loading: false, products: [] }));
    }
  }, [currentMenu]);

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
