import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

export default function OrderLine({
  item,
  increment,
  decrement,
}: {
  item: any;
  increment: () => void;
  decrement: () => void;
}) {
  console.log(item);
  return (
    <motion.div
      initial={{
        x: 50,
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.14,
        ease: "easeInOut",
      }}
      key={item._id}
      className="flex min-h-24 items-center py-2 bg-gray-50 shadow-sm dark:bg-zinc-900 rounded-md h-full relative overflow-hidden"
    >
      <div className="h-full w-1.5 bg-red-800 absolute left-0" />
      <div className="pr-4 pl-5 h-20 flex flex-col justify-between w-full relative">
        <div className="flex items-center justify-between gap-x-2 w-full">
          <TypographyP className="font-medium">
            {item.variants[0].name}
          </TypographyP>
          <div className="flex items-center gap-x-2">
            <Button
              slot="decrement"
              className="-ms-px h-7 w-7 bg-zinc-800"
              size="icon"
              onClick={decrement}
            >
              <Minus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <TypographyP className="px-1.5 font-medium">
              {item.quantity}
            </TypographyP>
            <Button
              slot="increment"
              className="-ms-px h-7 w-7 bg-zinc-800"
              size="icon"
              onClick={increment}
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <TypographyP className=" text-lg font-medium">
          {item.price} Dhs
        </TypographyP>
      </div>
    </motion.div>
  );
}
