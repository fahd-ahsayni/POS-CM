import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setOrderType } from "@/store/slices/orderSlice";
import NumberButton from "@/auth/components/NumberButton";
import { TypographyH1, TypographyH2, TypographyH3 } from "@/components/ui/typography";

export default function NumberOfTabel() {
  const [tableCount, setTableCount] = useState("");
  const dispatch = useDispatch();

  const numbers = Array.from({ length: 9 }, (_, i) => i + 1);

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setTableCount("");
    } else if (value === "delete") {
      setTableCount((prev) => prev.slice(0, -1));
    } else {
      setTableCount((prev) => {
        const newValue = prev + value;
        if (parseInt(newValue) <= 99999) {
          return newValue;
        }
        return prev;
      });
    }
  };

  return (
    <div className="flex flex-col justify-evenly h-full">
      <TypographyH3 className="font-medium max-w-xs">Enter the table number to start the order:</TypographyH3>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center">
          <TypographyH1 className="text-center">
            {tableCount || "0"}
          </TypographyH1>
        </div>
        <div className="max-w-[13rem] grid grid-cols-3 grid-rows-4 gap-4">
          {numbers.map((number) => (
            <NumberButton
              key={number}
              onClick={() => handleNumberClick(number.toString())}
            >
              {number}
            </NumberButton>
          ))}
          <NumberButton onClick={() => handleNumberClick("C")}>C</NumberButton>
          <NumberButton onClick={() => handleNumberClick("0")}>0</NumberButton>
          <NumberButton onClick={() => handleNumberClick("delete")}>
            <Delete className="w-5 h-5" />
          </NumberButton>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 bg-gray-200 hover:bg-gray-300/70 dark:bg-zinc-800" onClick={() => dispatch(setOrderType(null))}>
          Cancel
        </Button>
        <Button className="flex-1">Confirm</Button>
      </div>
    </div>
  );
}
