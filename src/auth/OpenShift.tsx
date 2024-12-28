import { openShift } from "@/api/services";
import Drawer from "@/components/global/Drawer";
import NumberPad from "@/components/global/NumberPad";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography";
import { currency } from "@/preferences";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface OpenShiftProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  posId: string;
}

export default function OpenShift({ open, setOpen, posId }: OpenShiftProps) {
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
    if (!amount) return;

    try {
      setIsLoading(true);
      await openShift(amount, posId);
      toast.success(
        createToast("Shift opened", "You can now start selling", "success")
      );
      navigate("/");

      setOpen(false);
    } catch (error) {
      toast.error(
        createToast("Failed to open shift", "Please try again", "error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} setOpen={setOpen} title="Open Shift">
      <section className="overflow-hidden h-full flex flex-col items-center gap-8 relative">
        <div className="flex-1 pt-12 flex items-center justify-center flex-col space-y-8">
          <TypographyH2 className="font-medium">{amount || "0"} {currency.currency}</TypographyH2>
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
            {isLoading ? "Opening..." : "Open Session"}
          </Button>
        </div>
      </section>
    </Drawer>
  );
}
