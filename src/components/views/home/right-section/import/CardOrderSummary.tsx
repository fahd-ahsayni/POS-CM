import { TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";

export default function CardOrderSummary({ item }: { item: any }) {
  return (
    <motion.div
      initial={{
        x: 50,
      }}
      animate={{
        x: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      key={item._id}
      className="flex min-h-24 items-center py-2 bg-white shadow-sm dark:bg-zinc-800 rounded-md h-full relative overflow-hidden"
    >
      <div className="h-full w-2 bg-red-700 absolute left-0" />
      <div className="pl-4 h-20 flex flex-col justify-between w-full re">
        <TypographyP className="font-medium">{item.name}</TypographyP>
        <TypographyP className=" text-lg font-medium">
          {item.price} Dhs
        </TypographyP>
      </div>
    </motion.div>
  );
}
