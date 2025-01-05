import { DishIcon, SuiteCommandIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import OderLineAddComments from "@/components/views/home/right-section/ui/OderLineAddComments";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { ProductVariant, Step } from "@/types/comboTypes";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCombo } from "../context/ComboContext";

interface VariantCardProps {
  variant: ProductVariant;
  isSelected: boolean;
  isSupplement: boolean;
  isRequired: boolean;
  quantity?: number;
  onClick: () => void;
  onQuantityChange?: (increment: boolean) => void;
  step: Step;
  customerIndex: number;
}

export function VariantCard({
  variant,
  isSelected,
  isSupplement,
  isRequired,
  quantity = 0,
  onClick,
  onQuantityChange,
  step,
  customerIndex,
}: VariantCardProps) {
  const { updateVariantNotes, updateVariantSuiteCommande } = useCombo();
  const [suiteCommande, setSuiteCommande] = useState(
    variant.suite_commande || false
  );

  const handleQuantityChange = (e: React.MouseEvent, increment: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    onQuantityChange?.(increment);
  };

  const handleSuiteCommandeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValue = !suiteCommande;
    setSuiteCommande(newValue);
    updateVariantSuiteCommande(variant._id, newValue, step.is_supplement);
  };

  const handleNotesUpdate = (notes: string[]) => {
    updateVariantNotes(variant._id, notes, step.is_supplement);
  };

  return (
    <Card
      className={cn(
        "px-3 py-2 h-[5.5rem] cursor-pointer transition-colors dark:!bg-primary-black !bg-neutral-bright-grey",
        isSelected ? "ring-1 ring-primary-red" : ""
      )}
      onClick={isRequired ? undefined : onClick}
    >
      <div className="flex justify-between items-center h-full">
        <div className="flex flex-col gap-1 justify-between h-full">
          <TypographyP className="font-medium capitalize text-sm">
            {variant.name.toLowerCase()}
          </TypographyP>
          {step.is_supplement && (
            <TypographySmall className="text-sm text-neutral-dark-grey">
              {variant.price_ttc.toFixed(currency.toFixed || 2)}{" "}
              {currency.currency}
            </TypographySmall>
          )}
        </div>

        <div className="flex flex-col justify-between items-end h-full">
          <div className="flex items-center justify-end gap-2">
            {((step.is_supplement && !step.is_required) ||
              (!step.is_required && !step.is_supplement)) &&
              isSelected && (
                <div className="flex items-center gap-2 h-8">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="-ms-px h-7 w-7 rounded bg-accent-white/10 hover:bg-accent-white/20"
                    onClick={(e) => handleQuantityChange(e, false)}
                  >
                    <Minus
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="text-primary-black dark:text-white"
                    />
                  </Button>
                  <TypographyP className="px-1.5 font-medium">
                    {quantity}
                  </TypographyP>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="-ms-px h-7 w-7 rounded bg-accent-white/10 hover:bg-accent-white/20"
                    onClick={(e) => handleQuantityChange(e, true)}
                  >
                    <Plus
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="text-primary-black dark:text-white"
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
                <div onClick={(e) => e.stopPropagation()}>
                  <OderLineAddComments
                    productId={variant._id}
                    customerIndex={customerIndex}
                    initialNotes={variant.notes || []}
                    onNotesUpdate={handleNotesUpdate}
                  />
                </div>
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
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
