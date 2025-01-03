import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import ComboboxSelect from "@/components/global/ComboboxSelect";
import { useState, useMemo, useCallback } from "react";
import { CheckIcon } from "lucide-react";
import { setDiscount } from "@/store/slices/order/createOrder";

interface Discount {
  _id: string;
  name: string;
}

interface DefineNote {
  type: string;
  text: string;
}

export default function ApplyDiscountInfo({
  admin,
  setOpen,
}: {
  admin: any;
  setOpen: (open: boolean) => void;
}) {
  const dispatch = useDispatch();
  const [selectedDiscount, setSelectedDiscount] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");

  const generalData = useMemo(() => {
    return JSON.parse(localStorage.getItem("generalData") || "{}");
  }, []);

  const discounts = useMemo(() => {
    const discountData: Discount[] = generalData.discount || [];
    return discountData.map((discount) => ({
      value: discount._id,
      label: discount.name,
    }));
  }, [generalData]);

  const reasons = useMemo(() => {
    const reasonsData: DefineNote[] =
      generalData.defineNote?.filter(
        (item: DefineNote) => item.type === "discount"
      ) || [];
    return reasonsData.map((reason) => ({
      value: reason.text,
      label: reason.text,
    }));
  }, [generalData]);

  const handleDiscountSelect = useCallback((value: string) => {
    setSelectedDiscount(value);
  }, []);

  const handleReasonSelect = useCallback((value: string) => {
    setSelectedReason(value);
  }, []);

  const handleApplyDiscount = useCallback(() => {
    console.log(admin.user.id);
    dispatch(
      setDiscount({
        discount_id: selectedDiscount,
        reason: selectedReason,
        confirmed_by: admin.user.id,
      })
    );
    setOpen(false);
  }, [dispatch, selectedDiscount, selectedReason, admin._id]);

  return (
    <section className="overflow-hidden h-full flex flex-col items-start gap-8 relative w-full">
      <TypographyP className="text-sm pt-10 text-start px-2">
        Provide the discount details to finalize the authorization.
      </TypographyP>
      <div className="flex-1 pt-4 flex items-center justify-start flex-col space-y-8 w-full px-2">
        <ComboboxSelect
          label="Select a discount"
          items={discounts}
          value={
            discounts.find((d: any) => d.value === selectedDiscount) || null
          }
          onChange={(item) => handleDiscountSelect(item?.value || "")}
          displayValue={(item) => item?.label || ""}
          placeholder="Select a discount"
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

        <ComboboxSelect
          label="Select a reason"
          items={reasons}
          value={reasons.find((r: any) => r.value === selectedReason) || null}
          onChange={(item) => handleReasonSelect(item?.value || "")}
          displayValue={(item) => item?.label || ""}
          placeholder="Reason for discount"
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
          onClick={handleApplyDiscount}
          className="w-full"
          disabled={!selectedDiscount || !selectedReason}
        >
          Apply Discount
        </Button>
      </div>
    </section>
  );
}
