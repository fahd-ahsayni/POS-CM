import { DishIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import OderLineAddComments from "../ui/OderLineAddComments";
import OrderLineOtherActions from "../ui/OrderLineOtherActions";
import { Card } from "@/components/ui/card";
import { currency } from "@/preferences";

interface OrderLineProps {
  item: {
    _id: string;
    variants: Array<{ name: string }>;
    quantity: number;
    price: number;
    name: string;
    is_combo: boolean;
    combo_items: {
      variants: Array<{ name: string; quantity: number }>;
      supplements: Array<{ name: string; quantity: number }>;
    };
  };
  increment: () => void;
  decrement: () => void;
}

export function OrderLine({ item, increment, decrement }: OrderLineProps) {
  const [isSuitCamand, setIsSuitCamand] = useState(false);
  const [launched, setLaunched] = useState(false);

  const config = JSON.parse(localStorage.getItem("generalData") || "{}")
    .configs[0];

  const itemVariants = useMemo(
    () => ({
      initial: { x: 50, opacity: 0 },
      animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.25, ease: "easeInOut" },
      },
    }),
    []
  );

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    increment();
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrement();
  };

  return (
    <motion.div className="flex cursor-pointer items-center justify-start h-full w-full">
      <Card
        className={`flex flex-col w-full py-2 px-2 gap-y-2 ${
          item.quantity > 0 ? "!ring-2 !ring-red-600" : ""
        }`}
      >
        <div className="flex items-center gap-x-4">
          <TypographyP className="font-medium capitalize">
            {item.name.toLowerCase()}
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
              <div className="flex items-center gap-x-2">
                <Button
                  slot="decrement"
                  className="-ms-px h-7 w-7 rounded bg-accent-white/10 hover:bg-accent-white/20"
                  size="icon"
                  onClick={handleDecrement}
                >
                  <Minus
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="text-primary-black dark:text-white"
                  />
                </Button>
                <TypographyP className="px-1.5 font-medium">
                  {item.quantity}
                </TypographyP>
                <Button
                  slot="increment"
                  className="-ms-px h-7 w-7 rounded bg-accent-white/10 hover:bg-accent-white/20"
                  size="icon"
                  onClick={handleIncrement}
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
          </div>
        </div>

        {item.is_combo && item.combo_items && (
          <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
            {item.combo_items.variants.map((variant, idx) => (
              <div
                key={`${variant._id}-${idx}`}
                className="text-sm text-neutral-dark-grey"
              >
                <TypographyP className="text-xs">
                  {variant.name} x{variant.quantity}
                </TypographyP>
              </div>
            ))}

            {item.combo_items.supplements.length > 0 && (
              <div className="mt-1">
                {item.combo_items.supplements.map((supp, idx) => (
                  <div
                    key={`${supp._id}-${idx}`}
                    className="text-sm text-neutral-dark-grey"
                  >
                    <TypographyP className="text-xs text-red-600">
                      +{supp.name} x{supp.quantity}
                    </TypographyP>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between w-full mt-2">
          <TypographyP className="text-sm font-medium text-neutral-dark-grey">
            {item.price} {currency.currency}
          </TypographyP>
          <div className="flex items-center gap-x-2">
            {config?.value !== "restaurant" && (
              <button onClick={() => setIsSuitCamand(!isSuitCamand)}>
                suite_command
              </button>
            )}
            <OrderLineOtherActions />
            <OderLineAddComments />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(OrderLine);
