import { currency } from "@/preferences";
import Drawer from "../../Drawer";
import { useOrder } from "./context/OrderContext";
import { useEffect } from "react";
import { TypographyH4, TypographyP } from "@/components/ui/typography";

export default function OrderDetails() {
  const {
    selectedOrder,
    openOrderDetails,
    setOpenOrderDetails,
    orderLines,
    setOrderLines,
  } = useOrder();

  useEffect(() => {
    if (selectedOrder) {
      // Map the order data correctly
      const orderLines =
        selectedOrder.orderline_ids?.map((line: any) => ({
          ...line,
          product: line.product_variant_id?.product_id,
          variant: line.product_variant_id,
          quantity: line.quantity,
          price: line.price,
          notes: line.notes || [],
        })) || [];
      setOrderLines(orderLines);
    }
  }, [selectedOrder, setOrderLines]);

  if (!selectedOrder) return null;

  return (
    <Drawer
      open={openOrderDetails}
      setOpen={setOpenOrderDetails}
      title={`Order Reference: ${selectedOrder.ref}`}
      position="left"
    >
      <div>
        {orderLines.map((orderLine) => (
          <div
            key={orderLine._id}
            className="flex flex-col gap-4 w-full dark:bg-primary-black bg-neutral-bright-grey shadow-md py-4 px-4 rounded-md"
          >
            <TypographyP className="dark:text-white text-primary-black font-medium capitalize">
              {orderLine.product_variant_id.name.toLowerCase()}
            </TypographyP>
            <div className="flex justify-between">
              <TypographyP className="dark:text-white text-primary-black text-sm font-medium tracking-wide">
                <span className="text-primary-black/50 dark:text-white/50">
                  Quantity:
                </span>{" "}
                {orderLine.quantity}
              </TypographyP>
              <TypographyP className="dark:text-white text-primary-black font-medium">
                {orderLine.product_variant_id.price_ttc.toFixed(
                  currency.toFixed || 2
                )}{" "}
                {currency.currency}
              </TypographyP>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
