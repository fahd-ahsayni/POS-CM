import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import ComboboxSelect from "@/components/global/ComboboxSelect";
import { useState, useMemo, useCallback } from "react";
import { CheckIcon } from "lucide-react";

export default function ApplyDiscountInfo() {
  const [selectedDiscount, setSelectedDiscount] = useState<string>("");

  const discounts = useMemo(() => {
    const discountData =
      JSON.parse(localStorage.getItem("generalData") || "{}").discount || [];
    return discountData.map((discount: any) => ({
      value: discount._id,
      label: discount.name,
    }));
  }, []);

  const handleDiscountSelect = useCallback((value: string) => {
    setSelectedDiscount(value);
    console.log("Selected discount:", value);
  }, []);

  return (
    <section className="overflow-hidden h-full flex flex-col items-center gap-8 relative">
      <TypographyP className="text-sm opacity-70 pt-10">
        Provide the discount details to finalize the authorization.
      </TypographyP>
      <div className="flex-1 pt-4 flex items-center justify-start flex-col space-y-8 w-full px-2 ml-2">
        <ComboboxSelect
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
          renderOption={(item, active, selected) => (
            <div className="flex items-center justify-between">
              <span>{item.label}</span>
              {selected && <CheckIcon className="h-4 w-4 text-primary-red" />}
            </div>
          )}
        />
      </div>
      <div className="flex justify-center gap-4 w-full px-4">
        <Button className="w-full">Apply Discount</Button>
      </div>
    </section>
  );
}
