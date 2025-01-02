import { addOrderLine } from "@/store/slices/order/createOrder";
import { Product, ProductSelected } from "@/types";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

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
        prev.map((product) => {
          if (
            product.product_variant_id === variantId &&
            product.customer_index === customerIndex
          ) {
            const newQuantity = increment
              ? product.quantity + 1
              : Math.max(1, product.quantity - 1);

            // Handle combo products
            if (product.is_combo && product.combo_items) {
              return {
                ...product,
                quantity: newQuantity,
                combo_items: {
                  variants: product.combo_items.variants.map((v: any) => ({
                    ...v,
                    quantity: v.quantity * newQuantity,
                  })),
                  supplements: product.combo_items.supplements.map(
                    (s: any) => ({
                      ...s,
                      quantity: s.quantity * newQuantity,
                    })
                  ),
                },
              };
            }

            // Handle regular products
            return {
              ...product,
              quantity: newQuantity,
            };
          }
          return product;
        })
      );
    },
    [customerIndex, setSelectedProducts]
  );

  const orderlineData = useMemo(
    () =>
      selectedProducts.map((p) => {
        // Ensure we have valid variant data
        const variant = p.variants?.[0] || p.product_variant_id;

        const baseOrderLine = {
          price: p.price * p.quantity,
          product_variant_id: p.product_variant_id || variant?._id || null,
          uom_id: variant?.uom_id?._id || null,
          customer_index: p.customer_index,
          notes: Array.isArray(p.notes) ? p.notes : [],
          quantity: p.quantity,
          suite_commande: p.suite_commande || false,
          order_type_id: orderType,
          is_ordred: p.is_ordred || false,
          is_paid: p.is_paid || false,
        };

        // Handle combo products
        if (p.is_combo && p.combo_items) {
          return {
            ...baseOrderLine,
            combo_prod_ids: p.combo_items.variants.map((v: any) => ({
              product_variant_id: v._id,
              quantity: v.quantity,
              notes: Array.isArray(v.notes) ? v.notes : [],
              suite_commande: v.suite_commande || false,
              order_type_id: orderType || "",
            })),
            combo_supp_ids: p.combo_items.supplements.map((s: any) => ({
              product_variant_id: s._id,
              quantity: s.quantity,
              notes: Array.isArray(s.notes) ? s.notes : [],
              suite_commande: s.suite_commande || false,
              order_type_id: orderType || "",
            })),
          };
        }

        // Handle regular products
        return {
          ...baseOrderLine,
          combo_prod_ids: [],
          combo_supp_ids: [],
        };
      }),
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
