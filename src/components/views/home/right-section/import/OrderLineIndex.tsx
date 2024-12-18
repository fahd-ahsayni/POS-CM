import {
  TypographyH2,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import OrderLine from "./OrderLine";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LucidePlus, User } from "lucide-react";

export default function OrderLineIndex({
  customerIndex,
  products = [],
  incrementQuantity,
  decrementQuantity,
}: {
  customerIndex: number;
  products: any[];
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between w-full bg-zinc-800 pl-3 pr-1.5 rounded-md">
        <div className="flex items-center gap-x-2 bg-zinc-800">
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
      <div className="flex flex-col gap-2">
        {products.length > 0 &&
          products.map((product) => (
            <OrderLine
              key={product._id}
              item={product}
              increment={() => incrementQuantity(product._id)}
              decrement={() => decrementQuantity(product._id)}
            />
          ))}
      </div>
    </>
  );
}
