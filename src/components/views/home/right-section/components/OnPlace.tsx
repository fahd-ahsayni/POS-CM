import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import NumberPad from "@/components/global/NumberPad";
import { motion } from "framer-motion";
import { useRightViewContext } from "../contexts/rightViewContext";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";

export default function OnPlace() {
  const [tableCount, setTableCount] = useState("");
  const { setViews } = useRightViewContext();

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setTableCount("");
    } else if (value === "delete") {
      setTableCount((prev) => prev.slice(0, -1));
    } else {
      setTableCount((prev) => {
        const newValue = prev + value;
        if (parseInt(newValue) <= 999999) {
          return newValue;
        }
        return prev;
      });
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="flex flex-col justify-evenly h-full"
      >
        <TypographyH3 className="font-medium max-w-xs">
          Enter the table number to start the order:
        </TypographyH3>
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center">
            <TypographyH1 className="text-center font-medium tracking-wider">
              {tableCount || "0"}
            </TypographyH1>
          </div>
          <NumberPad onNumberClick={handleNumberClick} />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 bg-gray-200 hover:bg-gray-300/70 dark:bg-zinc-800"
            onClick={() => setViews(TYPE_OF_ORDER_VIEW)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => setViews(ORDER_SUMMARY_VIEW)}
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
