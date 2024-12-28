import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH4 } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { useState } from "react";
import { TYPE_OF_ORDER_VIEW } from "../constants";

interface TakeAwayProps {
  setDrawerView: (view: string) => void;
  setOpen: (open: boolean) => void;
}

export default function ChangeTakeAway({
  setDrawerView,
  setOpen,
}: TakeAwayProps) {
  const [beeperNumber, setBeeperNumber] = useState("");

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setBeeperNumber("");
    } else if (value === "delete") {
      setBeeperNumber((prev) => prev.slice(0, -1));
    } else {
      setBeeperNumber((prev) => {
        const newValue = prev + value;
        return parseInt(newValue) <= 999999 ? newValue : prev;
      });
    }
  };

  const handleConfirm = () => {
    // Add any additional logic for beeper number validation if needed
    setOpen(false);
  };

  return (
    <div className="h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="flex flex-col justify-evenly h-full -mt-10"
      >
        <TypographyH4 className="font-medium max-w-xs">
          Enter the beeper number to change the order:
        </TypographyH4>
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex justify-center items-center">
            <TypographyH1 className="text-center font-medium tracking-wider">
              {beeperNumber || "0"}
            </TypographyH1>
          </div>
          <NumberPad onNumberClick={handleNumberClick} fixLightDark />
        </div>
        <div className="flex gap-4">
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => setDrawerView(TYPE_OF_ORDER_VIEW)}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            onClick={handleConfirm}
            disabled={!beeperNumber}
          >
            Confirm
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
