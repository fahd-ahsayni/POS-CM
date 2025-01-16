import ComboboxSelect from "@/components/global/ComboboxSelect";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyP } from "@/components/ui/typography";
import { currency } from "@/preferences";
import {
  selectOrder,
  setChangedPrice,
  updateTotalAmount,
} from "@/store/slices/order/create-order.slice";
import { CheckIcon } from "lucide-react";
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
        createToast(
          "Invalid price",
          "Please enter a valid price greater than 0",
          "error"
        )
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
        createToast(
          "Error updating price",
          "An unexpected error occurred while trying to update the price",
          "error"
        )
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
      <TypographyP className="text-sm pt-10 text-start px-2">
        Enter the new price and provide a reason for the change.
      </TypographyP>
      <div className="flex-1 pt-4 flex items-center justify-start flex-col space-y-8 w-full px-2">
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

        <ComboboxSelect
          label="Select a reason"
          items={reasons}
          value={reasons.find((r: any) => r.value === selectedReason) || null}
          onChange={(item) => handleReasonSelect(item?.value || "")}
          displayValue={(item) => item?.label || ""}
          placeholder="Reason for price change"
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
