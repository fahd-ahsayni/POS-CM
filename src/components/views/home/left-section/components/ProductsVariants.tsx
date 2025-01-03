import Drawer from "@/components/global/Drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Variant } from "@/types";
import { Minus, Plus } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/RightViewContext";
import { useLeftViewContext } from "../contexts/LeftViewContext";
import { useProductSelection } from "../hooks/useProductSelection";
import { useVariantSelection } from "../hooks/useVariantSelection";

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

  const { customerIndex, setViews, orderType } = useRightViewContext();

  const { addOrUpdateProduct } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    customerIndex,
    orderType,
  });

  const { handleSelectVariant, handleQuantityChange } = useVariantSelection({
    selectedProduct,
    selectedProducts,
    setSelectedProducts,
    customerIndex,
    orderType,
    addOrUpdateProduct,
  });

  const handleConfirm = useCallback(() => {
    setOpenDrawerVariants(false);
    setViews(ORDER_SUMMARY_VIEW);
  }, [setOpenDrawerVariants, setViews]);

  const variantCards = useMemo(
    () =>
      selectedProduct?.variants.map((variant, index) => {
        const selectedVariant = selectedProducts.find(
          (p: any) =>
            p.product_variant_id === variant._id &&
            p.customer_index === customerIndex
        );

        return (
          <VariantCard
            key={`${variant._id}-${customerIndex}-${index}`}
            variant={variant}
            isSelected={!!selectedVariant}
            quantity={selectedVariant?.quantity || 0}
            onSelect={() => handleSelectVariant(variant._id, variant.price_ttc)}
            onQuantityChange={handleQuantityChange}
          />
        );
      }),
    [
      selectedProduct,
      selectedProducts,
      customerIndex,
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
          isSelected && "!border-2 !border-primary-red"
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
