import { DishIcon, SuiteCommandIcon } from "@/assets/figma-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input as NumberFlowInput } from "@/components/ui/number-flow-input";
import {
  TypographyH4,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { OrderLine as OrderLineInterface } from "@/interfaces/order";
import type { ProductSelected } from "@/interfaces/product";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { useAppDispatch } from "@/store/hooks";
import {
  selectOrder,
  updateSuiteCommande,
} from "@/store/slices/order/create-order.slice";
import { motion } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useOrderLine } from "../hooks/useOrderLine";
import { useProductQuantity } from "../hooks/useProductQuantity";
import OderLineAddComments from "../ui/OderLineAddComments";
import ProductActions from "../ui/ProductActions";
import { lunchSuiteCommand } from "@/api/services";

interface OrderLineProps {
  item: ProductSelected;
  increment: () => void;
  decrement: () => void;
}

export function OrderLine({ item }: OrderLineProps) {
  const dispatch = useAppDispatch();
  const { customerIndex, setCustomerIndex } = useRightViewContext();
  const { currentMenu } = useLeftViewContext();
  const { updateQuantity } = useProductQuantity();

  const { prices, itemVariants, selectCustomer, getDisplayName } = useOrderLine(
    {
      item,
      currentMenu,
      customerIndex,
      setCustomerIndex,
    }
  );

  const craetedOrder = useSelector(selectOrder);

  const currentProduct: OrderLineInterface = craetedOrder.orderlines.find(
    (order) => order._id === item._id
  );

  const [suiteCommandCallToAction, setSuiteCommandCallToAction] =
    useState<boolean>(currentProduct?.suite_commande || false);

  const [lunche, setLunche] = useState<boolean>(false);

  // Add this check at the beginning of the component
  useEffect(() => {
    if (currentProduct) {
      setSuiteCommandCallToAction(currentProduct.suite_commande || false);
    }
  }, [currentProduct]);

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item, newQuantity);
  };

  const handleSuiteCommandCallToAction = () => {
    const newSuiteCommandStatus = !suiteCommandCallToAction;
    setSuiteCommandCallToAction(newSuiteCommandStatus);

    // Log the dispatch action
    console.log("Dispatching update:", {
      _id: item._id,
      customer_index: item.customer_index || customerIndex,
      suite_commande: newSuiteCommandStatus,
    });

    dispatch(
      updateSuiteCommande({
        product_variant_id: item.product_variant_id,
        suite_commande: newSuiteCommandStatus,
      })
    );
  };

  const letsLaunchSuiteCommand = async () => {
    console.log("item", item._id);
    const res = await lunchSuiteCommand(item._id);

    console.log("item", res);

    if (res.status === 200) {
      setLunche(true);
    }
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
          <div className="mt-1 space-y-1">
            {item.combo_items.supplements.map((supp: any, idx: number) => {
              const suppPrice =
                supp.price ||
                supp.menus?.find((menu: any) => menu.menu_id === currentMenu)
                  ?.price_ttc ||
                supp.default_price ||
                0;
              const price = suppPrice * (supp.quantity || 1);

              return (
                <div
                  key={`${supp._id || supp.name}-${idx}`}
                  className="flex justify-between items-center"
                >
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
  }, [item.combo_items, item.id, currentMenu, item.is_combo]);

  return (
    <motion.div
      key={`order-line-${item._id}-${item.customer_index || item.createdAt}`}
      layout
      variants={itemVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="flex relative cursor-pointer items-center h-full w-full rounded-r-lg"
      onClick={selectCustomer}
    >
      <Card
        className={cn(
          "flex w-full overflow-hidden relative pr-3 py-2.5 transition-all duration-300 ease-in-out",
          item.is_ordred && item.suite_commande && !item.is_combo
            ? "pl-14"
            : "pl-5"
        )}
      >
        <div
          style={{
            width:
              item.is_ordred && item.suite_commande && !item.is_combo
                ? "3rem"
                : "0.375rem",
            height: "100%",
          }}
          onClick={letsLaunchSuiteCommand}
          className="absolute left-0 top-0 bg-interactive-dark-red"
        >
          {item.is_ordred && item.suite_commande && !item.is_combo && (
            <TypographyP className="-rotate-90 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white whitespace-nowrap font-medium tracking-wide">
              {lunche ? "Launched" : "Launch"}
            </TypographyP>
          )}
        </div>
        <div
          className={cn(
            "flex flex-col w-full space-y-4",
            item.is_combo && "pl-1"
          )}
        >
          <div className="flex items-center justify-between gap-x-4">
            <div className="flex flex-col">
              <TypographyP className="font-medium line-clamp-2">
                {item.variants && item.variants.length > 0
                  ? getDisplayName(item.variants[0])
                  : getDisplayName({ name: item.name })}
              </TypographyP>
            </div>
            <div className="flex items-center gap-x-2">
              {item.is_ordred ? (
                <div className="flex items-center">
                  <TypographyP className="px-1.5 font-medium">
                    {item.quantity}
                  </TypographyP>
                  <DishIcon className="w-5 h-auto fill-secondary-black dark:fill-secondary-white" />
                </div>
              ) : (
                <div className="flex items-center justify-end">
                  <NumberFlowInput
                    value={item.quantity}
                    min={0}
                    max={100}
                    onChange={handleQuantityChange}
                  />
                </div>
              )}
            </div>
          </div>

          {renderComboItems}

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2">
              <TypographyP className="text-sm font-medium">
                {prices.totalPrice.toFixed(2)} {currency.currency}
              </TypographyP>
              {item.discount?.discount_id &&
                localStorage.getItem("generalData") && (
                  <Badge variant="secondary">
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
              {!item.is_combo && !item.is_ordred && (
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20 rounded transition-colors duration-200",
                    suiteCommandCallToAction && "ring-1 ring-error-color bg-error-color shadow-lg shadow-error-color/50"
                  )}
                  onClick={handleSuiteCommandCallToAction}
                >
                  <SuiteCommandIcon className="dark:text-white text-primary-black" />
                  <span className="sr-only">Suite Command</span>
                </Button>
              )}
              <OderLineAddComments
                productId={item._id}
                customerIndex={item.customer_index || customerIndex}
                initialNotes={item.notes || []}
              />
              <ProductActions item={item} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(OrderLine);
