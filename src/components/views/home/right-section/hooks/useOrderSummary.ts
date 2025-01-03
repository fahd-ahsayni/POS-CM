import { setCustomerCount } from "@/store/slices/order/createOrder";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useOrderLines } from "../contexts/OrderLinesContext";

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

  const dispatch = useDispatch();

  const { selectedProducts } = useLeftViewContext();
  const { expandedCustomers, toggleAllCustomers } = useOrderLines();
  const { customerIndex } = useRightViewContext();

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
      handleProceedOrder: () => {
        if (selectedProducts.length > 0) {
          updateState("openDrawerPayments", true);
          dispatch(setCustomerCount(customerIndex));
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
    }),
    [selectedProducts.length, toggleAllCustomers, updateState, state.showTicket]
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
