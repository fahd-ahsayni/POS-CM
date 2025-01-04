import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { useState } from "react";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";

export default function CoasterCall() {
  const [peopleCount, setPeopleCount] = useState("");
  const { setViews } = useRightViewContext();

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setPeopleCount("");
    } else if (value === "delete") {
      setPeopleCount((prev) => prev.slice(0, -1));
    } else {
      setPeopleCount((prev) => {
        const newValue = prev + value;
        if (parseInt(newValue) <= 999999) {
          return newValue;
        }
        return prev;
      });
    }
  };

  return (
    <div className="flex flex-col justify-start h-full">
      <TypographyH3 className="font-medium max-w-xs">
        Enter the beeper number to start the order:
      </TypographyH3>
      <div className="flex flex-col justify-center -mt-20 h-full relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="flex flex-col justify-center items-center"
        >
          <>
            <TypographyH1 className="text-center font-medium tracking-wider mb-6">
              {peopleCount || "0"}
            </TypographyH1>

            <NumberPad onNumberClick={handleNumberClick} />
          </>
        </motion.div>
        <div className="flex gap-x-4 absolute bottom-0 pb-6 w-full">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => setViews(TYPE_OF_ORDER_VIEW)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => setViews(ORDER_SUMMARY_VIEW)}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
