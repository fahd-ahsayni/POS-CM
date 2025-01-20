import { createOrderWithOutPayment, updateOrder } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { useAppDispatch } from "@/store/hooks";
import { useHoldOrders } from "@/store/hooks/useHoldOrders";
import { refreshOrders, selectOrders } from "@/store/slices/data/orders.slice";
import {
  resetOrder,
  selectOrder,
  setClientId,
  setCustomerCount,
  setTableId,
} from "@/store/slices/order/create-order.slice";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ALL_CATEGORIES_VIEW } from "../../left-section/constants";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { TYPE_OF_ORDER_VIEW } from "../constants";
import { useOrderLines } from "../contexts/OrderLinesContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useCustomerManagement } from "../hooks/useCustomerManagement";
import { useCoasterCall } from "./useCoasterCall";
import { useNumberOfTable } from "./useNumberOfTable";

interface OrderSummaryState {
  openModalConfirmHoldOrder: boolean;
  openDrawerPayments: boolean;
  showTicket: boolean;
  openModalConfirmOrder: boolean;
}

export const useOrderSummary = () => {
  const [state, setState] = useState<OrderSummaryState>({
    openModalConfirmHoldOrder: false,
    openDrawerPayments: false,
    showTicket: false,
    openModalConfirmOrder: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { setViews: setViewsLeft, setSelectedProducts } = useLeftViewContext();
  const { setViews: setViewsRight, customerIndex } = useRightViewContext();
  const { handlePaymentComplete, addCustomer } = useCustomerManagement();

  const dispatch = useAppDispatch();
  const order = useSelector(selectOrder);

  const { selectedProducts } = useLeftViewContext();
  const { expandedCustomers, toggleAllCustomers } = useOrderLines();

  const { setNumber: setCoasterNumber } = useCoasterCall();
  const { setTableNumber } = useNumberOfTable();

  const { handleHoldOrder } = useHoldOrders();

  const orders = useSelector(selectOrders);

  const isActionsDisabled = useMemo(
    () => selectedProducts.length === 0,
    [selectedProducts.length]
  );

  const updateState = useCallback(
    (key: keyof OrderSummaryState, value: boolean) => {
      setState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetOrderState = useCallback(() => {
    const shiftId = order.shift_id;

    // Reset Redux store
    dispatch(resetOrder());
    dispatch(setCustomerCount(1)); // Ensure customer count starts at 1
    dispatch(setClientId(null));
    dispatch(setTableId(null));

    // Reset local states
    setSelectedProducts([]);
    handlePaymentComplete();
    setCoasterNumber("");
    setTableNumber("");

    // Reset views
    setViewsLeft(ALL_CATEGORIES_VIEW);
    setViewsRight(TYPE_OF_ORDER_VIEW);

    // Clear localStorage items
    localStorage.removeItem("tableNumber");

    return shiftId;
  }, [
    dispatch,
    setSelectedProducts,
    handlePaymentComplete,
    setViewsLeft,
    setViewsRight,
    order.shift_id,
    setCoasterNumber,
    setTableNumber,
  ]);

  const handlers = useMemo(
    () => ({
      handleToggleAll: () => {
        if (selectedProducts.length > 0) {
          toggleAllCustomers();
        }
      },
      handleProceedOrder: () => {
        if (isProcessing || selectedProducts.length === 0) return;

        const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
        const loadedOrder = JSON.parse(
          localStorage.getItem("loadedOrder") || "{}"
        );
        const existingOrder =
          orders.orders &&
          orders?.orders?.find(
            (o: any) =>
              o._id === order._id &&
              o.status !== "canceled" &&
              o.status !== "paid"
          );

        if (loadedOrder && existingOrder) {
          // Update existing order
          updateOrder(
            {
              orderlines: order.orderlines,
            },
            loadedOrder._id
          )
            .then(() => {
              localStorage.removeItem("loadedOrder");
              resetOrderState();
              dispatch(refreshOrders());
              toast.success(
                createToast(
                  "Order Updated Successfully",
                  "Your order has been updated",
                  "success"
                )
              );
            })
            .catch((error) => {
              console.error("Order update error:", error);
              toast.error(
                createToast(
                  "Order Update Failed",
                  "There was an error updating your order",
                  "error"
                )
              );
            });
        } else if (orderType?.creation_order_with_payment) {
          // Skip confirmation modal and go straight to payments
          updateState("openDrawerPayments", true);
        } else {
          // Show confirmation modal only for orders without payment
          updateState("openModalConfirmOrder", true);
        }
      },
      handleConfirmOrder: async () => {
        if (isProcessing || selectedProducts.length === 0) return;
        setIsProcessing(true);

        try {
          const orderType = JSON.parse(
            localStorage.getItem("orderType") || "{}"
          );
          dispatch(setCustomerCount(Math.max(customerIndex, 1)));

          if (orderType?.creation_order_with_payment) {
            updateState("openModalConfirmOrder", false);
            updateState("openDrawerPayments", true);
            setIsProcessing(false);
          } else {
            await createOrderWithOutPayment(order);
            resetOrderState();
            toast.success(
              createToast(
                "Order Created Successfully",
                "Your order has been processed without payment",
                "success"
              )
            );
          }
        } catch (error) {
          toast.error(
            createToast(
              "Order Creation Failed",
              "There was an error processing your order",
              "error"
            )
          );
          console.error("Order creation error:", error);
          setIsProcessing(false);
        }
      },
      handleShowTicket: () => {
        if (selectedProducts.length > 0) {
          updateState("showTicket", !state.showTicket);
        }
      },
      handleHoldOrder: () => {
        if (isActionsDisabled) return;
        handleHoldOrder();
      },
      setOpenModalConfirmHoldOrder: (value: boolean) =>
        updateState("openModalConfirmHoldOrder", value),
      setOpenDrawerPayments: (value: boolean) =>
        updateState("openDrawerPayments", value),
      handleAddCustomer: () => {
        if (selectedProducts.length > 0) {
          addCustomer();
          toggleAllCustomers();
        }
      },
      setOpenModalConfirmOrder: (value: boolean) =>
        updateState("openModalConfirmOrder", value),
    }),
    [
      selectedProducts.length,
      toggleAllCustomers,
      updateState,
      state.showTicket,
      addCustomer,
      customerIndex,
      isProcessing,
      order,
      resetOrderState,
      handleHoldOrder,
      isActionsDisabled,
      orders,
      dispatch,
    ]
  );

  return {
    state: {
      ...state,
      isActionsDisabled,
      expandedCustomers,
      isProcessing,
    },
    actions: handlers,
  };
};
