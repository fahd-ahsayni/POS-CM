import { DishIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { ProductVariant, Step } from "@/types/comboTypes";
import { Minus, Plus } from "lucide-react";

interface VariantCardProps {
  variant: ProductVariant;
  isSelected: boolean;
  isSupplement: boolean;
  isRequired: boolean;
  quantity?: number;
  onClick: () => void;
  onQuantityChange?: (increment: boolean) => void;
  step: Step;
}

export function VariantCard({
  variant,
  isSelected,
  isRequired,
  quantity = 0,
  onClick,
  onQuantityChange,
  step,
}: VariantCardProps) {
  const handleQuantityChange = (e: React.MouseEvent, increment: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    onQuantityChange?.(increment);
  };

  return (
    <Card
      className={cn(
        "px-3  py-2 h-[5.5rem] cursor-pointer transition-colors dark:!bg-primary-black !bg-neutral-bright-grey",
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

        <div className="flex flex-col justify-between items-center h-full">
          {((step.is_supplement && !step.is_required) ||
            (!step.is_required && !step.is_supplement)) &&
            isSelected && (
              <div className="flex items-center gap-2 h-full">
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
            <div className="flex items-center gap-2">
              <TypographyP className="font-medium">{quantity}</TypographyP>
              <DishIcon className="!w-5 !h-auto !fill-secondary-black dark:!fill-secondary-white" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
