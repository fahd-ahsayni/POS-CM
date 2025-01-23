import { DishIcon } from "@/assets/figma-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { currency } from "@/preferences";
import { ProductSelected } from "@/types/product.types";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { memo, useMemo } from "react";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useOrderLine } from "../hooks/useOrderLine";
import OderLineAddComments from "../ui/OderLineAddComments";
import ProductActions from "../ui/ProductActions";

interface OrderLineProps {
  item: ProductSelected;
  increment: () => void;
  decrement: () => void;
}

export function OrderLine({ item, increment, decrement }: OrderLineProps) {
  const { customerIndex, setCustomerIndex } = useRightViewContext();
  const { currentMenu } = useLeftViewContext();

  const { prices, itemVariants, selectCustomer, getDisplayName } = useOrderLine(
    {
      item,
      currentMenu,
      customerIndex,
      setCustomerIndex,
    }
  );

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectCustomer();
    increment();
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectCustomer();
    decrement();
  };

  const renderComboItems = useMemo(() => {
    if (!item.is_combo || !item.combo_items) return null;

    return (
      <div className="mt-2 pl-4 border-l-2 border-neutral-dark-grey/50 space-y-2">
        {item.combo_items.variants?.map((variant: any, idx: number) => (
          <TypographySmall
            key={`${item.id}-${variant._id}-${idx}`}
            className="text-sm space-x-2"
          >
            <span className="font-medium">x{variant.quantity || 1}</span>
            <span className="first-letter:uppercase dark:text-neutral-bright-grey text-primary-black/90 tracking-wide">
              {toTitleCase(variant.name || "")}
            </span>
          </TypographySmall>
        ))}

        {item.combo_items.supplements?.length > 0 && (
          <div className="mt-1">
            {item.combo_items.supplements.map((supp: any, idx: number) => {
              const suppPrice =
                supp.price ||
                supp.menus?.find((menu: any) => menu.menu_id === currentMenu)
                  ?.price_ttc ||
                supp.default_price ||
                0;
              const price = suppPrice * (supp.quantity || 1);

              return (
                <div key={`${supp._id || supp.name}-${idx}`}>
                  <TypographySmall className="text-sm space-x-2">
                    <span className="font-medium">x{supp.quantity || 1}</span>
                    <span className="first-letter:uppercase dark:text-neutral-bright-grey text-primary-black/90 tracking-wide">
                      {toTitleCase(supp.name || "")}
                    </span>
                  </TypographySmall>
                  {price > 0 && (
                    <TypographySmall className="font-medium">
                      +{price.toFixed(currency.toFixed || 2)}{" "}
                      {currency.currency}
                    </TypographySmall>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }, [item.combo_items, item.id, currentMenu]);

  return (
    <motion.div
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={itemVariants}
      transition={{
        duration: 0.2,
        ease: "easeOut",
      }}
      className="flex relative cursor-pointer items-center justify-start h-full w-full rounded-r-lg"
      onClick={selectCustomer}
    >
      <div className="absolute h-full w-1.5 left-0 top-0 bg-interactive-dark-red rounded-l-lg" />
      <Card className="flex flex-col w-full py-2 pr-2 pl-4 gap-y-2 !rounded-l-md">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex flex-col">
            {item.variants && item.variants.length > 0 ? (
              <TypographyP className="font-medium">
                {getDisplayName(item.variants[0])}
              </TypographyP>
            ) : (
              <TypographyP className="font-medium">
                {getDisplayName({ name: item.name })}
              </TypographyP>
            )}
          </div>
          <div className="flex items-center gap-x-2">
            {item.is_ordred ? (
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

        {renderComboItems}

        <div className="flex items-center justify-between w-full mt-4">
          <div className="flex items-center gap-x-2">
            <TypographyP className="text-sm font-medium">
              {prices.totalPrice.toFixed(2)} {currency.currency}
            </TypographyP>
            {item.discount?.discount_id &&
              localStorage.getItem("generalData") && (
                <Badge>
                  -
                  {JSON.parse(
                    localStorage.getItem("generalData") || "{}"
                  )?.discount.find(
                    (d: any) => d._id === item.discount?.discount_id
                  )?.value || 0}
                  %
                </Badge>
              )}
          </div>
          <div className="flex items-center gap-x-3">
            <OderLineAddComments
              productId={item._id}
              customerIndex={item.customer_index || customerIndex}
              initialNotes={item.notes || []}
            />
            <ProductActions item={item} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(OrderLine);
