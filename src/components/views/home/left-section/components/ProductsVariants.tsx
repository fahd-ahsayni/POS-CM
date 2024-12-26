import Drawer from "@/components/global/Drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { addOrderLine } from "@/store/slices/order/createOrder";
import { Minus, Plus } from "lucide-react";
import { useEffect, useCallback, useMemo, memo } from "react";
import { useDispatch } from "react-redux";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { useLeftViewContext } from "../contexts/leftViewContext";
import { useProductSelection } from "../hooks/useProductSelection";
import { cn } from "@/lib/utils";
import { Variant } from "@/types";

interface VariantCardProps {
  variant: Variant;
  isSelected: boolean;
  quantity: number;
  onSelect: () => void;
  onQuantityChange: (variantId: string, increment: boolean) => void;
}

export default function ProductsVariants() {
  const {
    openDrawerVariants,
    setOpenDrawerVariants,
    selectedProduct,
    selectedProducts,
    setSelectedProducts,
  } = useLeftViewContext();

  const { selectedCustomer, setViews, orderType } = useRightViewContext();
  const dispatch = useDispatch();

  const { addOrUpdateProduct } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    selectedCustomer,
    orderType,
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleSelectVariant = useCallback(
    (id: string, price: number) => {
      if (!selectedProduct) {
        console.warn("No selected product. Cannot select a variant.");
        return;
      }

      addOrUpdateProduct(selectedProduct, id, price);
    },
    [selectedProduct, addOrUpdateProduct]
  );

  const handleQuantityChange = useCallback(
    (variantId: string, increment: boolean) => {
      setSelectedProducts((prev) =>
        prev.map((product) =>
          product.product_variant_id === variantId
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
    []
  );

  const handleConfirm = useCallback(() => {
    setOpenDrawerVariants(false);
    setViews(ORDER_SUMMARY_VIEW);
  }, [setOpenDrawerVariants, setViews]);

  // Memoize orderline data transformation
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

  // Update order line when dependencies change
  useEffect(() => {
    dispatch(addOrderLine(selectedProducts.length > 0 ? orderlineData : []));
  }, [dispatch, orderlineData, selectedProducts.length]);

  // Memoize variant cards rendering
  const variantCards = useMemo(
    () =>
      selectedProduct?.variants.map((variant, index) => {
        const selectedVariant = selectedProducts.find(
          (p) => p.product_variant_id === variant._id
        );
        const isSelected = !!selectedVariant;
        const quantity = selectedVariant?.quantity || 0;

        return (
          <VariantCard
            key={`${selectedVariant?._id}-${variant._id}-${index}`}
            variant={variant}
            isSelected={isSelected}
            quantity={quantity}
            onSelect={() => handleSelectVariant(variant._id, variant.price_ttc)}
            onQuantityChange={handleQuantityChange}
          />
        );
      }),
    [
      selectedProduct,
      selectedProducts,
      handleSelectVariant,
      handleQuantityChange,
    ]
  );

  return (
    <Drawer
      title={selectedProduct?.name || ""}
      open={openDrawerVariants}
      setOpen={setOpenDrawerVariants}
      position="left"
    >
      <div className="h-full w-full relative flex justify-center px-4 sm:px-6">
        <div className="w-full h-full overflow-auto space-y-2">
          {variantCards}
        </div>
        <div className="w-full absolute bottom-0 h-16 flex items-end dark:!bg-secondary-black bg-secondary-white px-4 sm:px-6">
          <Button className="w-full" onClick={handleConfirm}>
            Add to cart
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

// Extract VariantCard as a separate component
const VariantCard = memo<VariantCardProps>(
  ({ variant, isSelected, quantity, onSelect, onQuantityChange }) => (
    <div
      onClick={() => !isSelected && onSelect()}
      tabIndex={0}
      role="button"
      onKeyPress={(e) => {
        if (e.key === "Enter" && !isSelected) onSelect();
      }}
    >
      <Card
        className={cn(
          "w-full h-full px-4 py-2 rounded-lg dark:!bg-zinc-950",
          isSelected && "!border-2 !border-primary"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <TypographyP className="font-semibold capitalize text-sm">
            {variant.name.toLowerCase()}
          </TypographyP>
          {isSelected && (
            <div className="flex items-center gap-2">
              <Button
                slot="decrement"
                className="-ms-px h-6 w-6 rounded bg-accent-white/10 hover:bg-accent-black/10"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(variant._id, false);
                }}
              >
                <Minus size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
              <TypographyP className="px-1.5 font-medium">
                {quantity}
              </TypographyP>
              <Button
                slot="increment"
                className="-ms-px h-6 w-6 rounded bg-accent-white/10 hover:bg-accent-black/10"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuantityChange(variant._id, true);
                }}
              >
                <Plus size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>
        <TypographySmall className="text-neutral-dark-grey font-medium text-xs">
          {variant.price_ttc} Dhs
        </TypographySmall>
      </Card>
    </div>
  )
);
