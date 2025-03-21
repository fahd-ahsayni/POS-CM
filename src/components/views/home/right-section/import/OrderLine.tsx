import {
  launchSuiteCommand,
  launchSuiteCommandForComboElement,
} from "@/api/services";
import { DishIcon, SuiteCommandIcon } from "@/assets/figma-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input as NumberFlowInput } from "@/components/ui/number-flow-input";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { OrderLine as OrderLineInterface } from "@/interfaces/order";
import type { ProductSelected } from "@/interfaces/product";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { useAppDispatch } from "@/store/hooks";
import {
  selectOrder,
  updateSuiteCommande,
} from "@/store/slices/order/create-order.slice";
import { motion } from "motion/react";
import { memo, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useOrderLine } from "../hooks/useOrderLine";
import { useProductQuantity } from "../hooks/useProductQuantity";
import OderLineAddComments from "../ui/OderLineAddComments";
import ProductActions from "../ui/ProductActions";

interface OrderLineProps {
  item: ProductSelected;
  increment: () => void;
  decrement: () => void;
}

export function OrderLine({ item }: OrderLineProps) {
  const dispatch = useAppDispatch();
  const { customerIndex, setCustomerIndex } = useRightViewContext();
  const { currentMenu, selectedProducts, setSelectedProducts } =
    useLeftViewContext();
  const { updateQuantity } = useProductQuantity();
  const [loadedOrder] = useLocalStorage<any>("loadedOrder", {});
  const [generalData] = useLocalStorage<any>("generalData", {});

  const { prices, itemVariants, selectCustomer, getDisplayName } = useOrderLine(
    {
      item,
      currentMenu,
      customerIndex,
      setCustomerIndex,
    }
  );

  useEffect(() => {
    setLaunch(false);
  }, [item]);

  const craetedOrder = useSelector(selectOrder);

  const currentProduct: OrderLineInterface = craetedOrder.orderlines.find(
    (order) => order._id === item._id
  );

  const [suiteCommandCallToAction, setSuiteCommandCallToAction] =
    useState<boolean>(currentProduct?.suite_commande || false);

  const [launch, setLaunch] = useState<boolean>(false);

  // New state map for individual badge clicks
  const [comboLaunchedMap, setComboLaunchedMap] = useState<
    Record<string, boolean>
  >({});

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

    if (loadedOrder._id) {
      const updatedProducts = selectedProducts.map((product) => {
        if (product._id === item._id) {
          return {
            ...product,
            suite_commande: newSuiteCommandStatus,
          };
        }
        return product;
      });
      setSelectedProducts(updatedProducts);
    } else {
      dispatch(
        updateSuiteCommande({
          product_variant_id: item.product_variant_id,
          suite_commande: newSuiteCommandStatus,
        })
      );
    }
  };

  const letsLaunchSuiteCommand = async () => {
    if (!item.id) return;
    const res = await launchSuiteCommand(item.id);

    if (res.status === 200) {
      setLaunch(true);
    }
  };

  const letsLaunchSuiteCommandForComboElement = async (
    badgeKey: string,
    id: string,
    elementId: string
  ) => {
    if (!item.is_combo) return;
    setComboLaunchedMap((prev) => ({ ...prev, [badgeKey]: true }));
    await launchSuiteCommandForComboElement(id, elementId);
  };

  const renderComboItems = useMemo(() => {
    if (!item.is_combo || !item.combo_items) return null;

    return (
      <div className="mt-2 text- pl-4 border-l-2 border-neutral-dark-grey/50 space-y-2">
        {item.combo_items.variants?.map((variant: any, idx: number) => {
          const badgeKey = `${item.id}-${variant._id}-${idx}`;
          return (
            <span className="flex items-center space-x-2" key={badgeKey}>
              <TypographySmall className="text-sm space-x-2">
                <span className="font-medium">x{variant.quantity || 1}</span>
                <span className="first-letter:uppercase dark:text-neutral-bright-grey text-primary-black/90 tracking-wide">
                  {toTitleCase(variant.name || "")}
                </span>
              </TypographySmall>
              {variant.suite_commande && !item.is_ordred && (
                <span className="text-sm font-medium">
                  <SuiteCommandIcon className="w-4 h-auto text-info-color" />
                </span>
              )}
              {variant.suite_commande && item.is_ordred && (
                <Badge
                  onClick={() =>
                    letsLaunchSuiteCommandForComboElement(
                      badgeKey,
                      item.id || "",
                      variant._id
                    )
                  }
                  className={
                    comboLaunchedMap[badgeKey] || variant.suite_ordred
                      ? "text-white bg-info-color"
                      : "bg-interactive-dark-red"
                  }
                >
                  {comboLaunchedMap[badgeKey] || variant.suite_ordred
                    ? "Launched"
                    : "Launch"}
                </Badge>
              )}
            </span>
          );
        })}

        {item.combo_items.supplements?.length > 0 && (
          <div className="mt-1 space-y-1">
            {item.combo_items.supplements.map((supp: any, idx: number) => {
              const badgeKey = `${supp._id || supp.name}-${idx}`;
              const suppPrice =
                supp.price ||
                supp.menus?.find((menu: any) => menu.menu_id === currentMenu)
                  ?.price_ttc ||
                supp.default_price ||
                0;
              const price = suppPrice * (supp.quantity || 1);

              return (
                <div
                  key={badgeKey}
                  className="flex justify-between items-center"
                >
                  <span className="flex items-center space-x-2">
                    <TypographySmall className="text-sm space-x-2">
                      <span className="font-medium">x{supp.quantity || 1}</span>
                      <span className="first-letter:uppercase dark:text-neutral-bright-grey text-primary-black/90 tracking-wide">
                        {toTitleCase(supp.name || "")}
                      </span>
                    </TypographySmall>
                    {supp.suite_commande && !item.is_ordred && (
                      <span className="text-sm font-medium">
                        <SuiteCommandIcon className="w-4 h-auto text-info-color" />
                      </span>
                    )}
                    {supp.suite_commande && item.is_ordred && (
                      <Badge
                        onClick={() =>
                          letsLaunchSuiteCommandForComboElement(
                            badgeKey,
                            item.id || "",
                            supp._id
                          )
                        }
                        className={
                          comboLaunchedMap[badgeKey] || supp.suite_ordred
                            ? "text-white bg-info-color"
                            : "bg-interactive-dark-red"
                        }
                      >
                        {comboLaunchedMap[badgeKey] || supp.suite_ordred
                          ? "Launched"
                          : "Launch"}
                      </Badge>
                    )}
                  </span>
                  {price > 0 && (
                    <TypographySmall className="font-medium text-xs dark:text-white/30 text-primary-black/30">
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
  }, [item.combo_items, item.id, currentMenu, item.is_combo, comboLaunchedMap]);

  // Display effective quantity (after cancellations) for ordered items
  const effectiveQuantity = useMemo(() => {
    if (item.is_ordred && item.cancelled_qty) {
      return Math.max(item.quantity - item.cancelled_qty, 0);
    }
    return item.quantity;
  }, [item.quantity, item.cancelled_qty, item.is_ordred]);

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
      onClick={
        item.cancelled_qty === item.quantity || item.is_paid
          ? undefined
          : selectCustomer
      }
    >
      <Card
        className={cn(
          "flex w-full overflow-hidden relative pr-3 py-2.5 transition-all duration-300 ease-in-out",
          item.is_ordred && item.suite_commande && !item.is_combo
            ? "pl-14"
            : "pl-5",
          (item.cancelled_qty === item.quantity || item.is_paid) &&
            "opacity-50 pointer-events-none"
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
          onClick={
            item.is_ordred && item.suite_commande && !item.is_combo
              ? letsLaunchSuiteCommand
              : undefined
          }
          className={cn(
            "absolute left-0 top-0",
            launch || item.is_ordred
              ? "bg-info-color"
              : "bg-interactive-dark-red"
          )}
        >
          {item.is_ordred && item.suite_commande && !item.is_combo && (
            <TypographyP className="-rotate-90 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white whitespace-nowrap font-medium tracking-wide">
              {launch || item.suite_ordred ? "Launched" : "Launch"}
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
                <>
                  {item.is_paid ? (
                    <div>
                      <TypographyP className="text-green-500">Paid</TypographyP>
                    </div>
                  ) : (
                    <div className="flex items-center gap-x-2">
                      {item.cancelled_qty === item.quantity ? (
                        <TypographyP className="text-error-color">
                          Canceled
                        </TypographyP>
                      ) : (
                        <div className="flex items-center">
                          <TypographyP className="px-1.5 font-medium">
                            {effectiveQuantity}
                          </TypographyP>
                          <DishIcon className="w-5 h-auto fill-secondary-black dark:fill-secondary-white" />
                        </div>
                      )}
                    </div>
                  )}
                </>
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
                {item.price
                  ? item.price.toFixed(2)
                  : prices.totalPrice.toFixed(2)}{" "}
                {currency.currency}
              </TypographyP>
              {item.discount?.discount_id && localStorage.discount && (
                <Badge variant="secondary">
                  -
                  {generalData?.discount.find(
                    (d: any) => d._id === item.discount?.discount_id
                  )?.value || 0}
                  %
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-x-3">
              {!item.is_combo &&
                !item.is_ordred &&
                !item.cancelled_qty &&
                !item.is_paid && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20 rounded transition-colors duration-200",
                      suiteCommandCallToAction &&
                        "ring-1 ring-error-color bg-error-color shadow-lg shadow-error-color/50 hover:bg-error-color"
                    )}
                    onClick={handleSuiteCommandCallToAction}
                  >
                    <SuiteCommandIcon
                      className={cn(
                        "dark:text-white text-primary-black",
                        suiteCommandCallToAction &&
                          "!dark:text-white text-white"
                      )}
                    />
                    <span className="sr-only">Suite Command</span>
                  </Button>
                )}
              {!item.is_ordred && (
                <OderLineAddComments
                  productId={item.id || item._id} // Use item.id if available, otherwise use item._id
                  customerIndex={item.customer_index || customerIndex}
                  initialNotes={item.notes || []}
                />
              )}
              <ProductActions item={item} />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(OrderLine);
