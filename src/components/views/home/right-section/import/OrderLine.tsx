import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { memo, useMemo } from "react";

interface OrderLineProps {
  item: {
    _id: string;
    variants: Array<{ name: string }>;
    quantity: number;
    price: number;
  };
  increment: () => void;
  decrement: () => void;
}

const OrderLine = ({ item, increment, decrement }: OrderLineProps) => {
  const itemVariants = useMemo(
    () => ({
      initial: { x: 50, opacity: 0 },
      animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.25, ease: "easeInOut" },
      },
    }),
    []
  );

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    increment();
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    decrement();
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={itemVariants}
      key={item._id}
      className="flex items-center py-3 bg-white shadow-sm dark:bg-secondary-black rounded-md h-full relative overflow-hidden"
    >
      <div className="h-full w-1.5 bg-red-700 dark:bg-red-800 absolute left-0" />
      <div className="pr-4 pl-5 h-16 flex flex-col justify-between w-full relative">
        <div className="flex items-center justify-between gap-x-2 w-full">
          <TypographyP className="font-semibold text-sm">
            {item.variants[0].name}
          </TypographyP>
          <div className="flex items-center gap-x-2">
            <Button
              slot="decrement"
              className="-ms-px h-6 w-6 rounded bg-accent-white/10 hover:bg-accent-white/20"
              size="icon"
              onClick={handleDecrement}
            >
              <Minus
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="text-primary-black dark:text-white"
              />
            </Button>
            <TypographyP className="px-1.5 font-medium">
              {item.quantity}
            </TypographyP>
            <Button
              slot="increment"
              className="-ms-px h-6 w-6 rounded bg-accent-white/10 hover:bg-accent-white/20"
              size="icon"
              onClick={handleIncrement}
            >
              <Plus
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="text-primary-black dark:text-white"
              />
            </Button>
          </div>
        </div>
        <TypographyP className="text-xs font-medium">
          {item.price} Dhs
        </TypographyP>
      </div>
    </motion.div>
  );
};

export default memo(OrderLine);
