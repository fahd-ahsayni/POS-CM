import { printOrder } from "@/api/services";
import {
  BillIcon,
  DishIcon,
  PrinterIcon,
  SuiteCommandIcon,
  UserIcon,
} from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { toTitleCase } from "@/functions/string-transforms";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import CancelOrder from "../cancel-order/CancelOrder";
import EditPrice from "../edit-price/EditPrice";
import Drawer from "../layout/Drawer";
import Payments from "../Payments/Payments";
import { useOrderDetails } from "./hooks/useOrderDetails";

export default function OrderDetails() {
  const [editPriceOpen, setEditPriceOpen] = useState(false);
  const { setViews: setRightViews } = useRightViewContext();
  const { setViews: setLeftViews, setSelectedProducts } = useLeftViewContext();
  const [persistSelectedProducts, setPersistSelectedProducts] = useLocalStorage<
    string[]
  >("selectedProducts", []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
    calculateSelectedOrdersTotal,
  } = useOrderDetails(setLeftViews, setRightViews, setSelectedProducts);

  useEffect(() => {
    // Clear orderlines only if drawer is closed and payments are not active
    if (!openOrderDetails && !openPayments) {
      setSelectedOrderlines([]);
      setEditedAmount(null);
      setOpenCancelOrder(false);
    }
  }, [openOrderDetails, openPayments, setOpenCancelOrder]);

  useEffect(() => {
    // Update localStorage when selectedOrderlines change
    setPersistSelectedProducts(selectedOrderlines);
  }, [selectedOrderlines]);

  const toggleOrderLineSelection = (orderId: string) => {
    setSelectedOrderlines((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

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
    const unpaidLines = lines.filter((line) => !line.is_paid);
    const unpaidLineIds = unpaidLines.map((line) => line._id);
    const currentlySelected = selectedOrderlines.filter((id) =>
      unpaidLineIds.includes(id)
    );
    const allUnpaidSelected = currentlySelected.length === unpaidLineIds.length;

    setSelectedOrderlines((prev) => {
      const outsideGroup = prev.filter((id) => !unpaidLineIds.includes(id));
      return allUnpaidSelected
        ? outsideGroup
        : [...outsideGroup, ...unpaidLineIds];
    });
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
    return orderLine.price.toFixed(currency.toFixed || 2);
  };

  if (!selectedOrder) return null;

  return (
    <>
      <Drawer
        open={openOrderDetails}
        setOpen={setOpenOrderDetails}
        title={`Order Reference: ${selectedOrder.ref}`}
        position="left"
        description="Shows order details, customer info, and action buttons for payment or cancellation."
        classNames="max-w-md bg-neutral-bright-grey"
      >
        <div className="h-full flex flex-col relative">
          <ScrollArea className="flex-1 h-full px-1.5 w-full pr-4">
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
                    <Switch
                      color="red"
                      checked={(lines as any[])
                        .filter((line) => !line.is_paid)
                        .every((line) => selectedOrderlines.includes(line._id))}
                      onChange={() =>
                        handleCustomerGroupSelection(
                          customerIndex,
                          lines as any[]
                        )
                      }
                      disabled={(lines as any[]).every((line) => line.is_paid)}
                    />
                  </div>
                </div>
                <div className="w-full space-y-2 px-1">
                  {(lines as any[]).map((orderLine) => (
                    <Card
                      key={orderLine._id}
                      className={cn(
                        "flex flex-col gap-4 w-full dark:bg-primary-black bg-white py-4 px-4",
                        orderLine.is_paid &&
                          "pointer-events-none cursor-not-allowed opacity-40",
                        selectedOrderlines.includes(orderLine._id) &&
                          "ring-1 ring-primary-red"
                      )}
                      onClick={
                        !orderLine.is_paid
                          ? () => toggleOrderLineSelection(orderLine._id)
                          : undefined
                      }
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
                              <span className="flex items-center gap-x-2">
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
                                {combo.suite_commande && (
                                  <SuiteCommandIcon className="size-4 text-info-color" />
                                )}
                              </span>
                            ))}
                            {orderLine.combo_supp_ids?.map((supp: any) => (
                              <span className="flex items-center gap-x-2">
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
                                {supp.suite_commande && (
                                  <SuiteCommandIcon className="size-4 text-info-color" />
                                )}
                              </span>
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
          </ScrollArea>
          <div className="w-full bg-neutral-bright-grey dark:bg-secondary-black flex items-center p-4">
            <div className="flex justify-between items-center gap-x-2 w-full">
              <Button
                className="flex-1 dark:bg-white/10 bg-white border border-border"
                variant="secondary"
                onClick={() => setOpenCancelOrder(true)}
                disabled={
                  selectedOrder.status === "canceled" ||
                  persistSelectedProducts.length > 1
                }
              >
                {persistSelectedProducts.length > 0
                  ? "Cancel This Product"
                  : "Cancel All Products"}
              </Button>

              {selectedOrder.status === "new" &&
                user.position !== "Waiter" &&
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
                  <span className="sr-only">Download Facture</span>
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
        totalAmount={
          selectedOrderlines.length
            ? calculateSelectedOrdersTotal()
            : selectedOrder?.total_amount || 0
        }
        selectedOrderlines={selectedOrderlines}
      />
    </>
  );
}
