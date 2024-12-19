import { Card } from "@/components/ui/card";
import { TypographyH3, TypographyH4 } from "@/components/ui/typography";
import { OrderType } from "@/types";
import { motion } from "framer-motion";
import { ChevronRightIcon, LucideAirplay } from "lucide-react";
import { useEffect, useState } from "react";
import { useRightViewContext } from "../contexts/rightViewContext";

export default function SelectTypeOfOrder() {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const { setViews, setOrderType } = useRightViewContext();

  useEffect(() => {
    const storedGeneralData = localStorage.getItem("generalData");
    if (storedGeneralData) {
      const parsedData = JSON.parse(storedGeneralData);
      const sortedOrderTypes = parsedData.orderTypes.sort(
        (a: OrderType, b: OrderType) => a.sequence - b.sequence
      );

      console.log("Order Types After Sorting:", sortedOrderTypes);
      setOrderTypes(sortedOrderTypes);
    }
  }, []);

  const handleOrderTypeSelect = (id: string, type: string) => {
    setOrderType(id);
    setViews(type);
  };

  return (
    <div className="h-full flex flex-col justify-start">
      <TypographyH3 className="font-medium max-w-xs">
        What type of order would you like to process?
      </TypographyH3>
      <div className="flex flex-col h-[60%] justify-center gap-4 mt-10">
        {orderTypes.map((type, index) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.1 }}
            key={type._id}
          >
            <Card
              className="w-full rounded-md h-24 px-8 py-4 dark:!bg-zinc-800 bg-white flex space-x-4 items-center justify-between cursor-pointer hover:bg-accent"
              onClick={() => handleOrderTypeSelect(type._id, type.type)}
            >
              <div className="flex items-center gap-x-4">
                <LucideAirplay className="w-6 h-auto text-primary" />
                <div>
                  <TypographyH4 className="font-medium first-letter:capitalize">
                    {type.type}
                  </TypographyH4>
                </div>
              </div>
              <ChevronRightIcon className="w-6 h-auto text-gray-200" />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
