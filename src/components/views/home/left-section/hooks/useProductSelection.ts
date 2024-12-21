import { Product, ProductSelected } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { ON_PLACE_VIEW } from "../../right-section/constants";

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
  const addOrUpdateProduct = (
    product: Product,
    variantId: string,
    price?: number
  ) => {
    setSelectedProducts((prevSelected) => {
      const existingProduct = prevSelected.find(
        (p) =>
          p._id === product._id &&
          p.product_variant_id === variantId &&
          p.customer_index === selectedCustomer
      );
      if (existingProduct) {
        return prevSelected.map((p) =>
          p._id === product._id &&
          p.product_variant_id === variantId &&
          p.customer_index === selectedCustomer
            ? {
                ...p,
                quantity: p.quantity + 1,
                price: price ? p.price + price : p.price,
                uom_id: p.uom_id,
                note: [],
                is_paid: false,
                is_ordered: false,
                suite_commande: false,
              }
            : p
        );
      }
      const variant = product.variants.find((v) => v._id === variantId);
      return [
        ...prevSelected,
        {
          ...product,
          id: uuidv4(),
          variants: variant ? [variant] : [],
          product_variant_id: variantId,
          quantity: 1,
          price: price || product.variants[0].price_ttc,
          customer_index: selectedCustomer,
          order_type_id: orderType || ON_PLACE_VIEW,
          uom_id: null,
          note: null,
          is_paid: false,
          is_ordered: false,
          suite_commande: false,
        },
      ];
    });
  };
  return { addOrUpdateProduct };
};
