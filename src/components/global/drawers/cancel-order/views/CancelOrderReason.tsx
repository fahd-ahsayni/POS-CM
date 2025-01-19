import { cancelOrder } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useOrder } from "../../order-details/context/OrderContext";

interface DefineNote {
  type: string;
  text: string;
}

interface CancelOrderReasonProps {
  admin: {
    user: {
      id: string;
    };
  };
  setOpen: (open: boolean) => void;
  setAuthorization: (authorization: boolean) => void;
}

export default function CancelOrderReason({
  admin,
  setOpen,
  setAuthorization,
}: CancelOrderReasonProps) {
  const { selectedOrder } = useOrder();
  const [selectedReason, setSelectedReason] = useState<string>("");

  const generalData = useMemo(() => {
    return JSON.parse(localStorage.getItem("generalData") || "{}");
  }, []);

  const reasons = useMemo(() => {
    const reasonsData: DefineNote[] =
      generalData.defineNote?.filter(
        (item: DefineNote) => item.type === "cancel"
      ) || [];
    return reasonsData.map((reason) => ({
      value: reason.text,
      label: reason.text,
    }));
  }, [generalData]);

  const handleReasonSelect = useCallback((value: string) => {
    setSelectedReason(value);
  }, []);

  const handleApplyCancel = useCallback(async () => {
    if (!selectedOrder?._id) return;

    try {
      const response = await cancelOrder({
        order_id: selectedOrder._id,
        reason: selectedReason,
        confirmed_by: admin.user.id,
      });

      if (response.status === 200) {
        toast.success(
          createToast(
            "Order canceled",
            "Order canceled successfully",
            "success"
          )
        );
        setOpen(false);
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      toast.error(
        createToast("Cancel Order failed", "Please try again", "error")
      );
      setAuthorization(false);
    }
  }, [
    selectedOrder?._id,
    selectedReason,
    admin.user.id,
    setOpen,
    setAuthorization,
  ]);

  return (
    <section className="overflow-hidden h-full flex flex-col items-start gap-8 relative w-full">
      <div className="flex-1 flex items-center justify-start flex-col space-y-8 w-full px-2">
        <Select value={selectedReason} onValueChange={handleReasonSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Reason for cancellation" />
          </SelectTrigger>
          <SelectContent>
            {reasons.map((reason) => (
              <SelectItem key={reason.value} value={reason.value}>
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center gap-4 w-full px-4">
        <Button
          onClick={handleApplyCancel}
          className="w-full"
          disabled={!selectedReason}
        >
          Cancel Order
        </Button>
      </div>
    </section>
  );
}
