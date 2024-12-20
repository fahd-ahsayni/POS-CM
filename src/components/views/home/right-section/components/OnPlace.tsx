import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
} from "@/components/ui/typography";
import { motion } from "framer-motion";
import { useState } from "react";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/rightViewContext";

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
            <TypographyH2>{tableCount || "0"}</TypographyH2>
          </div>
          <NumberPad onNumberClick={handleNumberClick} />
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="secondary"
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
