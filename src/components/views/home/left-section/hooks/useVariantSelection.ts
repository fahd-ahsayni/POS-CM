import { useCallback, useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addOrderLine } from "@/store/slices/order/createOrder";
import { ProductSelected, Product } from "@/types";

interface UseVariantSelectionProps {
  selectedProduct: Product | null;
  selectedProducts: ProductSelected[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>;
  customerIndex: number;
  orderType: string | null;
  addOrUpdateProduct: (product: Product, id: string, price: number) => void;
}

export const useVariantSelection = ({
  selectedProduct,
  selectedProducts,
  setSelectedProducts,
  customerIndex,
  orderType,
  addOrUpdateProduct,
}: UseVariantSelectionProps) => {
  const dispatch = useDispatch();

  const handleSelectVariant = useCallback(
    (id: string, price: number) => {
      if (!selectedProduct) {
        console.warn("No selected product. Cannot select a variant.");
        return;
      }

      const existingVariant = selectedProducts.find(
        (p) => p.product_variant_id === id && p.customer_index === customerIndex
      );

      if (!existingVariant) {
        addOrUpdateProduct(selectedProduct, id, price);
      }
    },
    [selectedProduct, addOrUpdateProduct, selectedProducts, customerIndex]
  );

  const handleQuantityChange = useCallback(
    (variantId: string, increment: boolean) => {
      setSelectedProducts((prev) =>
        prev.map((product) =>
          product.product_variant_id === variantId &&
          product.customer_index === customerIndex
            ? {
                ...product,
                quantity: increment
                  ? product.quantity + 1
                  : Math.max(1, product.quantity - 1),
              }
            : product
        )
      );
    },
    [customerIndex, setSelectedProducts]
  );

  const orderlineData = useMemo(
    () =>
      selectedProducts.map((p) => ({
        price: p.price * p.quantity,
        product_variant_id: p.product_variant_id,
        uom_id: p.variants[0].uom_id._id || null,
        customer_index: p.customer_index,
        notes: p.notes,
        quantity: p.quantity,
        suite_commande: p.suite_commande,
        order_type_id: orderType,
        suite_ordred: false,
        is_paid: p.is_paid,
        is_ordred: p.is_ordred,
        combo_prod_ids: [],
        combo_supp_ids: [],
      })),
    [selectedProducts, orderType]
  );

  // Sync order line data with Redux store
  useEffect(() => {
    dispatch(addOrderLine(selectedProducts.length > 0 ? orderlineData : []));
  }, [dispatch, orderlineData, selectedProducts.length]);

  return {
    handleSelectVariant,
    handleQuantityChange,
    orderlineData,
  };
};
