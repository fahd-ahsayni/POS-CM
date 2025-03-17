import { UserIcon } from "@/assets/figma-icons";
import { TypographySmall } from "@/components/ui/typography";
import { useEffect, useMemo, useRef, memo } from "react";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useOrderLines } from "../contexts/OrderLinesContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useProductQuantity } from "../hooks/useProductQuantity";
import { useCustomerManagement } from "../hooks/useCustomerManagement";
import OrderLineIndex from "./OrderLineIndex";
import { getMaxCustomerIndex } from "@/functions/getMaxCustomerIndex";
import { AnimatePresence } from "motion/react";

const OrderLines = memo(function OrderLines() {
  const { selectedProducts } = useLeftViewContext();
  const { customerIndex } = useRightViewContext();
  const { expandedCustomers, toggleCustomer, initializeCustomer } =
    useOrderLines();
  const { incrementQuantity, decrementQuantity } = useProductQuantity();
  const { deleteCustomer } = useCustomerManagement();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastItemRef = useRef<HTMLDivElement>(null);
  const prevProductsCountRef = useRef<number>(0);

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

  // Scroll to the last item when new products are added
  useEffect(() => {
    const currentProductsCount = selectedProducts.length;

    if (
      currentProductsCount > prevProductsCountRef.current &&
      lastItemRef.current
    ) {
      lastItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }

    prevProductsCountRef.current = currentProductsCount;
  }, [selectedProducts]);

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
      <div
        ref={containerRef}
        className="z-10 h-full w-full overflow-y-auto overflow-x-hidden pr-2"
      >
        <div className="space-y-4 w-full px-1 pt-1">
          {Array.from({
            length: Math.max(
              customerIndex,
              getMaxCustomerIndex(selectedProducts)
            ),
          }).map((_, index) => {
            const isLastItem =
              index ===
              Math.max(
                customerIndex - 1,
                getMaxCustomerIndex(selectedProducts) - 1
              );

            return (
              <div
                key={`customer-${index + 1}`}
                ref={isLastItem ? lastItemRef : undefined}
              >
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
            );
          })}
        </div>
      </div>
    </AnimatePresence>
  );
});

export default OrderLines;
