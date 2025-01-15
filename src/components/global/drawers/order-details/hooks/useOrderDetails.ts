import { useState } from "react";
import { useOrder } from "../context/OrderContext";
import { payOrder } from "@/api/services";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";
import { PaymentMethod } from "@/types/general";

export const useOrderDetails = () => {
  const { selectedOrder, openOrderDetails, setOpenOrderDetails } = useOrder();
  const [selectedOrderlines, setSelectedOrderlines] = useState<string[]>([]);
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [openPayments, setOpenPayments] = useState(false);

  const handleProcessPayment = () => {
    setOpenOrderDetails(false);
    setOpenPayments(true);
  };

  const handlePaymentComplete = async (payments: PaymentMethod[]) => {
    console.log(payments);
  };

  return {
    selectedOrder,
    openOrderDetails,
    setOpenOrderDetails,
    selectedOrderlines,
    setSelectedOrderlines,
    openCancelOrder,
    setOpenCancelOrder,
    openPayments,
    setOpenPayments,
    handleProcessPayment,
    handlePaymentComplete,
    orderAmount: selectedOrder?.total_amount || 0,
  };
};
