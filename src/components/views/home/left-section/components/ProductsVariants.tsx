import Drawer from "@/components/global/drawers/layout/Drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { ProductVariant } from "@/interfaces/product";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { Minus, Plus } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/RightViewContext";
import { useLeftViewContext } from "../contexts/LeftViewContext";
import { useProductSelection } from "../hooks/useProductSelection";
import { useVariantSelection } from "../hooks/useVariantSelection";

interface VariantCardProps {
  variant: ProductVariant;
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
    setOpenDrawerCombo,
    setSelectedCombo,
  } = useLeftViewContext();

  const { customerIndex, setViews, orderType } = useRightViewContext();

  const { addOrUpdateProduct } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    customerIndex,
    orderType,
  });

  const { handleSelectVariant: handleVariantSelect, handleQuantityChange } =
    useVariantSelection({
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

  const handleSelectVariant = useCallback(
    async (variant: ProductVariant) => {
      if (variant.is_menu) {
        setSelectedCombo(variant);
        setOpenDrawerCombo(true);
        setOpenDrawerVariants(false);
      } else {
        handleVariantSelect(variant._id, variant.price_ttc);
      }
    },
    [
      setSelectedCombo,
      setOpenDrawerCombo,
      setOpenDrawerVariants,
      handleVariantSelect,
    ]
  );

  const variantCards = useMemo(
    () =>
      selectedProduct?.variants.map(
        (variant: ProductVariant, index: number) => {
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
              onSelect={() => handleSelectVariant(variant)}
              onQuantityChange={handleQuantityChange}
            />
          );
        }
      ),
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
      classNames="bg-neutral-bright-grey max-w-md"
    >
      <div className="h-full w-full relative flex flex-col justify-center">
        <ScrollArea className="w-full h-full pr-2">
          <div className="space-y-4 px-2 pt-2">{variantCards}</div>
        </ScrollArea>
        <div className="w-full flex items-end py-2 dark:!bg-secondary-black bg-neutral-bright-grey sm:px-4">
          <Button className="w-full" onClick={handleConfirm}>
            Add to cart
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

const VariantCard = memo<VariantCardProps>(
  ({ variant, isSelected, quantity, onSelect, onQuantityChange }) => {
    const { currentMenu } = useLeftViewContext();

    const variantPrice = useMemo(() => {
      const menuPrice = variant.menus?.find(
        (menu) => menu.menu_id === currentMenu
      )?.price_ttc;
      return menuPrice ?? variant.default_price ?? variant.price_ttc ?? 0;
    }, [variant, currentMenu]);

    return (
      <div onClick={() => onSelect()} tabIndex={0} role="button">
        <Card
          className={cn(
            "w-full px-4 py-4 rounded-lg dark:bg-primary-black bg-secondary-white h-28 flex flex-col justify-between",
            isSelected && "!ring-1 !ring-primary-red"
          )}
        >
          <div className="flex items-center justify-between">
            <TypographyP className="font-semibold capitalize text-sm">
              {variant.name.toLowerCase()}
              {variant.is_menu && (
                <span className="ml-2 text-xs text-primary-red">
                  (Combo menu)
                </span>
              )}
            </TypographyP>
            {isSelected && !variant.is_menu && (
              <div className="flex items-center gap-2">
                <Button
                  slot="decrement"
                  className="-ms-px h-7 w-7 rounded"
                  size="icon"
                  variant="secondary"
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
                  className="-ms-px h-7 w-7 rounded"
                  size="icon"
                  variant="secondary"
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
          <TypographySmall className="text-neutral-dark-grey font-medium">
            {variantPrice} {currency.currency}
          </TypographySmall>
        </Card>
      </div>
    );
  }
);
