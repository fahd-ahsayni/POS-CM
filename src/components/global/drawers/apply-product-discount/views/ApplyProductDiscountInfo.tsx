import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypographyP } from "@/components/ui/typography";
import { ProductSelected } from "@/types/product.types";
import { useApplyProductDiscount } from "../hooks/useApplyProductDiscount";

interface ApplyProductDiscountInfoProps {
  admin: any;
  setOpen: (open: boolean) => void;
  setAuthorization: (authorization: boolean) => void;
  orderLine: ProductSelected;
}

export default function ApplyProductDiscountInfo({
  admin,
  setOpen,
  setAuthorization,
  orderLine,
}: ApplyProductDiscountInfoProps) {
  const {
    selectedDiscount,
    setSelectedDiscount,
    selectedReason,
    setSelectedReason,
    discounts,
    reasons,
    handleApplyDiscount,
  } = useApplyProductDiscount({
    admin,
    setOpen,
    setAuthorization,
    orderLine,
  });

  return (
    <section className="overflow-hidden h-full flex flex-col items-start gap-8 relative w-full">
      <TypographyP className="text-sm pt-10 text-start px-2">
        Apply discount to selected product.
      </TypographyP>
      <div className="flex-1 pt-4 flex items-center justify-start flex-col space-y-8 w-full px-2">
        <div className="w-full space-y-2">
          <Label className="pl-2">Select a discount</Label>
          <Select value={selectedDiscount} onValueChange={setSelectedDiscount}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a discount" />
            </SelectTrigger>
            <SelectContent>
              {discounts.map((discount) => (
                <SelectItem key={discount.value} value={discount.value}>
                  {discount.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full space-y-2">
          <Label className="pl-2">Select a reason</Label>
          <Select value={selectedReason} onValueChange={setSelectedReason}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Reason for discount" />
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
