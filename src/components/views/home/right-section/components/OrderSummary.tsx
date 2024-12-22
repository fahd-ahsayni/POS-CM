import { logoWithoutText } from "@/assets";
import { AddUserIcon, BillIcon, ExpandListIcon, PrinterIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { updateOrder } from "@/functions/updateOrder";
import { AnimatePresence, motion } from "framer-motion";
import { LucideMaximize } from "lucide-react";
import { useCallback, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import { useOrderLines } from "../contexts/orderLinesContext";
import { useRightViewContext } from "../contexts/rightViewContext";
import OrderLines from "../import/OrderLines";

export default function OrderSummary() {
  const { customerIndex, setCustomerIndex, setSelectedCustomer, tableNumber } =
    useRightViewContext();
  const dispatch = useDispatch();

  const { selectedProducts } = useLeftViewContext();
  const { expandedCustomers, toggleAllCustomers } = useOrderLines();

  useEffect(() => {
    dispatch(updateOrder({ customer_count: customerIndex }));
  }, [customerIndex, dispatch]);

  const handleAddCustomer = useCallback(() => {
    // Check if there are products for the current last customer
    const lastCustomerProducts = selectedProducts.filter(
      (product) => product.customer_index === customerIndex
    );

    if (selectedProducts.length > 0 && lastCustomerProducts.length > 0) {
      setCustomerIndex(customerIndex + 1);
      setSelectedCustomer(customerIndex + 1);
    }
  }, [selectedProducts, customerIndex]);

  useEffect(() => {
    console.log("selectedProducts", selectedProducts);
    console.log("customerIndex", customerIndex);
  }, [selectedProducts, customerIndex]);

  return (
    <div className="flex flex-col justify-start h-full gap-y-2">
      <div className="flex items-center justify-between">
        <div>
          <TypographyP className="text-xs">Table {tableNumber}</TypographyP>
        </div>
        <TypographyP className="text-xs">
          <span>Order ref</span>{" "}
          <span className="text-muted-foreground">01-1423-26</span>
        </TypographyP>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <Button size="icon">
            <PrinterIcon className="w-[1.2rem] h-auto fill-white" />
            <span className="sr-only">Print Addition</span>
          </Button>
          <Button size="icon" className="relative">
            <BillIcon className="w-[1.2rem] absolute h-[1.2rem] fill-white top-2 left-[0.6rem]" />
            <span className="sr-only">Print Facture</span>
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button size="icon">
              <BsThreeDotsVertical size={16} />
              <span className="sr-only">Full screen</span>
            </Button>
            <Button size="icon" onClick={toggleAllCustomers}>
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

      <div className="flex-1 flex flex-col gap-y-2 overflow-hidden">
        <div className="flex-border flex-grow relative flex items-center justify-center mt-4 overflow-y-auto overflow-x-hidden h-full">
          <AnimatePresence>
            {selectedProducts.length < 1 && (
              <motion.img
                src={logoWithoutText}
                alt="Order Sumary"
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
      <div className="flex items-center justify-between space-x-2">
        <Button
          className="flex-1"
          variant="secondary"
          disabled={selectedProducts.length === 0}
        >
          Hold Order
        </Button>
        <Button className="flex-1" disabled={selectedProducts.length === 0}>
          Proceed Order
        </Button>
        <Button size="icon" disabled={selectedProducts.length === 0}>
          <LucideMaximize size={16} />
          <span className="sr-only">Full screen</span>
        </Button>
      </div>
    </div>
  );
}
