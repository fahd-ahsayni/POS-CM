import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";
import { updateOrderLine } from "@/store/slices/order/create-order.slice";
import { ProductSelected } from "@/interfaces/product";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";

interface UseApplyProductDiscountProps {
  admin: any;
  setOpen: (open: boolean) => void;
  setAuthorization: (authorization: boolean) => void;
  orderLine: ProductSelected;
}

interface Discount {
  _id: string;
  name: string;
}

interface DefineNote {
  type: string;
  text: string;
}

export const useApplyProductDiscount = ({
  admin,
  setOpen,
  setAuthorization,
  orderLine,
}: UseApplyProductDiscountProps) => {
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

      // Update Redux store with discount info
      dispatch(
        updateOrderLine({
          _id: orderLine._id,
          customer_index: orderLine.customer_index,
          discount: discountInfo,
        })
      );

      // Update selected products
      setSelectedProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === orderLine._id &&
          product.customer_index === orderLine.customer_index
            ? {
                ...product,
                discount: discountInfo,
              }
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
          "Apply Product Discount failed",
          "Please try again",
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

  return {
    selectedDiscount,
    setSelectedDiscount,
    selectedReason,
    setSelectedReason,
    discounts,
    reasons,
    handleApplyDiscount,
  };
};
