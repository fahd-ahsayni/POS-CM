import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import { TypographyH1, TypographyH4 } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { CHANGE_TYPE_OF_ORDER_VIEW } from "../constants";
import { useNumberPad } from "../hooks/useNumberPad";

interface ChangeCoasterCallProps {
  setDrawerView: (view: string) => void;
  setOpen: (open: boolean) => void;
}

export default function ChangeCoasterCall({
  setDrawerView,
  setOpen,
}: ChangeCoasterCallProps) {
  const {
    number: beeperNumber,
    handleNumberClick,
  } = useNumberPad();

  const handleConfirm = () => {
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
            onClick={() => setDrawerView(CHANGE_TYPE_OF_ORDER_VIEW)}
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
