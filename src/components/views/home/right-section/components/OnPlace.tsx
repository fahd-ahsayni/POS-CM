import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographySmall,
} from "@/components/ui/typography";
import { updateOrder } from "@/functions/updateOrder";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/rightViewContext";
import { getByTableName } from "@/api/services";

export default function OnPlace() {
  const { tableNumber, setTableNumber } = useRightViewContext();
  const [tableValid, setTableValid] = useState<string>("valid");
  const { setViews } = useRightViewContext();
  const dispatch = useDispatch();
  const data = JSON.parse(localStorage.getItem("generalData") || "{}")[
    "floors"
  ];

  useEffect(() => {
    setTableValid("valid");
  }, [tableNumber]);

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setTableNumber("");
    } else if (value === "delete") {
      setTableNumber(tableNumber.slice(0, -1));
    } else {
      const newValue = tableNumber + value;
      setTableNumber(parseInt(newValue) <= 999999 ? newValue : tableNumber);
    }
  };

  function findTableByName(tableName: string) {
    return Object.values(data)
      .map((floor: any) =>
        floor.table_ids?.filter((table: any) => table.name === tableName)
      )
      .flat()
      .find((table: any) => table);
  }

  const handleConfirm = async (number: string) => {
    try {
      const response = await getByTableName(number);

      if (response.status === 204) {
        setViews(ORDER_SUMMARY_VIEW);
        dispatch(updateOrder({ table_id: findTableByName(number)?._id }));
        setTableValid("valid");
        setTableNumber(number);
        toast.success("Table is taken");
      } else if (response.status === 200) {
        setTableValid("invalid");
        toast.error("Table is already taken");
      }
    } catch (error) {
      setTableValid("not-found");
      toast.error("Table not found");
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
          <div className="flex flex-col space-y-2 justify-center items-center">
            <TypographyH2
              className={cn(
                tableValid === "invalid" && "text-primary-red",
                tableValid === "not-found" && "text-yellow-500",
                "font-medium tracking-wider"
              )}
            >
              {tableNumber || "0"}
            </TypographyH2>
            <TypographySmall
              className={cn(
                tableValid === "invalid" && "text-primary-red",
                tableValid === "not-found" && "text-yellow-500",
                "text-sm text-center"
              )}
            >
              {tableValid === "invalid" && "Table is already taken"}
              {tableValid === "not-found" && "Table not found"}
              <span className="opacity-0">?</span>
            </TypographySmall>
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
