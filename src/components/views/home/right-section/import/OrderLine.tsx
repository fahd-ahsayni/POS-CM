import { DishIcon, SuiteCommandIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { memo, useMemo, useState } from "react";
import OderLineAddComments from "../ui/OderLineAddComments";
import OrderLineOtherActions from "../ui/OrderLineOtherActions";
import { Card } from "@/components/ui/card";
import { currency } from "@/preferences";
import { useDispatch } from "react-redux";
import { updateOrderLine } from "@/store/slices/order/createOrder";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { toTitleCase } from "@/functions/string-transforms";

interface OrderLineProps {
  item: {
    _id: string;
    variants: any[];
    quantity: number;
    price: number;
    name: string;
    is_combo: boolean;
    combo_items: {
      variants: any[];
      supplements: any[];
    };
    suite_commande: boolean;
    customer_index: number;
    notes?: string[];
    high_priority?: boolean;
  };
  increment: () => void;
  decrement: () => void;
}

export function OrderLine({ item, increment, decrement }: OrderLineProps) {
  const [isSuitCamand, setIsSuitCamand] = useState(
    item.suite_commande || false
  );
  const dispatch = useDispatch();
  const { customerIndex } = useRightViewContext();
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();

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

  const handleSuiteCommandeToggle = () => {
    const currentCustomerIndex = item.customer_index || customerIndex;

    const updatedOrderLine = {
      ...item,
      suite_commande: !isSuitCamand,
      high_priority: !isSuitCamand ? false : item.high_priority,
      customer_index: currentCustomerIndex,
    };

    dispatch(
      updateOrderLine({
        _id: item._id,
        customerIndex: currentCustomerIndex,
        orderLine: updatedOrderLine,
      })
    );

    const updatedProducts = selectedProducts.map((product) => {
      if (
        product._id === item._id &&
        product.customer_index === currentCustomerIndex
      ) {
        return {
          ...product,
          suite_commande: !isSuitCamand,
          high_priority: !isSuitCamand ? false : product.high_priority,
        };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);

    setIsSuitCamand(!isSuitCamand);
  };

  console.log(item);

  return (
    <motion.div
      variants={itemVariants}
      className="flex relative cursor-pointer items-center justify-start h-full w-full rounded-lg overflow-hidden"
    >
      <div className="absolute h-full w-1.5 left-0 top-0 bg-interactive-dark-red" />
      <Card className="flex flex-col w-full py-2 pr-2 pl-4 gap-y-2">
        <div className="flex items-center justify-between gap-x-4">
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

        {item.is_combo && item.combo_items && (
          <div className="mt-2 pl-4 border-l-2 border-neutral-dark-grey/50 space-y-2">
            {item.combo_items.variants.map((variant, idx) => (
              <TypographySmall
                key={`${variant.name}-${idx}`}
                className="text-sm space-x-2"
              >
                <span className="font-semibold">x{variant.quantity}</span>
                <span className="capitalize first-letter:uppercase text-neutral-bright-grey/90">
                  {toTitleCase(variant.name)}
                </span>
              </TypographySmall>
            ))}

            {item.combo_items.supplements.length > 0 && (
              <div className="mt-1">
                {item.combo_items.supplements.map((supp, idx) => {
                  const price = supp.price_ttc * supp.quantity;
                  return (
                    <div key={`${supp.name}-${idx}`}>
                      <TypographySmall className="text-sm space-x-2">
                        <span className="font-semibold">x{supp.quantity}</span>
                        <span className="capitalize first-letter:uppercase text-neutral-bright-grey/90">
                          {toTitleCase(supp.name)}
                        </span>
                      </TypographySmall>
                      <TypographySmall className="text-white font-semibold">
                        +{price.toFixed(currency.toFixed || 2)}{" "}
                        {currency.currency}
                      </TypographySmall>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between w-full mt-4">
          <TypographyP className="text-sm font-medium">
            {item.price} {currency.currency}
          </TypographyP>
          <div className="flex items-center gap-x-3">
            <OderLineAddComments
              productId={item._id}
              customerIndex={item.customer_index || customerIndex}
              initialNotes={item.notes || []}
            />
            <Button
              size="icon"
              variant="ghost"
              className="-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20"
              onClick={handleSuiteCommandeToggle}
            >
              <SuiteCommandIcon className="!text-primary-black dark:!text-white h-4 w-4" />
            </Button>

            <OrderLineOtherActions item={item} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(OrderLine);
