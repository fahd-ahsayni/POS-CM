import { DishIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { currency } from "@/preferences";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { getAllVariants } from "@/functions/getAllVariants";

interface ComboCardProps {
  item: any;
  increment: () => void;
  decrement: () => void;
}

export function ComboCard({ item, increment, decrement }: ComboCardProps) {
  const [isSuitCamand, setIsSuitCamand] = useState(false);
  const variants = getAllVariants();

  const itemVariants = {
    initial: { x: 50, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  const getComboName = () => {
    const variant = variants.find(v => v._id === item.product_variant_id);
    return variant?.name || 'Unknown Combo';
  };

  const getComboItemName = (variantId: string) => {
    const variant = variants.find(v => v._id === variantId);
    return variant?.name || 'Unknown Item';
  };

  // Ensure combo_prod_ids and combo_supp_ids exist with default empty arrays
  const comboProducts = item.combo_prod_ids || [];
  const comboSupplements = item.combo_supp_ids || [];

  return (
    <motion.div
      variants={itemVariants}
      className="flex relative cursor-pointer items-center justify-start h-full w-full rounded-lg overflow-hidden"
    >
      <div className="absolute h-full w-1.5 left-0 top-0 bg-interactive-dark-red" />
      <Card className="flex flex-col w-full py-2 pr-2 pl-4 gap-y-2">
        <div className="flex items-center justify-between gap-x-4">
          <TypographyP className="font-medium capitalize">
            {getComboName().toLowerCase()}
          </TypographyP>
          <div className="flex items-center gap-x-2">
            {isSuitCamand ? (
              <div className="flex items-center">
                <TypographyP className="px-1.5 font-medium">
                  {item.quantity}
                </TypographyP>
                <DishIcon className="!w-5 !h-auto !fill-secondary-black dark:!fill-secondary-white" />
              </div>
            ) : (
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  slot="decrement"
                  className="-ms-px h-7 w-7 rounded bg-accent-white/10 hover:bg-accent-white/20"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); decrement(); }}
                >
                  <Minus size={16} strokeWidth={2} className="text-primary-black dark:text-white" />
                </Button>
                <TypographyP className="px-1.5 font-medium">
                  {item.quantity}
                </TypographyP>
                <Button
                  slot="increment"
                  className="-ms-px h-7 w-7 rounded bg-accent-white/10 hover:bg-accent-white/20"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); increment(); }}
                >
                  <Plus size={16} strokeWidth={2} className="text-primary-black dark:text-white" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 pl-4 border-l-2 border-neutral-dark-grey/50 space-y-2">
          {comboProducts.map((variant: any, idx: number) => (
            <TypographySmall key={`${variant.product_variant_id}-${idx}`} className="text-sm space-x-2">
              <span className="font-semibold">x{variant.quantity}</span>
              <span className="capitalize first-letter:uppercase text-neutral-bright-grey/90">
                {getComboItemName(variant.product_variant_id).toLowerCase()}
              </span>
            </TypographySmall>
          ))}

          {comboSupplements.length > 0 && (
            <div className="mt-1">
              {comboSupplements.map((supp: any, idx: number) => (
                <div key={`${supp.product_variant_id}-${idx}`}>
                  <TypographySmall className="text-sm space-x-2">
                    <span className="font-semibold">x{supp.quantity}</span>
                    <span className="capitalize first-letter:uppercase text-neutral-bright-grey/90">
                      {getComboItemName(supp.product_variant_id).toLowerCase()}
                    </span>
                  </TypographySmall>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between w-full mt-4">
          <TypographyP className="text-sm font-medium">
            {item.price} {currency.currency}
          </TypographyP>
        </div>
      </Card>
    </motion.div>
  );
} 