import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { TYPE_OF_ORDER_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { updateOrder } from "@/functions/updateOrder";
import { holdOrder, resetOrder } from "@/store/slices/order/createOrder";
import { BsExclamation } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createToast } from "../Toasters";
import BaseModal from "./Layout/BaseModal";

interface ModalConfirmHoldOrderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ModalConfirmHoldOrder({
  open,
  setOpen,
}: ModalConfirmHoldOrderProps) {
  const dispatch = useDispatch();

  const { setViews: setViewsLeft, setSelectedProducts } = useLeftViewContext();
  const { setViews: setViewsRight, setCustomerIndex } = useRightViewContext();

  const handleConfirmHoldOrder = () => {
    dispatch(holdOrder());
    resetState();
    showSuccessToast();
  };

  const resetState = () => {
    const shiftId = localStorage.getItem("shiftId");

    setCustomerIndex(1);
    setSelectedProducts([]);
    setOpen(false);

    dispatch(resetOrder());
    if (shiftId) {
      dispatch(
        updateOrder({
          shift_id: shiftId,
        })
      );
    }
    setViewsLeft(ALL_CATEGORIES_VIEW);
    setViewsRight(TYPE_OF_ORDER_VIEW);
  };

  const showSuccessToast = () => {
    toast.info(
      createToast(
        "Order held successfully",
        "The order has been successfully placed on hold.",
        "info"
      )
    );
  };

  return (
    <BaseModal
      isOpen={open}
      closeModal={() => setOpen(false)}
      title="Confirm Hold Order"
      description="Are you sure you want to hold this order? Once confirmed, the order will be held and the customer will be charged."
      icon={<BsExclamation className="h-8 w-8 text-secondary-black" />}
      confirmText="Yes, Confirm & Send"
      onConfirm={handleConfirmHoldOrder}
      onCancel={() => setOpen(false)}
      variant="warning"
    />
  );
}
