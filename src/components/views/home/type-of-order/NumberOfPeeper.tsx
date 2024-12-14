import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setOrderType } from "@/store/slices/pages/orderSlice";
import { TypographyH1, TypographyH3 } from "@/components/ui/typography";
import NumberPad from "@/components/global/NumberPad";

export default function NumberOfPeeper() {
  const [peopleCount, setPeopleCount] = useState("");
  const dispatch = useDispatch();

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
    <div className="flex flex-col justify-evenly h-full">
      <TypographyH3 className="font-medium max-w-xs">
        Enter the beeper number to start the order:
      </TypographyH3>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center">
          <TypographyH1 className="text-center font-medium tracking-wider">
            {peopleCount || "0"}
          </TypographyH1>
        </div>
        <NumberPad onNumberClick={handleNumberClick} />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 bg-gray-200 hover:bg-gray-300/70 dark:bg-zinc-800"
          onClick={() => dispatch(setOrderType(null))}
        >
          Cancel
        </Button>
        <Button className="flex-1">Confirm</Button>
      </div>
    </div>
  );
}
