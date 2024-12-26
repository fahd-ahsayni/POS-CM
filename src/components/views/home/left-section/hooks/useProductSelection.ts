import { Product, ProductSelected } from "@/types";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { ON_PLACE_VIEW } from "../../right-section/constants";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";

interface UseProductSelectionProps {
  selectedProducts: ProductSelected[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>;
  selectedCustomer: number;
  orderType: string | null;
}

export const useProductSelection = ({
  selectedProducts,
  setSelectedProducts,
  selectedCustomer,
  orderType,
}: UseProductSelectionProps) => {
  const addOrUpdateProduct = useCallback(
    (product: Product, variantId: string, price?: number) => {
      setSelectedProducts((prevSelected: any[]) => {
        const variant = product.variants.find((v) => v._id === variantId);
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
          (p) =>
            p.product_variant_id === variantId &&
            p.customer_index === selectedCustomer
        );

        if (existingProduct) {
          return prevSelected.map((p) =>
            p.product_variant_id === variantId &&
            p.customer_index === selectedCustomer
              ? {
                  ...p,
                  quantity: p.quantity + 1,
                  price: price ? p.price + price : p.price,
                  uom_id: variant.uom_id._id,
                  notes: [],
                  is_paid: false,
                  is_ordred: false,
                  suite_commande: false,
                  order_type_id: orderType || ON_PLACE_VIEW,
                }
              : p
          );
        }

        return [
          ...prevSelected,
          {
            ...product,
            id: uuidv4(),
            variants: [variant],
            product_variant_id: variantId,
            quantity: 1,
            price: price || variant.price_ttc,
            customer_index: selectedCustomer,
            order_type_id: orderType || ON_PLACE_VIEW,
            uom_id: variant.uom_id,
            notes: [],
            is_paid: false,
            is_ordred: false,
            suite_commande: false,
          },
        ];
      });
    },
    [selectedCustomer, orderType]
  );

  return { addOrUpdateProduct };
};
