import { openShift, updateShift } from "@/api/services";
import { useShift } from "@/auth/context/ShiftContext";
import Drawer from "@/components/global/Drawer";
import NumberPad from "@/components/global/NumberPad";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography";
import { currency, loadingColors } from "@/preferences";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

interface OpenShiftProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  posId: string;
  reOpen?: boolean;
  shiftId?: string;
}

export default function OpenShift({
  open,
  setOpen,
  posId,
  reOpen,
  shiftId,
}: OpenShiftProps) {
  const { setShiftId } = useShift();
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNumberClick = useCallback((value: string) => {
    setAmount((prev) => {
      if (value === "C") return "";
      if (value === "delete") return prev.slice(0, -1);
      if (value === "0" && !prev) return prev;
      if (prev.length >= 6 && value !== "delete") return prev;
      return prev + value;
    });
  }, []);

  const handleOpenShift = async () => {
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) return;

    try {
      setIsLoading(true);
      if (!reOpen) {
        const res = await openShift(amountNumber.toString(), posId);
        if (res.status === 200) {
          setShiftId(res.data.shift._id);
          localStorage.setItem("shiftId", res.data.shift._id);
        }
      } else if (shiftId) {
        await updateShift(
          { starting_balance: amountNumber.toString() },
          shiftId
        );
      }
      toast.success(
        createToast("Shift opened", "You can now start selling", "success")
      );
      navigate("/");
    } catch (error) {
      toast.error(
        createToast("Failed to open shift", "Please try again", "error")
      );
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <Drawer open={open} setOpen={setOpen} title="Open Shift">
      <section className="overflow-hidden h-full flex flex-col items-center gap-8 relative">
        <div className="flex-1 pt-12 flex items-center justify-center flex-col space-y-8">
          <TypographyH2 className="font-medium">
            {amount || "0"} {currency.currency}
          </TypographyH2>
          <div>
            <NumberPad onNumberClick={handleNumberClick} fixLightDark />
          </div>
        </div>
        <div className="flex gap-4 mt-6 w-full px-8">
          <Button
            className="w-full"
            onClick={handleOpenShift}
            disabled={isLoading || !amount}
          >
            {isLoading ? (
              <BeatLoader color={loadingColors.primary} size={8} />
            ) : (
              "Open Session"
            )}
          </Button>
        </div>
      </section>
    </Drawer>
  );
}
