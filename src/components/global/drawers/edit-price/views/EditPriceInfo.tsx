import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currency } from "@/preferences";
import {
  selectOrder,
  setChangedPrice,
  updateTotalAmount,
} from "@/store/slices/order/create-order.slice";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function EditPriceInfo({
  admin,
  setOpen,
  setAuthorization,
  selectedOrder,
  onPriceChange,
}: {
  admin: any;
  setOpen: (open: boolean) => void;
  setAuthorization: (authorization: boolean) => void;
  selectedOrder: any;
  onPriceChange?: (price: number) => void;
}) {
  const dispatch = useDispatch();
  const order = useSelector(selectOrder);

  // Initialize price state with memoized value from current order total
  const initialPrice = useMemo(() => {
    if (selectedOrder) {
      return selectedOrder.total_amount;
    }
    return order.changed_price || order.total_amount;
  }, [order.changed_price, order.total_amount, selectedOrder]);

  const [newPrice, setNewPrice] = useState<string>(initialPrice);
  const [selectedReason, setSelectedReason] = useState<string>("");

  // Memoize reasons array to prevent unnecessary recalculations
  const reasons = useMemo(() => {
    const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
    return (generalData.defineNote || [])
      .filter((item: any) => item.type === "price_edit")
      .map((reason: any) => ({
        value: reason.text,
        label: reason.text,
      }));
  }, []);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, "");
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          // Remove toFixed to allow typing without automatic formatting
          setNewPrice(Math.min(numericValue, 999999.99).toString());
        } else {
          setNewPrice(value);
        }
      }
    },
    []
  );

  const handleReasonSelect = useCallback((value: string) => {
    setSelectedReason(value);
  }, []);

  const isValidPrice = useMemo(() => {
    const numericPrice = parseFloat(newPrice);
    return !isNaN(numericPrice) && numericPrice > 0;
  }, [newPrice]);

  const handleApplyNewPrice = useCallback(() => {
    if (!isValidPrice) {
      toast.error(
        createToast("Invalid price", "Please enter a valid price", "error")
      );
      return;
    }

    try {
      const numericPrice = parseFloat(newPrice);

      if (selectedOrder && onPriceChange) {
        onPriceChange(numericPrice);
      } else {
        dispatch(
          setChangedPrice({
            price: numericPrice,
            reason: selectedReason,
            confirmed_by: admin.user.id,
          })
        );
        dispatch(updateTotalAmount(numericPrice));
      }

      toast.success(
        createToast(
          "Price updated",
          "Order price updated successfully",
          "success"
        )
      );
      setOpen(false);
    } catch (error) {
      toast.error(
        createToast("Update Price failed", "Please try again", "error")
      );
      setAuthorization(false);
    }
  }, [
    dispatch,
    newPrice,
    selectedReason,
    admin.user.id,
    setOpen,
    setAuthorization,
    isValidPrice,
    selectedOrder,
    onPriceChange,
  ]);

  return (
    <section className="overflow-hidden h-full flex flex-col items-start gap-8 relative w-full">
      <div className="flex-1  flex items-center justify-start flex-col space-y-8 w-full px-2">
        <div className="w-full space-y-2">
          <label className="text-sm font-medium">
            New Price ({currency.symbol})
          </label>
          <Input
            type="text"
            value={newPrice}
            onChange={handlePriceChange}
            placeholder="Enter new price"
            className={!isValidPrice ? "border-red-500" : ""}
          />
        </div>

        <div className="w-full space-y-2">
          <label className="text-sm font-medium">Select a reason</label>
          <Select value={selectedReason} onValueChange={handleReasonSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Reason for price change" />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((reason: any) => (
                <SelectItem key={reason.value} value={reason.value}>
                  {reason.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex justify-center gap-4 w-full px-4">
        <Button
          onClick={handleApplyNewPrice}
          className="w-full"
          disabled={!isValidPrice}
        >
          Update Price
        </Button>
      </div>
    </section>
  );
}
