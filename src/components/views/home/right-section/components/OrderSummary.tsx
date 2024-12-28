import { logoWithoutText } from "@/assets";
import {
  AddUserIcon,
  BillIcon,
  ExpandListIcon,
  PrinterIcon,
} from "@/assets/figma-icons";
import Payments from "@/components/global/drawers/Payments/Payments";
import ModalConfirmHoldOrder from "@/components/global/modal/ModalConfirmHoldOrder";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { setCustomerCount } from "@/store/slices/order/createOrder";
import { AnimatePresence, motion } from "framer-motion";
import { LucideMaximize } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import { useOrderLines } from "../contexts/orderLinesContext";
import { useRightViewContext } from "../contexts/rightViewContext";
import OrderLines from "../import/OrderLines";
import OtherActionsOrderLines from "../ui/OtherActionsOrderLines";

const OrderSummary = () => {
  const [openModalConfirmHoldOrder, setOpenModalConfirmHoldOrder] =
    useState(false);
  const [openDrawerPayments, setOpenDrawerPayments] = useState(false);
  const dispatch = useDispatch();

  const { customerIndex, setCustomerIndex, setSelectedCustomer } =
    useRightViewContext();
  const { selectedProducts } = useLeftViewContext();
  const { expandedCustomers, toggleAllCustomers } = useOrderLines();

  // Memoize the check for last customer's products
  const lastCustomerHasProducts = useMemo(() => {
    return selectedProducts.some(
      (product) => product.customer_index === customerIndex
    );
  }, [selectedProducts, customerIndex]);

  // Memoize the disabled state for buttons
  const isActionsDisabled = useMemo(
    () => selectedProducts.length === 0,
    [selectedProducts.length]
  );

  const handleAddCustomer = useCallback(() => {
    if (selectedProducts.length > 0 && lastCustomerHasProducts) {
      setCustomerIndex(customerIndex + 1);
      setSelectedCustomer(customerIndex + 1);
    }
  }, [
    selectedProducts.length,
    lastCustomerHasProducts,
    customerIndex,
    setCustomerIndex,
    setSelectedCustomer,
  ]);

  const handleToggleAll = useCallback(() => {
    if (selectedProducts.length > 0) {
      toggleAllCustomers();
    }
  }, [selectedProducts.length, toggleAllCustomers]);

  // Update order when customer index changes
  useEffect(() => {
    dispatch(setCustomerCount(customerIndex));
  }, [customerIndex, dispatch]);

  const handleProceedOrder = () => {
    setOpenDrawerPayments(true);
  };

  return (
    <>
      <Payments open={openDrawerPayments} setOpen={setOpenDrawerPayments} />
      <ModalConfirmHoldOrder
        open={openModalConfirmHoldOrder}
        setOpen={setOpenModalConfirmHoldOrder}
      />
      <div className="flex flex-col justify-start h-full gap-y-2">
        {/* <div className="flex items-center justify-between">
          <TypographyP className="text-xs">
            <span>Order ref</span>
            <span className="text-muted-foreground">01-1423-26</span>
          </TypographyP>
        </div> */}

      

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Button size="icon">
              <PrinterIcon className="w-[1.2rem] h-auto fill-white" />
              <span className="sr-only">Print Addition</span>
            </Button>
            <Button size="icon" className="relative">
              <BillIcon className="w-[1.2rem] absolute h-[1.2rem] fill-white top-2 left-[0.6rem]" />
              <span className="sr-only">Print Facture</span>
            </Button> */}
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
              <Button onClick={handleAddCustomer} size="icon">
                <AddUserIcon className="w-[1.02rem] h-auto fill-white" />
                <span className="sr-only">add customer</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-y-2 overflow-y-hidden">
          <div className="flex-border flex-grow relative flex items-center justify-center pt-4 overflow-y-auto pr-2  h-full">
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
            <OrderLines />
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => setOpenModalConfirmHoldOrder(true)}
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
          <Button size="icon" disabled={isActionsDisabled}>
            <LucideMaximize size={16} />
            <span className="sr-only">Full screen</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default memo(OrderSummary);
