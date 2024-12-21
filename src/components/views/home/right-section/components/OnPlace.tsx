import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographySmall,
} from "@/components/ui/typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ORDER_SUMMARY_VIEW, TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/rightViewContext";
import { updateOrder } from "@/functions/updateOrder";
import { useDispatch } from "react-redux";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function OnPlace() {
  const [tableNumber, setTableNumber] = useState("");
  const [takenTable, setTakenTable] = useState<boolean>(false);
  const { setViews } = useRightViewContext();
  const dispatch = useDispatch();
  const data = JSON.parse(localStorage.getItem("generalData") || "{}")[
    "floors"
  ];

  useEffect(() => {
    setTakenTable(false);
  }, [tableNumber]);

  console.log("tableNumber", tableNumber);

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setTableNumber("");
    } else if (value === "delete") {
      setTableNumber((prev) => prev.slice(0, -1));
    } else {
      setTableNumber((prev) => {
        const newValue = prev + value;
        if (parseInt(newValue) <= 999999) {
          return newValue;
        }
        return prev;
      });
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
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/order/by-table-name/${number}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(response.status);
    console.log(findTableByName(number));

    if (response.status === 204) {
      setViews(ORDER_SUMMARY_VIEW);
      dispatch(updateOrder({ table_id: findTableByName(number)?._id }));
      setTakenTable(false);
    } else if (response.status === 200) {
      setTakenTable(true);
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
            <TypographyH1 className={cn(takenTable && "text-red-500", "font-medium tracking-wider")}>
              {tableNumber || "0"}
            </TypographyH1>
            <TypographySmall className="text-red-500 text-sm text-center">
              {takenTable && "Table is already taken"}
              <span className="opacity-0">s</span>
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
            disabled={takenTable}
          >
            Confirm
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
