import { logoWithoutText } from "@/assets";
import { AddUserIcon, BillIcon, ExpandListIcon } from "@/assets/figma-icons";
import Payments from "@/components/global/drawers/Payments/Payments";
import ModalConfirmHoldOrder from "@/components/global/modal/ModalConfirmHoldOrder";
import ModalConfirmOrder from "@/components/global/modal/ModalConfirmOrder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences";
import { AnimatePresence, motion } from "framer-motion";
import debounce from "lodash/debounce";
import { memo, useMemo } from "react";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useOrderSummary } from "../hooks/useOrderSummary";
import OrderLines from "../import/OrderLines";
import Ticket from "../layouts/Ticket";
import { OrderBannerOnSummary } from "../ui/OrderInfo";
import OtherActionsOrderLines from "../ui/OtherActionsOrderLines";

const OrderSummary = () => {
  const { selectedProducts } = useLeftViewContext();
  const {
    state: {
      openModalConfirmHoldOrder,
      openDrawerPayments,
      showTicket,
      isActionsDisabled,
      expandedCustomers,
      openModalConfirmOrder,
      isProcessing,
    },
    actions: {
      setOpenModalConfirmHoldOrder,
      setOpenDrawerPayments,
      handleToggleAll,
      handleAddCustomer,
      handleProceedOrder,
      handleConfirmOrder,
      handleShowTicket,
      handleHoldOrder,
      setOpenModalConfirmOrder,
    },
  } = useOrderSummary();

  const loadedOrder = localStorage.getItem("loadedOrder");

  const hasOrderChanges = useMemo(() => {
    if (!loadedOrder) return true;

    const originalOrder = JSON.parse(loadedOrder);
    const originalOrderLines = originalOrder.orderline_ids;

    if (originalOrderLines.length !== selectedProducts.length) return true;

    return selectedProducts.some((newLine) => {
      const originalLine = originalOrderLines.find(
        (line: any) =>
          line.product_variant_id._id === newLine.product_variant_id
      );

      if (!originalLine) return true;

      return (
        originalLine.quantity !== newLine.quantity ||
        originalLine.price !== newLine.price ||
        originalLine.customer_index !== newLine.customer_index ||
        JSON.stringify(originalLine.notes) !== JSON.stringify(newLine.notes)
      );
    });
  }, [selectedProducts, loadedOrder]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleShowTicket();
    }
  };

  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const taxDelivery = orderType?.delivery_product_variant_id?.default_price;

  const debouncedHandleProceedOrder = useMemo(
    () => debounce(handleProceedOrder, 300),
    [handleProceedOrder]
  );

  const debouncedHandleToggle = useMemo(
    () => debounce(handleToggleAll, 300),
    [handleToggleAll]
  );

  return (
    <>
      <Payments open={openDrawerPayments} setOpen={setOpenDrawerPayments} />
      <ModalConfirmHoldOrder
        open={openModalConfirmHoldOrder}
        setOpen={setOpenModalConfirmHoldOrder}
      />
      <ModalConfirmOrder
        open={openModalConfirmOrder}
        setOpen={setOpenModalConfirmOrder}
        onConfirm={handleConfirmOrder}
        isProcessing={isProcessing}
      />
      <div className="flex flex-col justify-start h-[calc(100%+35px)] gap-y-2">
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-2">
            <OrderBannerOnSummary />
            {taxDelivery && (
              <Badge className="text-xs">
                {`+${taxDelivery} ${currency.currency} Tax`}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-x-3">
              <OtherActionsOrderLines />
              <Button size="icon" onClick={debouncedHandleToggle}>
                <ExpandListIcon
                  className={`w-[1.2rem] h-auto fill-white transition-transform duration-200 ${
                    Object.values(expandedCustomers).every((value) => value)
                      ? "rotate-180"
                      : ""
                  }`}
                />
                <span className="sr-only">Toggle Customers</span>
              </Button>
              <Button onClick={handleAddCustomer} size="icon">
                <AddUserIcon className="w-[1.2rem] h-auto fill-white" />
                <span className="sr-only">add customer</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-y-2 overflow-y-hidden relative">
          <AnimatePresence>
            {showTicket && (
              <motion.div
                className="absolute w-full h-full top-0 left-0 z-[99] backdrop-blur-[2px] flex items-end pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleBackdropClick}
              >
                <Ticket />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-border flex-grow relative flex items-center justify-center pt-4 overflow-y-auto h-full p-1">
            <AnimatePresence>
              {selectedProducts.length < 1 && (
                <motion.img
                  src={logoWithoutText}
                  alt="Order Summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.75 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-1/2 h-auto object-contain absolute"
                />
              )}
            </AnimatePresence>
            <div className="flex-1 h-full w-full">
              <OrderLines />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2.5 pb-0.5">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={handleHoldOrder}
            disabled={isActionsDisabled}
          >
            Hold Order
          </Button>
          <Button
            onClick={debouncedHandleProceedOrder}
            className="flex-1"
            disabled={isActionsDisabled || (!!loadedOrder && !hasOrderChanges)}
          >
            {!!loadedOrder ? "Update Order" : "Proceed Order"}
          </Button>
          <Button
            size="icon"
            disabled={isActionsDisabled}
            onClick={handleShowTicket}
          >
            <BillIcon
              className={cn(
                "w-[1.2rem] h-auto -mr-1.5 mt-0.5",
                isActionsDisabled ? "!fill-primary-red" : "fill-white"
              )}
            />
            <span className="sr-only">Show Ticket</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default memo(OrderSummary);
