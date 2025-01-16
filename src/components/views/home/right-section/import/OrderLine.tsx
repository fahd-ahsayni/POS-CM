import { DishIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { toTitleCase } from "@/functions/string-transforms";
import { currency } from "@/preferences";
import { ProductSelected } from "@/types/product.types";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import OderLineAddComments from "../ui/OderLineAddComments";
import OrderLineOtherActions from "../ui/OrderLineOtherActions";

interface OrderLineProps {
  item: ProductSelected;
  increment: () => void;
  decrement: () => void;
}

export function OrderLine({ item, increment, decrement }: OrderLineProps) {
  /* TODO SUITE COMMAND: ADD IS SUITE STATE HERE  */
  // const [isSuitCamand, setIsSuitCamand] = useState(
  //   item.suite_commande || false
  // );
  const { customerIndex, setCustomerIndex } = useRightViewContext();

  /* TODO SUITE COMMAND: ADD SELECTED PRODUCTS STATE HERE */
  const { currentMenu } = useLeftViewContext();

  const prices = useMemo(() => {
    return calculateProductPrice(item, currentMenu, item.quantity);
  }, [item, currentMenu]);

  const itemVariants = useMemo(
    () => ({
      initial: {
        opacity: 0,
        x: item._animation === "reverse" ? -20 : 20,
      },
      animate: {
        opacity: 1,
        x: 0,
      },
      exit: {
        opacity: 0,
        x: -20,
      },
    }),
    [item._animation]
  );

  const selectCustomer = useCallback(() => {
    if (item.customer_index && item.customer_index !== customerIndex) {
      setCustomerIndex(item.customer_index);
    }
  }, [item.customer_index, customerIndex, setCustomerIndex]);

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

  /* TODO SUITE COMMAND: ACTIVATE THIS FUNCTION */

  // const handleSuiteCommandeToggle = () => {
  //   selectCustomer();
  //   const currentCustomerIndex = item.customer_index || customerIndex;

  //   const updatedOrderLine = {
  //     ...item,
  //     suite_commande: !isSuitCamand,
  //     high_priority: !isSuitCamand ? false : item.high_priority,
  //     customer_index: currentCustomerIndex,
  //   };

  //   dispatch(
  //     updateOrderLine({
  //       _id: item._id,
  //       customerIndex: currentCustomerIndex,
  //       orderLine: updatedOrderLine,
  //     })
  //   );

  //   const updatedProducts = selectedProducts.map((product) => {
  //     if (
  //       product._id === item._id &&
  //       product.customer_index === currentCustomerIndex
  //     ) {
  //       return {
  //         ...product,
  //         suite_commande: !isSuitCamand,
  //         high_priority: !isSuitCamand ? false : product.high_priority,
  //       };
  //     }
  //     return product;
  //   });
  //   setSelectedProducts(updatedProducts);

  //   setIsSuitCamand(!isSuitCamand);
  // };

  const getDisplayName = (variant: any) => {
    if (!variant) return "Unknown Product";
    return toTitleCase((variant.name || "Unknown Product").toLowerCase());
  };

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
      className="flex relative cursor-pointer items-center justify-start h-full w-full rounded-lg overflow-hidden"
      onClick={selectCustomer}
    >
      <div className="absolute h-full w-1.5 left-0 top-0 bg-interactive-dark-red" />
      <Card className="flex flex-col w-full py-2 pr-2 pl-4 gap-y-2">
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
            {/* TODO SUITE COMMAND: ADD IS SUITE STATE HERE  */}
            {false ? (
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
                <span className="font-medium">x{variant.quantity}</span>
                <span className="first-letter:uppercase dark:text-neutral-bright-grey text-primary-black/90 tracking-wide">
                  {toTitleCase(variant.name)}
                </span>
              </TypographySmall>
            ))}

            {item.combo_items.supplements.length > 0 && (
              <div className="mt-1">
                {item.combo_items.supplements.map((supp, idx) => {
                  const suppPrice =
                    supp.menus?.find(
                      (menu: any) => menu.menu_id === currentMenu
                    )?.price_ttc ||
                    supp.default_price ||
                    0;
                  const price = suppPrice * supp.quantity;
                  return (
                    <div key={`${supp.name}-${idx}`}>
                      <TypographySmall className="text-sm space-x-2">
                        <span className="font-medium">x{supp.quantity}</span>
                        <span className="first-letter:uppercase dark:text-neutral-bright-grey text-primary-black/90 tracking-wid">
                          {toTitleCase(supp.name)}
                        </span>
                      </TypographySmall>
                      <TypographySmall className="font-medium">
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
            {prices.totalPrice.toFixed(2)} {currency.currency}
          </TypographyP>
          <div className="flex items-center gap-x-3">
            <OderLineAddComments
              productId={item._id}
              customerIndex={item.customer_index || customerIndex}
              initialNotes={item.notes || []}
            />
            {/* <Button
              size="icon"
              variant="ghost"
              className="-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20"
              onClick={handleSuiteCommandeToggle}
            >
              <SuiteCommandIcon className="!text-primary-black dark:!text-white h-4 w-4" />
            </Button> */}

            <OrderLineOtherActions item={item} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(OrderLine);
