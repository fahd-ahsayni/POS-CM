import { getGeneralData, openShift, updateShift } from "@/api/services";
import { useShift } from "@/auth/context/ShiftContext";
import Drawer from "@/components/global/drawers/layout/Drawer";
import NumberPad from "@/components/global/NumberPad";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography";
import { currency, loadingColors } from "@/preferences";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { TYPE_OF_ORDER_VIEW } from "@/components/views/home/right-section/constants";

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
  const { setViews } = useRightViewContext();
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
    setIsLoading(true);
    let currentShiftId = "";

    try {
      if (reOpen && shiftId) {
        await updateShift({ starting_balance: amount ? amount : "0" }, shiftId);
        currentShiftId = shiftId;
        toast.success(
          createToast(
            "Shift updated",
            "Starting balance has been updated",
            "success"
          )
        );
      } else {
        const res = await openShift(amount ? amount : "0", posId);
        if (res.status === 200 && posId) {
          currentShiftId = res.data.shift._id;
          setShiftId(currentShiftId);
          localStorage.setItem("shiftId", currentShiftId);

          const response = await getGeneralData(posId);
          localStorage.setItem("generalData", JSON.stringify(response.data));

          toast.success(
            createToast(
              "New shift started",
              "You can now start selling",
              "success"
            )
          );
        }
      }

      setOpen(false);
      // Set the initial view before navigation
      setViews(TYPE_OF_ORDER_VIEW);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error during shift opening:", error);
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
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
