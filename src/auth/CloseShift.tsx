import Drawer from "@/components/global/Drawer";
import InputComponent from "@/components/global/InputField";
import Keyboard from "@/components/global/keyboard/Keyboard";
import { KeyboardProvider } from "@/components/global/keyboard/context/KeyboardContext";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { useState } from "react";
import SelectNextCashier from "./components/ui/SelectNextCashier";
import {
  Dhs1,
  Dhs10,
  Dhs100,
  Dhs2,
  Dhs20,
  Dhs200,
  Dhs5,
  Dhs50,
} from "@/assets/Dhs";
import { RiInputField } from "react-icons/ri";
import { User } from "@/types";

type Denomination = {
  image: string;
  value: number;
  placeholder: string;
};

const DENOMINATIONS: Denomination[] = [
  { image: Dhs200, value: 200, placeholder: "Quantity of 200 MAD" },
  { image: Dhs10, value: 10, placeholder: "Quantity of 10 MAD" },
  { image: Dhs100, value: 100, placeholder: "Quantity of 100 MAD" },
  { image: Dhs5, value: 5, placeholder: "Quantity of 5 MAD" },
  { image: Dhs50, value: 50, placeholder: "Quantity of 50 MAD" },
  { image: Dhs2, value: 2, placeholder: "Quantity of 2 MAD" },
  { image: Dhs20, value: 20, placeholder: "Quantity of 20 MAD" },
  { image: Dhs1, value: 1, placeholder: "Quantity of 1 MAD" },
];

export default function CloseShift({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [selectedCashier, setSelectedCashier] = useState<User | null>(null);
  const [cashAmounts, setCashAmounts] = useState<{ [key: number]: number }>({});
  const [cardAmount, setCardAmount] = useState<number>(0);
  const [chequeAmount, setChequeAmount] = useState<number>(0);

  const handleCloseShift = () => {
    // Calculate total cash amount
    const totalCash = Object.entries(cashAmounts).reduce(
      (sum, [denom, qty]) => {
        return sum + Number(denom) * Number(qty);
      },
      0
    );

    const data = {
      next_cashier: selectedCashier?._id,
      shift_id: "generated_shift_id", // You'll need to get this from your system
      closing_amounts: [
        {
          cm_payment_method: "especes",
          cashier_amount: totalCash,
        },
        {
          cm_payment_method: "cheque",
          cashier_amount: chequeAmount,
        },
        {
          cm_payment_method: "carte",
          cashier_amount: cardAmount,
        },
      ],
    };

    console.log(data);
  };

  return (
    <KeyboardProvider>
      <Drawer
        open={open}
        setOpen={setOpen}
        title="End Shift"
        classNames="max-w-2xl"
      >
        <div className="flex flex-col gap-8 h-full px-4 sm:px-6 pt-6">
          <div className="space-y-6">
            <TypographyP className="text-sm max-w-lg">
              Count your cash and enter totals for each denomination, then
              continue to add other payment methods.
            </TypographyP>

            <div className="flex gap-x-4 items-center">
              <SelectNextCashier
                selectedPerson={selectedCashier}
                setSelectedPerson={setSelectedCashier}
              />
              <InputComponent
                config={{
                  label: "Cash total amount",
                  suffix: "MAD",
                  type: "number",
                  placeholder: "Enter cash total amount",
                }}
                className="w-[380px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {DENOMINATIONS.map((denom, index) => (
              <div key={denom.value} className="flex gap-4 items-center">
                <img
                  src={denom.image}
                  alt={`${denom.value} MAD`}
                  className="h-10 w-auto"
                />
                <InputComponent
                  className="w-full"
                  config={{
                    type: "number",
                    placeholder: denom.placeholder,
                    value: cashAmounts[denom.value] || "",
                    setValue: (value) =>
                      setCashAmounts((prev) => ({
                        ...prev,
                        [denom.value]: Number(value),
                      })),
                  }}
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <InputComponent
              config={{
                label: "Credit/debit cards total amount",
                suffix: "MAD",
                type: "number",
                placeholder: "Enter total amount",
                value: cardAmount,
                setValue: (value) => setCardAmount(Number(value)),
              }}
              className="w-full"
            />
            <InputComponent
              config={{
                label: "Cheque total amount",
                suffix: "MAD",
                type: "number",
                placeholder: "Enter total amount",
                value: chequeAmount,
                setValue: (value) => setChequeAmount(Number(value)),
              }}
              className="w-full"
            />
          </div>

          <div className="mt-auto pb-4">
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
