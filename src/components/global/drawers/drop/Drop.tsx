import { useState } from "react";
import { currency } from "@/preferences";
import Drawer from "../../Drawer";
import InputComponent from "../../InputField";
import InputLikeTextarea from "../../InputLikeTextarea";
import { Button } from "@/components/ui/button";
import { dropCash } from "@/api/services";
import { toast } from "react-toastify";
import { createToast } from "../../Toasters";

export default function Drop({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  const handleAmountChange = (value: string | number | null) => {
    setAmount(value?.toString() || "");
  };

  const handleSubmit = async () => {
    if (!amount) {
      toast.warning(
        createToast(
          "Fields required",
          "Please fill in all required fields",
          "warning"
        )
      );
      return;
    }
    const data = {
      amount: parseFloat(amount),
      comment: comment,
      shift_id: localStorage.getItem("shiftId"),
    };
    await dropCash(data);
    toast.success(
      createToast(
        "Cash Drop registered",
        "Cash Drop registered successfully",
        "success"
      )
    );
    setOpen(false);
  };

  return (
    <Drawer open={open} setOpen={setOpen} title="Register a Cash Drop">
      <div className="flex flex-col gap-4 h-full relative">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col gap-y-6 px-4">
            <InputComponent
              config={{
                label: "Total amount",
                type: "number",
                placeholder: "Enter the cash amount to drop",
                setValue: handleAmountChange,
                value: amount,
                suffix: currency.currency,
              }}
            />
            <InputLikeTextarea
              label="comment"
              placeholder="Add a description or reason for the drop"
              setValue={setComment}
              value={comment}
            />
          </div>
          <div className="w-full absolute bottom-0 px-4">
            <Button className="w-full" onClick={handleSubmit}>
              Submit Cash Drop
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
