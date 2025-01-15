import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { useState, useCallback } from "react";
import {
  setChangedPrice,
  selectOrder,
  updateTotalAmount,
} from "@/store/slices/order/create-order.slice";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";
import { Input } from "@/components/ui/input";
import ComboboxSelect from "@/components/global/ComboboxSelect";
import { CheckIcon } from "lucide-react";
import { currency } from "@/preferences";

export default function EditPriceInfo({
  admin,
  setOpen,
  setAuthorization,
}: {
  admin: any;
  setOpen: (open: boolean) => void;
  setAuthorization: (authorization: boolean) => void;
}) {
  const dispatch = useDispatch();
  const order = useSelector(selectOrder);
  const [newPrice, setNewPrice] = useState<string>(
    (order.changed_price || order.total_amount).toString()
  );
  const [selectedReason, setSelectedReason] = useState<string>("");

  const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
  const reasons = (generalData.defineNote || [])
    .filter((item: any) => item.type === "price_edit")
    .map((reason: any) => ({
      value: reason.text,
      label: reason.text,
    }));

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/[^0-9.]/g, "");
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setNewPrice(value);
      }
    },
    []
  );

  const handleReasonSelect = useCallback((value: string) => {
    setSelectedReason(value);
  }, []);

  const handleApplyNewPrice = useCallback(() => {
    try {
      if (!newPrice) return;

      const numericPrice = parseFloat(newPrice);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        throw new Error("Invalid price");
      }

      dispatch(
        setChangedPrice({
          price: numericPrice,
          reason: selectedReason,
          confirmed_by: admin.user.id,
        })
      );

      toast.success(
        createToast("Price updated", "Order price updated successfully", "success")
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
  }, [dispatch, newPrice, selectedReason, admin.user.id, setOpen, setAuthorization]);

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
          disabled={!newPrice}
        >
          Update Price
        </Button>
      </div>
    </section>
  );
}
