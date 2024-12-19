import { Button } from "@/components/ui/button";
import { TypographySmall } from "@/components/ui/typography";
import { LucidePlus, Trash, User } from "lucide-react";
import { useEffect } from "react";
import { useRightViewContext } from "../contexts/rightViewContext";
import OrderLine from "./OrderLine";

export default function OrderLineIndex({
  customerIndex,
  products = [],
  incrementQuantity,
  decrementQuantity,
  deleteCustomer,
}: {
  customerIndex: number;
  products: any[];
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  deleteCustomer: (customerIndex: number) => void;
}) {
  const { selectedCustomer, setSelectedCustomer } = useRightViewContext();

  useEffect(() => {
    console.log("selectedCustomer", selectedCustomer);
  }, [selectedCustomer]);

  return (
    <>
      <div
        onClick={() => {
          setSelectedCustomer(customerIndex);
        }}
        className="flex items-center justify-between w-full pl-3 pr-1.5 rounded-md mb-2.5"
      >
        <Button
          size="icon"
          variant="link"
          onClick={() => deleteCustomer(customerIndex)}
        >
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
        <div className="flex items-center justify-between gap-x-2 flex-1 bg-zinc-800 rounded-md px-2 py-1">
          <div className="flex items-center gap-x-2">
            <User className="w-4 h-4" />
            <TypographySmall className="text-sm">
              Customer {customerIndex}
            </TypographySmall>
          </div>
          <div>
            <Button size="icon" variant="ghost">
              <LucidePlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
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
    </>
  );
}
