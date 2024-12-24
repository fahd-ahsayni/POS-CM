import { Dhs200 } from "@/assets/Dhs";
import Drawer from "@/components/global/Drawer";
import InputComponent from "@/components/global/InputField";
import Keyboard from "@/components/global/keyboard/Keyboard";
import { KeyboardProvider } from "@/components/global/keyboard/context/KeyboardContext";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { useState } from "react";

export default function CloseShift({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [cash, setCash] = useState<number>(0);

  const handleCloseShift = () => {
    console.log("Closing shift");
  };

  return (
    <KeyboardProvider>
      <Drawer
        open={open}
        setOpen={setOpen}
        title="End Shift"
        classNames="max-w-2xl"
      >
        <div className="flex flex-col gap-4 h-full px-4 sm:px-6">
          <div className="flex-1 h-full">
            <TypographyP className="text-sm pb-4 max-w-md">
              Count your cash and enter totals for each denomination, then
              continue to add other payment methods.
            </TypographyP>
            <InputComponent
              type="number"
              label="Cash total amount (Dhs)"
              placeholder="Enter cash total amount"
            />
          </div>
          <div className="flex flex-flex h-full bg-red-500 gap-2 w-full">
            <div className="flex flex-col gap-2 w-full">
              {/* <img src={Dhs200} alt="" /> */}
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Button className="w-full" onClick={handleCloseShift}>
              End Shift
            </Button>
          </div>
        </div>
        <Keyboard />
      </Drawer>
    </KeyboardProvider>
  );
}
