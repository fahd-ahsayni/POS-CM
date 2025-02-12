import { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { applyDiscount } from "@/api/services";
import { useOrder } from "@/components/global/drawers/order-details/context/OrderContext";
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
  const { selectedOrder } = useOrder();
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

  const handleApplyDiscount = useCallback(async () => {
    try {
      if (!selectedDiscount || !selectedReason) return;

      const discountData = {
        discount_id: selectedDiscount,
        reason: selectedReason,
        confirmed_by: admin.user.id,
      };

      // If there's a loaded order (editing existing order)
      if (selectedOrder?._id) {
        const response = await applyDiscount({
          order_id: selectedOrder._id,
          ...discountData,
        });

        if (response.status === 200) {
          toast.success(
            createToast(
              "Discount applied",
              "The discount has been applied to the order",
              "success"
            )
          );
        }

        localStorage.removeItem("orderDiscount");
        localStorage.setItem("orderDiscount", JSON.stringify(discountData));
      } else {
        // For new orders, use the Redux slice
        dispatch(setDiscount(discountData));
        toast.success(
          createToast(
            "Discount applied",
            "The discount has been applied to the order",
            "success"
          )
        );
      }

      setOpen(false);
    } catch (error) {
      console.error("Discount error:", error);
      toast.error(
        createToast("Apply Discount failed", "Please try again", "error")
      );
      setAuthorization(false);
    }
  }, [
    selectedDiscount,
    selectedReason,
    admin.user.id,
    dispatch,
    setOpen,
    setAuthorization,
    selectedOrder,
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
