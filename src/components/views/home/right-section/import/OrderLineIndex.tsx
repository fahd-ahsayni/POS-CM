import { CashIcon, DishIcon, TrashIcon, UserIcon } from "@/assets/figma-icons";
import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { ChevronDown } from "lucide-react";
import { memo, useMemo, useCallback } from "react";
import { useRightViewContext } from "../contexts/rightViewContext";
import OrderLine from "./OrderLine";
import { ProductSelected } from "@/types";

interface OrderLineIndexProps {
  customerIndex: number;
  products: ProductSelected[];
  incrementQuantity: (product: ProductSelected) => void;
  decrementQuantity: (product: ProductSelected) => void;
  deleteCustomer: (customerIndex: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const OrderLineIndex = ({
  customerIndex,
  products = [],
  incrementQuantity,
  decrementQuantity,
  deleteCustomer,
  isExpanded,
  onToggle,
}: OrderLineIndexProps) => {
  const { customerIndex: contextCustomerIndex, setCustomerIndex } =
    useRightViewContext();

  const totalItems = useMemo(
    () => products.reduce((sum, product) => sum + product.quantity, 0),
    [products]
  );

  const totalPrice = useMemo(
    () =>
      products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      ),
    [products]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      deleteCustomer(customerIndex);
    },
    [customerIndex, deleteCustomer]
  );

  const handleToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onToggle();
    },
    [onToggle]
  );

  const handleCustomerSelect = useCallback(() => {
    setCustomerIndex(customerIndex);
  }, [customerIndex, setCustomerIndex]);

  return (
    <>
      <div
        onClick={handleCustomerSelect}
        className="flex items-center justify-between w-full mb-2.5"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => e.key === "Enter" && handleCustomerSelect()}
      >
        <Button
          size="icon"
          variant="link"
          onClick={handleDelete}
          aria-label={`Delete customer ${customerIndex}`}
        >
          <TrashIcon className="w-5 h-5 fill-primary-red" />
        </Button>
        <div
          className={`flex items-center justify-between gap-x-2 flex-1 bg-white dark:bg-secondary-black rounded px-2 shadow
            ${
              customerIndex === contextCustomerIndex
                ? "ring-2 ring-primary-red"
                : ""
            }`}
        >
          <div className="flex items-center gap-x-2">
            <UserIcon className="w-4 h-auto fill-primary-black dark:fill-white" />
            <TypographySmall className="text-sm">
              Customer {customerIndex}
            </TypographySmall>
          </div>

          <div className="flex items-center gap-x-4">
            <Button size="icon" variant="ghost" onClick={handleToggle}>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isExpanded ? "" : "-rotate-90"
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {!isExpanded && products.length > 0 && (
        <div className="flex items-center justify-end text-xs gap-x-4 text-secondary-black dark:text-secondary-white">
          <span className="flex items-center gap-x-0.5">
            <DishIcon className="!w-5 !h-auto !fill-secondary-black dark:!fill-secondary-white" />
            {totalItems}
          </span>
          <span className="flex items-center gap-x-0.5">
            <CashIcon className="w-5 h-auto !fill-secondary-black dark:!fill-secondary-white" />
            {totalPrice} Dhs
          </span>
        </div>
      )}

      {isExpanded && (
        <div className="flex flex-col gap-2">
          {products.map((product: any) => (
            <OrderLine
              key={product.id}
              item={product}
              increment={() => incrementQuantity(product)}
              decrement={() => decrementQuantity(product)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default memo(OrderLineIndex);
