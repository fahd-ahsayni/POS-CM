import { checkProductAvailability } from "@/api/services";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { useAppDispatch } from "@/store/hooks";
import {
  addOrderLine,
  setCustomerCount,
  updateOrderLine,
} from "@/store/slices/order/create-order.slice";
import { Product, ProductSelected } from "@/interfaces/product";
import { useCallback, useEffect, useMemo } from "react";
import { useLeftViewContext } from "../contexts/LeftViewContext";

interface UseVariantSelectionProps {
  selectedProduct: Product | null;
  selectedProducts: ProductSelected[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>;
  customerIndex: number;
  orderType: string | null;
  addOrUpdateProduct: (product: Product, id: string, price: number) => void;
}

const useVariantSelection = ({
  selectedProduct,
  selectedProducts,
  setSelectedProducts,
  customerIndex,
  addOrUpdateProduct,
}: UseVariantSelectionProps) => {
  const dispatch = useAppDispatch();

  const { currentMenu } = useLeftViewContext();

  // Add function to calculate max customer index
  const updateCustomerCount = useCallback(
    (products: ProductSelected[]) => {
      if (products.length === 0) {
        dispatch(setCustomerCount(1));
        return;
      }

      const maxCustomerIndex = Math.max(
        ...products.map((product) => product.customer_index)
      );
      dispatch(setCustomerCount(maxCustomerIndex));
    },
    [dispatch]
  );

  const handleSelectVariant = useCallback(
    async (id: string, price: number) => {
      if (!selectedProduct) return;

      try {
        const response = await checkProductAvailability(id);
        if (response.status !== 200) return;

        const variant = selectedProduct.variants.find((v) => v._id === id);
        if (!variant) return;

        const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
        const menuId = orderType.menu_id || currentMenu;
        const variantPrice =
          variant.menus?.find((menu) => menu.menu_id === menuId)?.price_ttc ??
          variant.default_price ??
          price;

        // For combo products or ordered items, always create a new entry
        if (variant.is_menu || variant.is_ordred) {
          addOrUpdateProduct(selectedProduct, id, variantPrice);
          return;
        }

        // Regular product handling...
        const existingVariant = selectedProducts.find(
          (p) =>
            p.product_variant_id === id &&
            p.customer_index === customerIndex &&
            !p.is_ordred // Don't update if it's ordered
        );

        if (!existingVariant) {
          addOrUpdateProduct(selectedProduct, id, variantPrice);
        } else {
          setSelectedProducts((prev) =>
            prev.map((p) =>
              p.product_variant_id === id &&
              p.customer_index === customerIndex &&
              !p.is_ordred
                ? {
                    ...p,
                    quantity: p.quantity + 1,
                    price: variantPrice * (p.quantity + 1),
                  }
                : p
            )
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      selectedProduct,
      addOrUpdateProduct,
      selectedProducts,
      customerIndex,
      setSelectedProducts,
      currentMenu,
    ]
  );

  const handleQuantityChange = useCallback(
    (variantId: string, increment: boolean) => {
      setSelectedProducts((prev) => {
        const updatedProducts = prev
          .map((product) => {
            if (
              (product.is_combo
                ? product.id === variantId
                : product.product_variant_id === variantId) &&
              product.customer_index === customerIndex
            ) {
              const newQuantity = increment
                ? product.quantity + 1
                : Math.max(0, product.quantity - 1);

              if (newQuantity === 0) {
                // Variant quantity reaches 0, so mark for removal.
                return { ...product, quantity: 0 };
              }

              // Handle combo products
              if (product.is_combo && product.combo_items) {
                // ...existing combo logic...
              }

              // Handle regular products
              const variant = selectedProduct?.variants.find(
                (v) => v._id === product.product_variant_id
              );

              const variantPrice =
                variant?.menus?.find((menu) => menu.menu_id === currentMenu)
                  ?.price_ttc ??
                variant?.default_price ??
                product.price / product.quantity;

              const updatedOrder = {
                _id: product.id || product._id,
                customer_index: product.customer_index,
                product_variant_id: product.product_variant_id,
                quantity: newQuantity,
                price: variantPrice * newQuantity,
                notes: product.notes, // Include notes in the update
              };

              dispatch(updateOrderLine(updatedOrder));

              return {
                ...product,
                quantity: newQuantity,
                price: variantPrice * newQuantity,
              };
            }
            return product;
          })
          .filter((product) => product.quantity > 0);

        updateCustomerCount(updatedProducts);
        return updatedProducts;
      });
    },
    [
      customerIndex,
      currentMenu,
      setSelectedProducts,
      dispatch,
      selectedProduct,
      updateCustomerCount,
    ]
  );

  const orderlineData = useMemo(
    () =>
      selectedProducts.map((p) => {
        const variant = p.variants?.[0] || p.product_variant_id;
        const priceCalc = calculateProductPrice(p, currentMenu, p.quantity);

        const baseOrderLine = {
          price: priceCalc.totalPrice,
          product_variant_id: p.product_variant_id || variant?._id || null,
          uom_id: variant?.uom_id?._id || null,
          customer_index: p.customer_index,
          notes: Array.isArray(p.notes) ? p.notes : [],
          quantity: p.quantity,
          suite_commande: p.suite_commande || false,
          high_priority: p.high_priority || false,
          order_type_id: JSON.parse(localStorage.getItem("orderType") || "{}")
            ._id,
          is_ordred: p.is_ordred || false,
          is_paid: p.is_paid || false,
          discount: p.discount || null,
        };

        if (p.is_combo && p.combo_items) {
          return {
            ...baseOrderLine,
            combo_prod_ids: p.combo_items.variants.map((v: any) => ({
              product_variant_id: v._id,
              quantity: v.quantity,
              notes: Array.isArray(v.notes) ? v.notes : [],
              suite_commande: v.suite_commande || false, // FIX: add suite_commande
              order_type_id: JSON.parse(
                localStorage.getItem("orderType") || "{}"
              )._id,
            })),
            combo_supp_ids: p.combo_items.supplements.map((s: any) => ({
              product_variant_id: s._id,
              quantity: s.quantity,
              notes: Array.isArray(s.notes) ? s.notes : [],
              suite_commande: s.suite_commande || false,
              order_type_id: JSON.parse(
                localStorage.getItem("orderType") || "{}"
              )._id,
            })),
          };
        }

        return {
          ...baseOrderLine,
          combo_prod_ids: [],
          combo_supp_ids: [],
        };
      }),
    [selectedProducts, currentMenu]
  );

  useEffect(() => {
    dispatch(addOrderLine(selectedProducts.length > 0 ? orderlineData : []));
  }, [dispatch, orderlineData, selectedProducts.length]);

  return {
    handleSelectVariant,
    handleQuantityChange,
    orderlineData,
  };
};

export { useVariantSelection };
