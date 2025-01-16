import { refreshOrders } from "@/store/slices/data/orders.slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOrder } from "../context/OrderContext";

export const useOrderDetails = () => {
  const { selectedOrder, openOrderDetails, setOpenOrderDetails } = useOrder();
  const [selectedOrderlines, setSelectedOrderlines] = useState<string[]>([]);
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [openPayments, setOpenPayments] = useState(false);
  const [editedAmount, setEditedAmount] = useState<number | null>(null);

  const dispatch = useDispatch();
  const ordersStatus = useSelector((state: any) => state.orders.status);

  const handleProcessPayment = () => {
    setOpenOrderDetails(false);
    setOpenPayments(true);
  };

  const handlePaymentComplete = async () => {
    try {
      setOpenPayments(false);
      setOpenOrderDetails(false);
      setEditedAmount(null);
      setSelectedOrderlines([]);
      await dispatch(refreshOrders() as any);
    } catch (error) {
      console.error("Error handling payment completion:", error);
    }
  };

  const handleCancelComplete = () => {
    try {
      setOpenCancelOrder(false);
      setOpenOrderDetails(false);

      if (ordersStatus !== "loading") {
        dispatch(refreshOrders() as any)
          .unwrap()
          .catch((error: any) => {
            console.error("Error refreshing orders:", error);
          });
      }
    } catch (error) {
      console.error("Error in handleCancelComplete:", error);
    }
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
    orderAmount: editedAmount ?? selectedOrder?.total_amount ?? 0,
    setEditedAmount,
    handleCancelComplete,
  };
};
