import { TypographyP } from "@/components/ui/typography";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { currency } from "@/preferences";
import { motion } from "framer-motion";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

export default function Ticket() {
  const { selectedProducts, currentMenu } = useLeftViewContext();
  const order = useSelector((state: RootState) => state.createOrder);
  
  const calculations = useMemo(() => {
    const subtotal = selectedProducts.reduce((total, product) => {
      const price = calculateProductPrice(product, currentMenu, product.quantity);
      return total + price.totalPrice;
    }, 0);

    const discount = order.data.discount?.discount_id
      ? JSON.parse(localStorage.getItem("generalData") || "{}")?.discount?.find(
          (d: any) => d._id === order.data.discount.discount_id
        )
      : null;

    const discountAmount = discount
      ? discount.type === "percentage"
        ? (subtotal * Number(discount.value)) / 100
        : Number(discount.value)
      : 0;

    const tax = (subtotal * 10) / 110; // Assuming 10% tax rate
    const total = subtotal - discountAmount;

    return { subtotal, discountAmount, tax, total };
  }, [selectedProducts, currentMenu, order.data.discount]);

  const { toFixed, currency: currencySymbol } = currency;

  useEffect(() => {
    console.log(calculations.total);
  }, [calculations]);

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
              {calculations.discountAmount.toFixed(toFixed ?? 2)} {currencySymbol}
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
