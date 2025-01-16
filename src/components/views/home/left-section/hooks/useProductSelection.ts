import { checkProductAvailability } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { Product, ProductSelected, ProductVariant } from "@/types/product.types";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { updateCustomerDisplay } from "@/components/global/Customer-display/useCustomerDisplay";

interface UseProductSelectionProps {
  selectedProducts: ProductSelected[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>;
  customerIndex: number;
  orderType: string | null;
}

export const useProductSelection = ({
  setSelectedProducts,
  customerIndex,
  orderType,
}: UseProductSelectionProps) => {
  const findVariant = useCallback(
    (product: Product, variantId: string): ProductVariant | undefined => {
      const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
      if (!product?.variants) return undefined;

      const variant = product.variants.find((v) => v._id === variantId);

      if (variant && orderType?.menu_id) {
        const menuPrice = variant.menus?.find(
          (menu) => menu.menu_id === orderType.menu_id
        )?.price_ttc;
        return { ...variant, price_ttc: menuPrice || variant.default_price || variant.price_ttc };
      }
      return variant;
    },
    []
  );

  const createNewProduct = useCallback(
    (product: any, variant: ProductVariant, price?: number): ProductSelected => {
      const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
      const menuPrice = variant.menus?.find(
        (menu) => menu.menu_id === orderType.menu_id
      )?.price_ttc;
      
      const unitPrice = menuPrice || variant.default_price || price || variant.price_ttc;
      
      return {
        ...product,
        id: uuidv4(),
        variants: [variant],
        product_variant_id: variant._id,
        quantity: 1,
        price: unitPrice,
        unit_price: unitPrice,
        customer_index: customerIndex,
        order_type_id: orderType || "",
        uom_id: variant.uom_id ? variant.uom_id._id : "",
        notes: [],
        discount: null,
        is_paid: false,
        is_ordred: false,
        suite_commande: false,
        high_priority: false,
      };
    },
    [customerIndex, orderType]
  );

  const updateExistingProduct = useCallback(
    (
      prevProducts: ProductSelected[],
      variantId: string,
      price?: number,
      notes?: string[]
    ): ProductSelected[] => {
      return prevProducts.map((p: any) =>
        p.product_variant_id === variantId && p.customer_index === customerIndex
          ? {
              ...p,
              quantity: p.quantity + 1,
              price: price ? p.price + price : p.price,
              order_type_id: orderType || "",
              ...(notes && { notes }),
            }
          : p
      );
    },
    [customerIndex, orderType]
  );

  const updateProductNotes = useCallback(
    (productId: string, notes: string[], customerIndex: number) => {
      setSelectedProducts((prevSelected) =>
        prevSelected.map((p) =>
          p._id === productId && p.customer_index === customerIndex
            ? {
                ...p,
                notes,
              }
            : p
        )
      );
    },
    []
  );

  const updateProductsAndDisplay = useCallback(
    (newProducts: ProductSelected[]) => {
      setSelectedProducts(newProducts);
      updateCustomerDisplay(newProducts);
    },
    [setSelectedProducts]
  );

  const addOrUpdateProduct = useCallback(
    async (
      product: Product,
      variantId: string,
      price?: number,
      notes?: string[]
    ) => {
      try {
        // Check availability before adding
        const response = await checkProductAvailability(variantId);

        if (response.status !== 200) {
          toast.error(
            createToast(
              "Product Unavailable",
              "This product is currently not available",
              "error"
            )
          );
          return;
        }

        setSelectedProducts((prevSelected) => {
          const variant = findVariant(product, variantId);
          if (!variant) {
            toast.warning(
              createToast(
                "Variant not found",
                "Choose another variant",
                "warning"
              )
            );
            return prevSelected;
          }

          const existingProduct = prevSelected.find(
            (p: any) =>
              p.product_variant_id === variantId &&
              p.customer_index === customerIndex
          );

          const newProducts = existingProduct
            ? updateExistingProduct(prevSelected, variantId, price, notes)
            : [...prevSelected, createNewProduct(product, variant, price)];

          updateProductsAndDisplay(newProducts);
          return newProducts;
        });
      } catch (error) {
        toast.error(
          createToast(
            "Availability Check Failed",
            "Unable to verify product availability",
            "error"
          )
        );
      }
    },
    [
      findVariant,
      createNewProduct,
      updateExistingProduct,
      customerIndex,
      updateProductsAndDisplay,
    ]
  );

  return {
    addOrUpdateProduct,
    updateProductNotes: (
      productId: string,
      notes: string[],
      customerIndex: number
    ) => updateProductNotes(productId, notes, customerIndex),
  };
};
