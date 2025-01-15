import { Order } from "./../../../../../types/order.types";
import {
  selectOrder,
  setCustomerCount,
} from "@/store/slices/order/create-order.slice";
import { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useOrderLines } from "../contexts/OrderLinesContext";
import { useCustomerManagement } from "../hooks/useCustomerManagement";
import { createOrderWithOutPayment } from "@/api/services";
import { ALL_CATEGORIES_VIEW } from "../../left-section/constants";
import { TYPE_OF_ORDER_VIEW } from "../constants";

interface OrderSummaryState {
  openModalConfirmHoldOrder: boolean;
  openDrawerPayments: boolean;
  showTicket: boolean;
}

export const useOrderSummary = () => {
  const [state, setState] = useState<OrderSummaryState>({
    openModalConfirmHoldOrder: false,
    openDrawerPayments: false,
    showTicket: false,
  });

  const { setViews: setViewsLeft } = useLeftViewContext();
  const { setViews: setViewsRight } = useRightViewContext();

  const dispatch = useDispatch();

  const { selectedProducts } = useLeftViewContext();
  const { expandedCustomers, toggleAllCustomers } = useOrderLines();
  const { customerIndex } = useRightViewContext();
  const { addCustomer } = useCustomerManagement();

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

  const handlers = useMemo(
    () => ({
      handleToggleAll: () => {
        if (selectedProducts.length > 0) {
          toggleAllCustomers();
        }
      },
      handleProceedOrder: async () => {
        const order = useSelector(selectOrder);
        const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
        if (orderType?.creation_order_with_payment) {
          if (selectedProducts.length > 0) {
            updateState("openDrawerPayments", true);
            dispatch(setCustomerCount(Math.max(customerIndex, 1)));
          }
        } else {
          dispatch(setCustomerCount(Math.max(customerIndex, 1)));
          await createOrderWithOutPayment(order);
          setViewsLeft(ALL_CATEGORIES_VIEW);
          setViewsRight(TYPE_OF_ORDER_VIEW);
        }
      },
      handleShowTicket: () => {
        if (selectedProducts.length > 0) {
          updateState("showTicket", !state.showTicket);
        }
      },
      handleHoldOrder: () => updateState("openModalConfirmHoldOrder", true),
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
    }),
    [
      selectedProducts.length,
      toggleAllCustomers,
      updateState,
      state.showTicket,
      addCustomer,
      customerIndex,
    ]
  );

  return {
    state: {
      ...state,
      isActionsDisabled,
      expandedCustomers,
    },
    actions: handlers,
  };
};
