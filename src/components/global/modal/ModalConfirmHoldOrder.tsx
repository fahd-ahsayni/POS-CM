import { useLeftViewContext } from "@/components/views/home/left-section/contexts/leftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/rightViewContext";
import { resetOrder, selectOrder } from "@/store/slices/order/createOrder";
import { Order } from "@/types/getDataByDay";
import { BsExclamation } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { createToast } from "../Toasters";
import { toast } from "react-toastify";
import BaseModal from "./Layout/BaseModal";
import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { TYPE_OF_ORDER_VIEW } from "@/components/views/home/right-section/constants";
import { updateOrder } from "@/functions/updateOrder";

interface ModalConfirmHoldOrderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ModalConfirmHoldOrder({
  open,
  setOpen,
}: ModalConfirmHoldOrderProps) {
  const dispatch = useDispatch();
  const { setSelectedCustomer, setCustomerIndex } = useRightViewContext();
  const { setSelectedProducts } = useLeftViewContext();
  const order = useSelector(selectOrder);

  const { setViews: setViewsLeft } = useLeftViewContext();
  const { setViews: setViewsRight } = useRightViewContext();

  const handleConfirmHoldOrder = () => {
    const holdOrder = { ...(order as unknown as Order), _id: uuidv4() };
    saveHoldOrder(holdOrder);
    resetState();
    showSuccessToast();
  };

  const saveHoldOrder = (holdOrder: Order) => {
    const existingOrders = JSON.parse(
      localStorage.getItem("holdOrders") || "[]"
    );
    localStorage.setItem(
      "holdOrders",
      JSON.stringify([...existingOrders, holdOrder])
    );
  };

  const resetState = () => {
    const shiftId = localStorage.getItem("shiftId");

    setSelectedCustomer(1);
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
