import { TypographyP } from "@/components/ui/typography";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { currency } from "@/preferences";
import { RootState } from "@/store";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";

export default function Ticket() {
  const { selectedProducts, currentMenu } = useLeftViewContext();
  const order = useSelector((state: RootState) => state.createOrder);
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");

  const [loadedOrder] = useLocalStorage<any>("loadedOrder", {});

  const calculations = useMemo(() => {
    // If loadedOrder has total_amount, use the loaded order values
    if (loadedOrder && loadedOrder.total_amount) {
      // Calculate subtotal from orderlines if it's not provided
      const subtotal = loadedOrder.orderline_ids
        ? loadedOrder.orderline_ids.reduce((total: number, line: any) => {
            const lineTotal =
              (line.quantity - (line.cancelled_qty || 0)) * line.price;
            return total + lineTotal;
          }, 0)
        : loadedOrder.total_amount + (loadedOrder.discount_amount || 0);

      return {
        subtotal: subtotal || 0,
        discountAmount: loadedOrder.discount_amount || 0,
        tax: (subtotal * 10) / 110, // Assuming same 10% tax rate
        total: loadedOrder.total_amount || 0,
      };
    }

    // Otherwise calculate as before
    const subtotal = selectedProducts.reduce((total, product) => {
      const price = calculateProductPrice(
        product,
        currentMenu,
        product.quantity
      );
      return total + price.totalPrice;
    }, 0);

    const discount = order.data.discount?.discount_id
      ? JSON.parse(localStorage.getItem("generalData") || "{}")?.discount?.find(
          (d: any) => d._id === order.data.discount?.discount_id
        )
      : null;

    const discountAmount = discount
      ? discount.type === "percentage"
        ? (subtotal * Number(discount.value)) / 100
        : Number(discount.value)
      : 0;

    const tax = (subtotal * 10) / 110; // Assuming 10% tax rate
    const total =
      orderType.delivery_product_variant_id && order.data.delivery_guy_id
        ? subtotal -
          discountAmount +
          orderType.delivery_product_variant_id.default_price
        : subtotal - discountAmount;

    return { subtotal, discountAmount, tax, total };
  }, [selectedProducts, currentMenu, order.data.discount, loadedOrder]);

  const { toFixed, currency: currencySymbol } = currency;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      exit={{ opacity: 0, y: 100 }}
      className="w-full relative"
    >
      <div className="w-full rounded-lg dark:bg-white bg-primary-black pt-2 relative [mask-image:radial-gradient(circle_14px_at_-2px_calc(100%-68px),transparent_100%,black_101%),radial-gradient(circle_14px_at_calc(100%+2px)_calc(100%-68px),transparent_100%,black_101%),linear-gradient(black,black)] [mask-composite:intersect]">
        <div className="p-4 space-y-1">
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm font-semibold dark:text-primary-black text-white">
              Subtotal
            </TypographyP>
            <TypographyP className="text-sm font-semibold dark:text-primary-black text-white">
              {calculations.subtotal.toFixed(toFixed ?? 2)} {currencySymbol}
            </TypographyP>
          </div>
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm dark:text-primary-black text-white">
              Discount sales
            </TypographyP>
            <TypographyP className="text-sm dark:text-primary-black text-white">
              {calculations.discountAmount.toFixed(toFixed ?? 2)}{" "}
              {currencySymbol}
            </TypographyP>
          </div>
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm dark:text-primary-black text-white">
              Total sales tax
            </TypographyP>
            <TypographyP className="text-sm dark:text-primary-black text-white  ">
              {calculations.tax.toFixed(toFixed ?? 2)} {currencySymbol}
            </TypographyP>
          </div>
        </div>

        <div className="w-full relative flex items-center justify-center py-2">
          <div className="absolute w-full h-[1px] border-t border-dashed border-neutral-dark-grey z-0" />
        </div>

        <div className="flex items-center justify-between w-full px-4 py-4">
          <TypographyP className="dark:text-primary-black text-white font-semibold text-lg">
            Total
          </TypographyP>
          <TypographyP className="dark:text-primary-black text-white font-semibold text-lg">
            {calculations.total.toFixed(toFixed ?? 2)} {currencySymbol}
          </TypographyP>
        </div>
      </div>
    </motion.div>
  );
}
