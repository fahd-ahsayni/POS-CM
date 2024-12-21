import Drawer from "@/components/global/Drawer";
import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import { TypographyH2 } from "@/components/ui/typography";
import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/shift/open`,
        {
          starting_balance: amount,
          pos_id: posId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to open shift");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} setOpen={setOpen} title="Open Shift">
      <section className="overflow-hidden h-full flex flex-col items-center gap-8 relative">
        <div className="flex-1 pt-12 flex items-center justify-center flex-col space-y-8">
          <TypographyH2>{amount || "0"} Dhs</TypographyH2>
          <div>
            <NumberPad
              onNumberClick={handleNumberClick}
              numbers={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6 w-full">
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
