import { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setDiscount } from "@/store/slices/order/create-order.slice";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";

interface Discount {
  _id: string;
  name: string;
}

interface DefineNote {
  type: string;
  text: string;
}

export function useApplyDiscount(
  admin: any,
  setOpen: (open: boolean) => void,
  setAuthorization: (authorization: boolean) => void
) {
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
    try {
      if (!selectedDiscount || !selectedReason) return;

      dispatch(
        setDiscount({
          discount_id: selectedDiscount,
          reason: selectedReason,
          confirmed_by: admin.user.id,
        })
      );

      toast.success(
        createToast(
          "Discount applied",
          "Discount applied successfully",
          "success"
        )
      );
      setOpen(false);
    } catch (error) {
      toast.error(
        createToast("Apply Discount failed", "Please try again", "error")
      );
      setAuthorization(false);
    }
  }, [
    dispatch,
    selectedDiscount,
    selectedReason,
    admin.user.id,
    setOpen,
    setAuthorization,
  ]);

  return {
    selectedDiscount,
    selectedReason,
    discounts,
    reasons,
    handleDiscountSelect,
    handleReasonSelect,
    handleApplyDiscount,
  };
}
