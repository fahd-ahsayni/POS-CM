import { createToast } from "@/components/global/Toasters";
import { Product, ProductSelected, Variant } from "@/types";
import { useCallback } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

interface UseProductSelectionProps {
  selectedProducts: ProductSelected[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>;
  customerIndex: number;
  orderType: string | null;
}

export const useProductSelection = ({
  selectedProducts,
  setSelectedProducts,
  customerIndex,
  orderType,
}: UseProductSelectionProps) => {
  const findVariant = useCallback(
    (product: any, variantId: string): Variant | undefined => {
      return product.variants.find((v: any) => v._id === variantId);
    },
    []
  );

  const createNewProduct = useCallback(
    (product: any, variant: Variant, price?: number): ProductSelected => {
      return {
        ...product,
        id: uuidv4(),
        variants: [variant],
        product_variant_id: variant._id,
        quantity: 1,
        price: price || variant.price_ttc,
        customer_index: customerIndex,
        order_type_id: orderType || "",
        uom_id: variant.uom_id ? variant.uom_id._id : "",
        notes: [],
        is_paid: false,
        is_ordred: false,
        suite_commande: false,
      };
    },
    [customerIndex, orderType]
  );

  const updateExistingProduct = useCallback(
    (
      prevProducts: ProductSelected[],
      variantId: string,
      price?: number
    ): ProductSelected[] => {
      return prevProducts.map((p: any) =>
        p.product_variant_id === variantId &&
        p.customer_index === customerIndex
          ? {
              ...p,
              quantity: p.quantity + 1,
              price: price ? p.price + price : p.price,
              order_type_id: orderType || "",
            }
          : p
      );
    },
    [customerIndex, orderType]
  );

  const addOrUpdateProduct = useCallback(
    (product: Product, variantId: string, price?: number) => {
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

        if (existingProduct) {
          return updateExistingProduct(prevSelected, variantId, price);
        }

        return [...prevSelected, createNewProduct(product, variant, price)];
      });
    },
    [findVariant, createNewProduct, updateExistingProduct, customerIndex]
  );

  return { addOrUpdateProduct };
};
