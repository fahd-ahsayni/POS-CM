import { printOrder } from "@/api/services";
import { BillIcon, DishIcon, PrinterIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { useEffect, useState } from "react";
import Drawer from "../../Drawer";
import { useOrder } from "./context/OrderContext";
import CancelOrder from "../cancel-order/CancelOrder";

export default function OrderDetails() {
  const {
    selectedOrder,
    openOrderDetails,
    setOpenOrderDetails,
    orderLines,
    setOrderLines,
  } = useOrder();

  const [selctedOrderlines, setSelctedOrderlines] = useState<string[] | null>(
    null
  );

  const [openCancelOrder, setOpenCancelOrder] = useState(false);

  const toggleOrderLineSelection = (orderId: string) => {
    setSelctedOrderlines((prev) => {
      if (prev && prev.includes(orderId)) {
        return prev.filter((id) => id !== orderId);
      }
      return [...(prev || []), orderId];
    });
  };

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

  const handlePrintBill = async () => {
    if (selctedOrderlines) {
      await printOrder(selectedOrder._id, selctedOrderlines);
    } else {
      await printOrder(selectedOrder._id);
    }
  };

  return (
    <>
    <Drawer
      open={openOrderDetails}
      setOpen={setOpenOrderDetails}
      title={`Order Reference: ${selectedOrder.ref}`}
      position="left"
    >
      <div className="h-full relative">
        <div className="h-full p-1.5 w-full overflow-y-auto space-y-2">
          {orderLines.map((orderLine) => (
            <Card
              key={orderLine._id}
              className={cn(
                "flex flex-col gap-4 w-full dark:bg-primary-black bg-neutral-bright-grey py-4 px-4 cursor-pointer",
                selctedOrderlines &&
                  selctedOrderlines.includes(orderLine._id) &&
                  "ring-2 ring-primary-red"
              )}
              onClick={() => toggleOrderLineSelection(orderLine._id)}
            >
              <div className="flex justify-between items-center">
                <TypographyP className="dark:text-white text-primary-black font-medium capitalize">
                  {orderLine.product_variant_id.name.toLowerCase()}
                </TypographyP>
                <div
                  className="flex items-center gap-2"
                  style={
                    {
                      "--primary": "0 100% 49%",
                      "--ring": "0 100% 49%",
                    } as React.CSSProperties
                  }
                >
                  <Checkbox
                    className="w-6 h-6 bg-secondary-white"
                    checked={selctedOrderlines?.includes(orderLine._id)}
                    onCheckedChange={() =>
                      toggleOrderLineSelection(orderLine._id)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <TypographyP className="dark:text-white text-primary-black font-medium tracking-wide flex items-center gap-x-1">
                  <span>
                    <DishIcon className="w-5 h-5 dark:fill-white fill-primary-black" />
                  </span>
                  <span> {orderLine.quantity}</span>
                </TypographyP>
                <TypographyP className="dark:text-white text-primary-black font-medium">
                  {orderLine.product_variant_id.price_ttc.toFixed(
                    currency.toFixed || 2
                  )}{" "}
                  {currency.currency}
                </TypographyP>
              </div>
            </Card>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-16">
          <div className="flex justify-between items-center gap-x-2">
            {selectedOrder.status === "canceled" ? (
              <Button className="flex-1" disabled>
                Cancel Order
              </Button>
            ) : (
              <Button 
                className="flex-1 dark:bg-white/10 bg-white border border-border" 
                variant="secondary"
                onClick={() => setOpenCancelOrder(true)}
              >
                Cancel Order
              </Button>
            )}
            <Button size="icon" onClick={handlePrintBill}>
              <PrinterIcon className="w-5 h-5 dark:!fill-white fill-primary-black" />
            </Button>
            <Button size="icon">
              <BillIcon className="w-5 h-5 dark:!fill-white fill-primary-black -mr-1 mt-0.5" />
            </Button>
          </div>
        </div>
      </div>
      </Drawer>
      <CancelOrder open={openCancelOrder} setOpen={setOpenCancelOrder} />
    </>
  );
}
