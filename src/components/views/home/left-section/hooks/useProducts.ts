import { Product, ProductVariant } from "@/interfaces/product";
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
    (product: Product, notes?: string[]) => {
      if (product.variants.length === 1) {
        const variant = product.variants[0];
        if (variant.is_menu) {
          if (variant.steps.length <= 1) {
            // Auto-select and finish for single required step; do not open drawer
            const orderTypeLS = JSON.parse(localStorage.getItem("orderType") || "{}");
            const menuPrice =
              variant.menus?.find((menu: any) => menu.menu_id === orderTypeLS.menu_id)?.price_ttc ||
              variant.default_price;
            const uniqueId = `combo_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;
            const comboProduct = {
              _id: uniqueId,
              id: uniqueId,
              name: product.name,
              quantity: 1,
              price: menuPrice,
              variants: [variant],
              product_variant_id: variant._id,
              customer_index: customerIndex,
              order_type_id: orderTypeLS._id || "",
              uom_id: variant.uom_id?._id || "",
              is_combo: true,
              is_ordred: false,
              is_paid: false,
              combo_items: {
                variants:
                  variant.steps[0]?.product_variant_ids?.map((v: any) => ({
                    ...v,
                    combo_id: uniqueId,
                    suite_commande: v.suite_commande || false,
                  })) || [],
                supplements: [],
              },
              notes: [],
              discount: null,
              suite_commande: false,
              high_priority: false,
            };
            setSelectedProducts((prev: any) => [...prev, comboProduct]);
            return;
          } else {
            setSelectedCombo(variant);
            setOpenDrawerCombo(true);
          }
        } else {
          addOrUpdateProduct(product, variant._id, undefined, notes);
        }
      } else if (product.variants.length > 1) {
        const hasComboVariant = product.variants.some((variant) => variant.is_menu);
        if (hasComboVariant) {
          const comboVariant = product.variants.find((variant) => variant.is_menu);
          if (comboVariant) {
            setSelectedCombo(comboVariant);
            setOpenDrawerCombo(true);
          }
        } else {
          setSelectedProduct(product);
          setOpenDrawerVariants(true);
        }
      }
    },
    [
      addOrUpdateProduct,
      setOpenDrawerVariants,
      setSelectedProduct,
      setOpenDrawerCombo,
      setSelectedCombo,
      setSelectedProducts,
      customerIndex,
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
