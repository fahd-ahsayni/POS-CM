import { logoWithoutText } from "@/assets";
import { AddUserIcon, BillIcon, ExpandListIcon } from "@/assets/figma-icons";
import Payments from "@/components/global/drawers/Payments/Payments";
import ModalConfirmHoldOrder from "@/components/global/modal/ModalConfirmHoldOrder";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { LucideMaximize } from "lucide-react";
import { memo, useEffect } from "react";
import OrderLines from "../import/OrderLines";
import OtherActionsOrderLines from "../ui/OtherActionsOrderLines";
import Ticket from "../layouts/Ticket";
import { useCustomerManagement } from "../hooks/useCustomerManagement";
import { useOrderSummary } from "../hooks/useOrderSummary";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import { TypographyP } from "@/components/ui/typography";
import { useRightViewContext } from "../contexts/rightViewContext";
import getOrderTypeData from "@/functions/getOrderTypeData";
import { cn } from "@/lib/utils";

const OrderSummary = () => {
  const { selectedProducts } = useLeftViewContext();
  const { addCustomer } = useCustomerManagement();
  const {
    state: {
      openModalConfirmHoldOrder,
      openDrawerPayments,
      showTicket,
      isActionsDisabled,
      expandedCustomers,
    },
    actions: {
      setOpenModalConfirmHoldOrder,
      setOpenDrawerPayments,
      handleToggleAll,
      handleProceedOrder,
      handleShowTicket,
      handleHoldOrder,
    },
  } = useOrderSummary();

  const { orderType } = useRightViewContext();

  useEffect(() => {
    // Check for a selected order when component mounts
    const selectedOrder = localStorage.getItem('selectedOrder');
    if (selectedOrder) {
      // Restore the order state here
      const order = JSON.parse(selectedOrder);
      // Dispatch actions to restore order state
      // Clear the selected order from localStorage
      localStorage.removeItem('selectedOrder');
    }
  }, []);

  return (
    <>
      <Payments open={openDrawerPayments} setOpen={setOpenDrawerPayments} />
      <ModalConfirmHoldOrder
        open={openModalConfirmHoldOrder}
        setOpen={setOpenModalConfirmHoldOrder}
      />
      <div className="flex flex-col justify-start h-full gap-y-2">
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-2">
            <TypographyP className="capitalize text-sm font-medium">
              {getOrderTypeData(orderType).type}
            </TypographyP>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <OtherActionsOrderLines />
              <Button size="icon" onClick={handleToggleAll}>
                <ExpandListIcon
                  className={`w-[1.2rem] h-auto fill-white transition-transform duration-200 ${
                    Object.values(expandedCustomers).every((value) => value)
                      ? "rotate-180"
                      : ""
                  }`}
                />
                <span className="sr-only">Toggle Customers</span>
              </Button>
              <Button onClick={addCustomer} size="icon">
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

        <div className="flex items-center justify-between space-x-2.5 pl-3">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={handleHoldOrder}
            disabled={isActionsDisabled}
          >
            Hold Order
          </Button>
          <Button
            onClick={handleProceedOrder}
            className="flex-1"
            disabled={isActionsDisabled}
          >
            Proceed Order
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
