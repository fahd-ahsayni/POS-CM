import { UserIcon } from "@/assets/figma-icons";
import { TypographySmall } from "@/components/ui/typography";
import { useEffect, useMemo } from "react";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useOrderLines } from "../contexts/OrderLinesContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useProductQuantity } from "../hooks/useProductQuantity";
import { useCustomerManagement } from "../hooks/useCustomerManagement";
import OrderLineIndex from "./OrderLineIndex";
import { getMaxCustomerIndex } from "@/functions/getMaxCustomerIndex";
import { AnimatePresence } from "framer-motion";

export default function OrderLines() {
  const { selectedProducts } = useLeftViewContext();
  const { customerIndex } = useRightViewContext();
  const { expandedCustomers, toggleCustomer, initializeCustomer } =
    useOrderLines();
  const { incrementQuantity, decrementQuantity } = useProductQuantity();
  const { deleteCustomer } = useCustomerManagement();

  // Group products by customer index
  const groupedProducts = useMemo(
    () =>
      selectedProducts.reduce((acc, product) => {
        const index = product.customer_index || 1;
        if (!acc[index]) {
          acc[index] = [];
        }
        acc[index].push(product);
        return acc;
      }, {} as Record<number, any[]>),
    [selectedProducts]
  );

  useEffect(() => {
    initializeCustomer(customerIndex);
  }, [customerIndex, initializeCustomer]);

  if (selectedProducts.length < 1) {
    return (
      <div className="flex items-start justify-center w-full rounded-md mb-2.5">
        <div className="flex items-center justify-center gap-x-2 flex-1 bg-white dark:bg-secondary-black rounded px-2 py-2 shadow w-full">
          <div className="flex items-center justify-center gap-x-2">
            <UserIcon className="w-4 h-auto fill-primary-black dark:fill-white" />
            <TypographySmall className="text-sm">
              Customer {customerIndex}
            </TypographySmall>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="z-10 h-full w-full overflow-x-hidden">
        <div className="space-y-4 w-full pr-2 pt-1">
          {Array.from({
            length: Math.max(
              customerIndex,
              getMaxCustomerIndex(selectedProducts)
            ),
          }).map((_, index) => (
            <div key={`customer-${index + 1}`}>
              <OrderLineIndex
                customerIndex={index + 1}
                products={groupedProducts[index + 1] || []}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
                deleteCustomer={deleteCustomer}
                isExpanded={expandedCustomers[index + 1]}
                onToggle={() => toggleCustomer(index + 1)}
              />
            </div>
          ))}
        </div>
      </div>
    </AnimatePresence>
  );
}
