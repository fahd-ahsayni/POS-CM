import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { BsSuitcase } from "react-icons/bs";
import OderLineAddComments from "../ui/OderLineAddComments";
import { DishIcon } from "@/assets/figma-icons";
import { suite } from "node:test";
import OrderLineOtherActions from "../ui/OrderLineOtherActions";

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
  const [isSuitCamand, setIsSuitCamand] = useState(false);
  const [launched, setLaunched] = useState(false);

  const config = JSON.parse(localStorage.getItem("generalData") || "{}").configs[0];

  console.log(config);

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

  const handleSuitCamand = () => {
    console.log("suit camand");
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={itemVariants}
      key={item._id}
      className="flex items-center bg-white shadow-sm dark:bg-secondary-black rounded-md h-full relative overflow-hidden"
    >
      {isSuitCamand ? (
        launched ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="h-24 w-20 bg-[#6A7B9D] flex items-center justify-center"
          >
            <TypographyP className="text-center rotate-[-90deg] font-medium">
              Launched
            </TypographyP>
          </motion.div>
        ) : (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="h-24 w-20 bg-interactive-vivid-red dark:bg-interactive-dark-red flex items-center justify-center"
          >
            <TypographyP className="text-center rotate-[-90deg] font-medium">
              Launch
            </TypographyP>
          </motion.div>
        )
      ) : (
        <div className="h-24 w-1.5 bg-red-700 dark:bg-red-800 "></div>
      )}
      <div className="pr-4 pl-5 h-24 py-2 flex flex-col justify-between w-full relative">
        <div className="flex items-center justify-between gap-x-2 w-full">
          <TypographyP className="font-semibold text-sm">
            {item.variants[0].name}
          </TypographyP>
          {isSuitCamand ? (
            <div className="flex items-center">
              <TypographyP className="px-1.5 font-medium">
                {item.quantity}
              </TypographyP>
              <DishIcon className="!w-5 !h-auto !fill-secondary-black dark:!fill-secondary-white" />
            </div>
          ) : (
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
          )}
        </div>
        <div className="flex items-end justify-between w-full">
          <TypographyP className="text-[0.8rem] font-medium text-neutral-dark-grey">
            {item.price} Dhs
          </TypographyP>
          <div className="flex items-center gap-x-3">
            {config?.value !== "fastfood" && (
              <button onClick={() => setIsSuitCamand(!isSuitCamand)}>
                suite_command
              </button>
            )}
            <OrderLineOtherActions />
            <OderLineAddComments />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(OrderLine);
