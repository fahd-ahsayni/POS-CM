import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH4,
  TypographySmall,
} from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNumberOfTable } from "../hooks/useNumberOfTable";

export default function NumberOfTable() {
  const {
    tableNumber,
    tableValid,
    handleNumberClick,
    handleConfirm,
    handleCancel,
    getValidationMessage,
  } = useNumberOfTable();

  return (
    <div className="h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
        className="flex flex-col justify-evenly -mt-6 h-full"
      >
        <TypographyH4 className="font-medium max-w-xs">
          Enter the table number to start the order:
        </TypographyH4>
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col space-y-2 justify-center items-center">
            <TypographyH1
              className={cn(
                "font-medium tracking-wider",
                tableValid === "invalid" && "text-warning-color",
                tableValid === "not-found" && "text-error-color"
              )}
            >
              {tableNumber || "0"}
            </TypographyH1>
            <TypographySmall
              className={cn(
                "text-sm text-center",
                tableValid === "invalid" && "text-warning-color",
                tableValid === "not-found" && "text-error-color"
              )}
            >
              {getValidationMessage()}
              <span className="opacity-0">?</span>
            </TypographySmall>
          </div>
          <NumberPad onNumberClick={handleNumberClick} />
        </div>
        <div className="flex gap-4">
          <Button className="flex-1" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirm(tableNumber)}
            className="flex-1"
            disabled={tableValid !== "valid"}
          >
            Confirm
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
