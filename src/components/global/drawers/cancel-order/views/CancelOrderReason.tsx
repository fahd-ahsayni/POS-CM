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
import { useLocalStorage } from "@/hooks/use-local-storage";
import { refreshOrders } from "@/store/slices/data/orders.slice";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useOrder } from "../../order-details/context/OrderContext";
import { Label } from "@/components/ui/label";
import { Input as NumberFlowInput } from "@/components/ui/number-flow-input";

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
  const { selectedOrder, setOpenOrderDetails } = useOrder();
  const dispatch = useDispatch();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [persistSelectedProducts] = useLocalStorage<string[]>(
    "selectedProducts",
    []
  );
  const [quantity, setQuantity] = useState<number>(1); // new state for quantity

  const generalData = useMemo(() => {
    return JSON.parse(localStorage.getItem("generalData") || "{}");
  }, []);

  const reasons = useMemo(() => {
    const reasonsData: DefineNote[] =
      generalData.defineNote?.filter(
        (item: DefineNote) => item.type === "cancel"
      ) || [];
    // Filter out duplicates based on text property
    const uniqueReasons = reasonsData.reduce((acc: DefineNote[], current) => {
      const isDuplicate = acc.find((item) => item.text === current.text);
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, []);
    return uniqueReasons.map((reason, index) => ({
      value: reason.text,
      label: reason.text,
      key: `${reason.text}-${index}`,
    }));
  }, [generalData]);

  const handleReasonSelect = useCallback((value: string) => {
    setSelectedReason(value);
  }, []);

  const handleApplyCancel = useCallback(async () => {
    if (!selectedOrder?._id) return;

    try {
      let response;
      if (persistSelectedProducts.length > 0) {
        response = await cancelOrder({
          orderline_id: persistSelectedProducts[0],
          order_id: selectedOrder._id,
          reason: selectedReason,
          confirmed_by: admin.user.id,
          quantity, // pass the selected quantity
        });
      } else {
        response = await cancelOrder({
          order_id: selectedOrder._id,
          reason: selectedReason,
          confirmed_by: admin.user.id,
        });
      }
      if (response?.status === 200) {
        if (persistSelectedProducts.length > 0) {
          toast.success(
            createToast(
              "Orderline canceled",
              "Orderline canceled successfully",
              "success"
            )
          );
        } else {
          toast.success(
            createToast(
              "Order canceled",
              "Order canceled successfully",
              "success"
            )
          );
        }
        setOpen(false);
        setOpenOrderDetails(false);
        dispatch(refreshOrders() as any);
      }
    } catch (error) {
      toast.error(createToast("Cancel failed", "Please try again", "error"));
      setAuthorization(false);
    }
  }, [
    selectedOrder?._id,
    selectedReason,
    admin.user.id,
    setOpen,
    setOpenOrderDetails,
    dispatch,
    setAuthorization,
    persistSelectedProducts,
    quantity,
  ]);

  return (
    <section className="overflow-hidden h-full flex flex-col items-start gap-8 relative w-full pt-2">
      <div className="flex-1 flex items-center justify-start flex-col space-y-8 w-full px-2">
        <Select value={selectedReason} onValueChange={handleReasonSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Reason for cancellation" />
          </SelectTrigger>
          <SelectContent>
            {reasons.map((reason) => (
              <SelectItem key={reason.key} value={reason.value}>
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex justify-between items-center w-full">
          <Label>Enter the Quantity</Label>
          <NumberFlowInput value={quantity} min={1} onChange={setQuantity} />
        </div>
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
