import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { ChevronDown, LucidePlus, Trash, User } from "lucide-react";
import { useEffect } from "react";
import { useRightViewContext } from "../contexts/rightViewContext";
import OrderLine from "./OrderLine";

export default function OrderLineIndex({
  customerIndex,
  products = [],
  incrementQuantity,
  decrementQuantity,
  deleteCustomer,
  isExpanded,
  onToggle,
}: {
  customerIndex: number;
  products: any[];
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  deleteCustomer: (customerIndex: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const rightViewContext = useRightViewContext();
  if (!rightViewContext) return null;

  const { selectedCustomer, setSelectedCustomer } = rightViewContext;

  // Calculate summary data
  const totalItems = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const totalPrice = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  useEffect(() => {
    console.log("selectedCustomer", selectedCustomer);
  }, [selectedCustomer]);

  return (
    <>
      <div
        onClick={() => {
          setSelectedCustomer(customerIndex);
        }}
        className="flex items-center justify-between w-full mb-2.5"
      >
        <Button
          size="icon"
          variant="link"
          onClick={(e) => {
            e.stopPropagation();
            deleteCustomer(customerIndex);
          }}
        >
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
        <div className="flex items-center justify-between gap-x-2 flex-1 bg-secondary-white dark:bg-secondary-black rounded-md px-2">
          <div className="flex items-center gap-x-2">
            <User className="w-4 h-4" />
            <TypographySmall className="text-sm">
              Customer {customerIndex}
            </TypographySmall>
          </div>

          <div className="flex items-center gap-x-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
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
        <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
          <span>{totalItems} items</span>
          <span>{totalPrice} Dhs</span>
        </div>
      )}
      {isExpanded && (
        <div className="flex flex-col gap-2">
          {products.length > 0 &&
            products.map((product) => (
              <OrderLine
                key={product.id}
                item={product}
                increment={() => incrementQuantity(product.id)}
                decrement={() => decrementQuantity(product.id)}
              />
            ))}
        </div>
      )}
    </>
  );
}
