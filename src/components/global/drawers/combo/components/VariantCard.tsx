import { DishIcon, SuiteCommandIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import OderLineAddComments from "@/components/views/home/right-section/ui/OderLineAddComments";
import { toTitleCase } from "@/functions/string-transforms";
import { ProductVariant, Step } from "@/interfaces/product";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCombo } from "../context/ComboContext";

interface VariantCardProps {
  variant: ProductVariant;
  isSelected: boolean;
  isSupplement: boolean;
  isRequired: boolean;
  quantity: number;
  onClick: () => void;
  onQuantityChange: (increment: boolean) => void;
  step: Step;
  customerIndex: number;
}

export function VariantCard({
  variant,
  isSelected,
  isRequired,
  quantity = 0,
  onClick,
  onQuantityChange,
  step,
  customerIndex,
}: VariantCardProps) {
  const { currentMenu } = useLeftViewContext();
  const { updateVariantNotes, updateVariantSuiteCommande } = useCombo();
  const variantPrice =
    variant.menus?.find((menu) => menu.menu_id === currentMenu)?.price_ttc ??
    variant.default_price ??
    0;

  const [suiteCommande, setSuiteCommande] = useState<boolean>(false);

  const handleQuantityChange = (e: React.MouseEvent, increment: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    onQuantityChange?.(increment);
  };

  const handleNotesUpdate = (notes: string[]) => {
    updateVariantNotes(variant._id, notes, step.is_supplement);
  };

  const handleSuiteCommandeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !suiteCommande;
    setSuiteCommande(newValue);
    updateVariantSuiteCommande(variant._id, newValue, step.is_supplement);
  };

  return (
    <Card
      className={cn(
        "px-4 py-4 h-28 cursor-pointer transition-colors dark:!bg-primary-black !bg-secondary.white",
        isSelected ? "ring-1 ring-primary-red" : ""
      )}
      onClick={isRequired ? undefined : onClick}
    >
      <div className="flex justify-between items-center h-full">
        <div className="flex flex-col gap-1 justify-between h-full">
          <TypographyP className="font-medium text-sm">
            {toTitleCase(variant.name.toLowerCase())}
          </TypographyP>
          {step.is_supplement && (
            <TypographySmall className="text-sm text-neutral-dark-grey">
              {variantPrice.toFixed(currency.toFixed || 2)} {currency.currency}
            </TypographySmall>
          )}
        </div>

        <div className="flex flex-col justify-between items-end h-full">
          <div className="flex items-center justify-end gap-2 -mt-2">
            {((step.is_supplement && !step.is_required) ||
              (!step.is_required && !step.is_supplement)) &&
              isSelected && (
                <div className="flex items-end gap-2 h-8">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="-ms-px h-7 w-7 rounded"
                    onClick={(e) => handleQuantityChange(e, false)}
                  >
                    <Minus
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                  <TypographyP className="px-1.5 font-medium">
                    {quantity}
                  </TypographyP>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="-ms-px h-7 w-7 rounded"
                    onClick={(e) => handleQuantityChange(e, true)}
                  >
                    <Plus
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
              )}

            {!step.is_supplement && step.is_required && (
              <div className="flex items-center justify-end gap-2 h-8">
                <TypographyP className="font-medium">{quantity}</TypographyP>
                <DishIcon className="!w-5 !h-auto !fill-secondary-black dark:!fill-secondary-white" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-x-4">
            {isSelected && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20",
                    suiteCommande && "!bg-primary-red"
                  )}
                  onClick={handleSuiteCommandeToggle}
                >
                  <SuiteCommandIcon
                    className={cn(
                      "h-4 w-4",
                      suiteCommande
                        ? "!text-white"
                        : "!text-primary-black dark:!text-white"
                    )}
                  />
                </Button>
                <div onClick={(e) => e.stopPropagation()}>
                  <OderLineAddComments
                    productId={variant._id}
                    customerIndex={customerIndex}
                    initialNotes={variant.notes || []}
                    onNotesUpdate={handleNotesUpdate}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
