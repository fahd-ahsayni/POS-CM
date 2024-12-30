import { Separator } from "@/components/ui/separator";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export default function Ticket() {
  const order = useSelector((state: any) => state.order);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      exit={{ opacity: 0, y: 100 }}
      className="w-full px-4"
    >
      <div className="w-full rounded-lg dark:bg-white bg-primary-black pt-2">
        <div className="p-4 space-y-1">
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm font-semibold dark:text-primary-black text-white">
              Subtotal
            </TypographyP>
            <TypographyP className="text-sm font-semibold dark:text-primary-black text-white">
              204.55 MAD
            </TypographyP>
          </div>
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm dark:text-primary-black text-white">
              Discount sales
            </TypographyP>
            <TypographyP className="text-sm dark:text-primary-black text-white">
              0.00 MAD
            </TypographyP>
          </div>
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm dark:text-primary-black text-white">
              Total sales tax
            </TypographyP>
            <TypographyP className="text-sm dark:text-primary-black text-white  ">
              20.00 MAD
            </TypographyP>
          </div>
        </div>
        <div className="w-full h-[1px] border-t border-dashed border-neutral-dark-grey" />
        <div className="flex items-center justify-between w-full px-4 py-4">
          <TypographyH4 className="dark:text-primary-black text-white">
            Total
          </TypographyH4>
          <TypographyH4 className="dark:text-primary-black text-white">
            225.00 MAD
          </TypographyH4>
        </div>
      </div>
    </motion.div>
  );
}
