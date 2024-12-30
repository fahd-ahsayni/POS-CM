import { UserIcon } from "@/assets/figma-icons";
import { TypographySmall } from "@/components/ui/typography";
import { useEffect, useMemo } from "react";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import { useOrderLines } from "../contexts/orderLinesContext";
import { useRightViewContext } from "../contexts/rightViewContext";
import { useProductQuantity } from "../hooks/useProductQuantity";
import { useCustomerManagement } from "../hooks/useCustomerManagement";
import OrderLineIndex from "./OrderLineIndex";

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
      <div className="flex items-center justify-between w-full rounded-md mb-2.5">
        <div className="flex items-center justify-center gap-x-2 flex-1 bg-white dark:bg-secondary-black rounded px-2 py-2 shadow w-full -mr-2">
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
    <div className="z-10 h-full w-full">
      <div className="space-y-4 w-full">
        {Array.from({ length: customerIndex }).map((_, index) => (
          <div key={index}>
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
  );
}
