import ComboboxSelect from "@/components/global/ComboboxSelect";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { TypographyP } from "@/components/ui/typography";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { updateOrderLine } from "@/store/slices/order/create-order.slice";
import { ProductSelected } from "@/types/product.types";
import { CheckIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface Discount {
  _id: string;
  name: string;
}

interface DefineNote {
  type: string;
  text: string;
}

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
  const dispatch = useDispatch();
  const { setSelectedProducts } = useLeftViewContext();
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

  const handleApplyDiscount = useCallback(() => {
    try {
      if (!selectedDiscount || !selectedReason) return;

      const discountInfo = {
        discount_id: selectedDiscount,
        reason: selectedReason,
        confirmed_by: admin.user.id,
      };

      // Update Redux store
      dispatch(
        updateOrderLine({
          _id: orderLine._id,
          customerIndex: orderLine.customer_index,
          orderLine: {
            ...orderLine,
            discount: discountInfo,
          },
        })
      );

      // Update selected products
      setSelectedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === orderLine._id &&
          product.customer_index === orderLine.customer_index
            ? { ...product, discount: discountInfo }
            : product
        )
      );

      toast.success(
        createToast(
          "Discount applied",
          "Product discount applied successfully",
          "success"
        )
      );
      setOpen(false);
    } catch (error) {
      toast.error(
        createToast(
          "Error applying discount",
          "An unexpected error occurred while trying to apply the discount",
          "error"
        )
      );
      setAuthorization(false);
    }
  }, [
    dispatch,
    selectedDiscount,
    selectedReason,
    admin.user.id,
    orderLine,
    setOpen,
    setAuthorization,
    setSelectedProducts,
  ]);

  return (
    <section className="overflow-hidden h-full flex flex-col items-start gap-8 relative w-full">
      <TypographyP className="text-sm pt-10 text-start px-2">
        Apply discount to selected product.
      </TypographyP>
      <div className="flex-1 pt-4 flex items-center justify-start flex-col space-y-8 w-full px-2">
        <ComboboxSelect
          label="Select a discount"
          items={discounts}
          value={discounts.find((d) => d.value === selectedDiscount) || null}
          onChange={(item) => setSelectedDiscount(item?.value || "")}
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
          value={reasons.find((r) => r.value === selectedReason) || null}
          onChange={(item) => setSelectedReason(item?.value || "")}
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
