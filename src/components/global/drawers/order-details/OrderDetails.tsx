import { printOrder } from "@/api/services";
import {
  BillIcon,
  DishIcon,
  PrinterIcon,
  UserIcon,
} from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { toTitleCase } from "@/functions/string-transforms";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { Checkbox } from "@heroui/checkbox";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Drawer from "../../Drawer";
import CancelOrder from "../cancel-order/CancelOrder";
import EditPrice from "../edit-price/EditPrice";
import Payments from "../Payments/Payments";
import { useOrderDetails } from "./hooks/useOrderDetails";

export default function OrderDetails() {
  const [editPriceOpen, setEditPriceOpen] = useState(false);
  const { setViews: setRightViews } = useRightViewContext();
  const { setViews: setLeftViews, setSelectedProducts } = useLeftViewContext();

  const {
    selectedOrder,
    openOrderDetails,
    setOpenOrderDetails,
    selectedOrderlines,
    setSelectedOrderlines,
    openCancelOrder,
    setOpenCancelOrder,
    openPayments,
    setOpenPayments,
    handleProcessPayment,
    handlePaymentComplete,
    setEditedAmount,
    handleLoadOrder,
  } = useOrderDetails(setLeftViews, setRightViews, setSelectedProducts);

  const toggleOrderLineSelection = (orderId: string) => {
    setSelectedOrderlines((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Group orderlines by customer index
  const groupedOrderLines =
    selectedOrder?.orderline_ids?.reduce((groups: any, line: any) => {
      const customerIndex = line.customer_index || 0;
      if (!groups[customerIndex]) {
        groups[customerIndex] = [];
      }
      groups[customerIndex].push({
        _id: line._id,
        price: line.price,
        quantity: line.quantity,
        customer_index: line.customer_index,
        notes: line.notes,
        is_paid: line.is_paid,
        is_ordred: line.is_ordred,
        product_variant_id: {
          name: line.product_variant_id.name,
          price_ttc: line.product_variant_id.price_ttc,
        },
        combo_prod_ids: line.combo_prod_ids || [],
        combo_supp_ids: line.combo_supp_ids || [],
      });
      return groups;
    }, {}) || {};

  const handleCustomerGroupSelection = (_: any, lines: any[]) => {
    const lineIds = lines.map((line) => line._id);
    const allSelected = lineIds.every((id) => selectedOrderlines.includes(id));

    setSelectedOrderlines((prev) =>
      allSelected
        ? prev.filter((id) => !lineIds.includes(id))
        : [...new Set([...prev, ...lineIds])]
    );
  };

  const handlePrintKitchen = async () => {
    if (!selectedOrder?._id) return;

    try {
      if (selectedOrderlines.length > 0) {
        await printOrder(selectedOrder._id, selectedOrderlines);
      } else {
        await printOrder(selectedOrder._id);
      }
    } catch (error) {
      console.error("Error printing kitchen order:", error);
    }
  };

  const calculateTotalPrice = (orderLine: any) => {
    return (orderLine.price * orderLine.quantity).toFixed(
      currency.toFixed || 2
    );
  };

  if (!selectedOrder) return null;

  return (
    <>
      <Drawer
        open={openOrderDetails}
        setOpen={setOpenOrderDetails}
        title={`Order Reference: ${selectedOrder.ref}`}
        position="left"
      >
        <div className="h-full relative">
          <div className="h-full p-1.5 w-full overflow-y-auto space-y-4 pb-32">
            {Object.entries(groupedOrderLines).map(([customerIndex, lines]) => (
              <div key={customerIndex} className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-full h-8 flex justify-between items-center px-2 bg-white dark:bg-white/10 rounded shadow">
                    <TypographySmall className="text-primary-black dark:text-white flex items-center justify-center space-x-1 tracking-wide">
                      <UserIcon className="w-4 h-4 dark:fill-white fill-primary-black leading-3" />
                      <span className="-mb-0.5">
                        Customer {Number(customerIndex)}
                      </span>
                    </TypographySmall>
                    <Checkbox
                      checked={(lines as any[]).every((line) =>
                        selectedOrderlines.includes(line._id)
                      )}
                      onChange={() =>
                        handleCustomerGroupSelection(
                          customerIndex,
                          lines as any[]
                        )
                      }
                      color="primary"
                    />
                  </div>
                </div>
                <div className="w-full space-y-2">
                  {(lines as any[]).map((orderLine) => (
                    <Card
                      key={orderLine._id}
                      className={cn(
                        "flex flex-col gap-4 w-full dark:bg-primary-black bg-neutral-bright-grey py-4 px-4 cursor-pointer",
                        selectedOrderlines.includes(orderLine._id) &&
                          "ring-2 ring-primary-red"
                      )}
                      onClick={() => toggleOrderLineSelection(orderLine._id)}
                    >
                      <div className="flex justify-between items-center">
                        <TypographyP className="dark:text-white text-primary-black font-medium capitalize">
                          {orderLine.product_variant_id.name.toLowerCase()}
                        </TypographyP>
                      </div>
                      <div className="border-l-2 dark:border-neutral-dark-grey/40 border-neutral-dark-grey/50">
                        {(orderLine.combo_prod_ids?.length > 0 ||
                          orderLine.combo_supp_ids?.length > 0) && (
                          <div className="pl-2.5 space-y-1">
                            {orderLine.combo_prod_ids?.map((combo: any) => (
                              <TypographySmall
                                key={combo._id}
                                className="dark:text-secondary-white text-primary-black text-sm flex"
                              >
                                <span className="font-semibold w-7">
                                  x{combo.quantity}
                                </span>
                                <span className="dark:text-secondary-white/90 text-primary-black capitalize">
                                  {toTitleCase(combo.product_variant_id.name)}
                                </span>
                              </TypographySmall>
                            ))}
                            {orderLine.combo_supp_ids?.map((supp: any) => (
                              <TypographySmall
                                key={supp._id}
                                className="dark:text-secondary-white text-primary-black flex items-center text-sm"
                              >
                                <span className="font-semibold w-7">
                                  x{supp.quantity}
                                </span>
                                <span className="dark:text-secondary-white/90 text-primary-black capitalize">
                                  {toTitleCase(supp.product_variant_id.name)}
                                </span>
                              </TypographySmall>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <TypographyP className="dark:text-white text-primary-black font-medium tracking-wide flex items-center gap-x-1">
                          <DishIcon className="w-5 h-5 dark:fill-white fill-primary-black" />
                          <span>{orderLine.quantity}</span>
                        </TypographyP>
                        <TypographyP className="dark:text-white text-primary-black font-medium">
                          {calculateTotalPrice(orderLine)} {currency.currency}
                        </TypographyP>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-secondary-white dark:bg-secondary-black flex items-center p-4">
            <div className="flex justify-between items-center gap-x-2 w-full">
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
              {selectedOrder.status === "new" &&
                selectedOrder.total_amount > 0 && (
                  <Button className="flex-1" onClick={handleProcessPayment}>
                    Process Payment
                  </Button>
                )}
              <Button size="icon" onClick={handlePrintKitchen}>
                <PrinterIcon className="w-5 h-5 dark:!fill-white fill-primary-black" />
              </Button>
              {selectedOrder.status !== "new" && (
                <Button size="icon">
                  <BillIcon className="w-5 h-5 dark:!fill-white fill-primary-black -mr-1 mt-0.5" />
                </Button>
              )}
              {selectedOrder.status === "new" && (
                <Button size="icon" onClick={handleLoadOrder}>
                  <ChevronDown size={20} />
                  <span className="sr-only">Load Order</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Drawer>
      <CancelOrder open={openCancelOrder} setOpen={setOpenCancelOrder} />
      <EditPrice
        open={editPriceOpen}
        setOpen={setEditPriceOpen}
        onPriceChange={(price) => setEditedAmount(price)}
      />
      <Payments
        open={openPayments}
        setOpen={setOpenPayments}
        onComplete={handlePaymentComplete}
        selectedOrder={selectedOrder}
        totalAmount={selectedOrder?.total_amount || 0}
      />
    </>
  );
}
