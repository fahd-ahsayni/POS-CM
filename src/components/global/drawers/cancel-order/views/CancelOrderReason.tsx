import { cancelOrder } from "@/api/services";
import ComboboxSelect from "@/components/global/ComboboxSelect";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { CheckIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useOrder } from "../../order-details/context/OrderContext";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";

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

    const response = await cancelOrder({
      order_id: selectedOrder._id,
      reason: selectedReason,
      confirmed_by: admin.user.id,
    });

    if (response.status === 200) {
      toast.success(
        createToast("Order canceled", "Order canceled successfully", "success")
      );
      setOpen(false);
      setAuthorization(false);
    } else {
      toast.error(
        createToast(
          "Error canceling order",
          "An unexpected error occurred while trying to cancel the order",
          "error"
        )
      );
    }
  }, [selectedOrder?._id, selectedReason, admin.user.id, setOpen]);

  return (
    <section className="overflow-hidden h-full flex flex-col items-start gap-8 relative w-full">
      <TypographyP className="text-sm pt-10 text-start px-2">
        Select a reason to cancel this order.
      </TypographyP>
      <div className="flex-1 pt-4 flex items-center justify-start flex-col space-y-8 w-full px-2">
        <ComboboxSelect
          label="Select a reason"
          items={reasons}
          value={reasons.find((r) => r.value === selectedReason) || null}
          onChange={(item) => handleReasonSelect(item?.value || "")}
          displayValue={(item) => item?.label || ""}
          placeholder="Reason for cancellation"
          filterFunction={(query, item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
          }
          renderOption={(item, _, selected) => (
            <div className="flex items-center justify-between">
              <span>{item.label}</span>
              {selected && <CheckIcon className="h-4 w-4 text-primary-red" />}
            </div>
          )}
        />
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
