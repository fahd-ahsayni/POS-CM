import {
  createOrderWithOutPayment,
  logoutService,
  updateOrder,
} from "@/api/services";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ALL_CATEGORIES_VIEW } from "../../left-section/constants";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import { TYPE_OF_ORDER_VIEW } from "../constants";
import { useOrderLines } from "../contexts/OrderLinesContext";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useCustomerManagement } from "../hooks/useCustomerManagement";
import { useCoasterCall } from "./useCoasterCall";
import { useNumberOfTable } from "./useNumberOfTable";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface OrderSummaryState {
  openModalConfirmHoldOrder: boolean;
  openDrawerPayments: boolean;
  showTicket: boolean;
  openModalConfirmOrder: boolean;
}

export const useOrderSummary = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<OrderSummaryState>({
    openModalConfirmHoldOrder: false,
    openDrawerPayments: false,
    showTicket: false,
    openModalConfirmOrder: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { setViews: setViewsLeft, setSelectedProducts, selectedProducts } = useLeftViewContext();
  const { setViews: setViewsRight, customerIndex } = useRightViewContext();
  const { handlePaymentComplete, addCustomer } = useCustomerManagement();

  const dispatch = useAppDispatch();
  const order = useSelector(selectOrder);

  const { expandedCustomers, toggleAllCustomers } = useOrderLines();

  const { setNumber: setCoasterNumber } = useCoasterCall();
  const { setTableNumber } = useNumberOfTable();

  const { handleHoldOrder } = useHoldOrders();

  const orders = useSelector(selectOrders);

  const [orderType] = useLocalStorage<any>("orderType", {});
  const [user] = useLocalStorage<any>("user", {});
  const [loadedOrder] = useLocalStorage<any>("loadedOrder", {});

  const isActionsDisabled = useMemo(
    () => selectedProducts.length === 0,
    [selectedProducts.length]
  );

  console.log(selectedProducts);
  
  const updateState = useCallback(
    (key: keyof OrderSummaryState, value: boolean) => {
      if (key === "openDrawerPayments" && user.position === "Waiter") {
        toast.warning(
          createToast(
            "Payment Failed",
            "You are not authorized as a cashier.",
            "warning"
          )
        );
        return;
      }
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
      handleProceedOrder: async () => {
        if (isProcessing || selectedProducts.length === 0) return;
        const existingOrder =
          orders.orders &&
          orders?.orders?.find(
            (o: any) =>
              o._id === order._id &&
              o.status !== "canceled" &&
              o.status !== "paid"
          );

        if (loadedOrder && existingOrder) {
          setIsUpdating(true);
          try {
            // Filter out products that are already ordered (is_ordred === true)
            const newOrderLines = selectedProducts.filter(
              (product) => !product.is_ordred
            );

            const updatedOrderlines = newOrderLines.map((product) => {
              const orderline = {
                product_variant_id: product.product_variant_id,
                quantity: product.quantity,
                price: product.price,
                customer_index: product.customer_index,
                notes: product.notes || [],
                is_ordred: false, // These are new items, not yet ordered
                is_paid: false,
                suite_commande: product.suite_commande || false,
                high_priority: product.high_priority || false,
                discount: product.discount || null,
                uom_id: product.uom_id,
                order_type_id: product.order_type_id,
              };

              // Add combo items if this is a combo product
              if (product.is_combo && product.combo_items) {
                return {
                  ...orderline,
                  combo_prod_ids: product.combo_items.variants.map(
                    (variant: any) => ({
                      product_variant_id:
                        variant._id || variant.product_variant_id,
                      quantity: variant.quantity || 1,
                      notes: variant.notes || [],
                      suite_commande: variant.suite_commande || false,
                      order_type_id:
                        variant.order_type_id || product.order_type_id,
                    })
                  ),
                  combo_supp_ids: product.combo_items.supplements.map(
                    (supp: any) => ({
                      product_variant_id: supp._id || supp.product_variant_id,
                      quantity: supp.quantity || 1,
                      notes: supp.notes || [],
                      suite_commande: supp.suite_commande || false,
                      order_type_id:
                        supp.order_type_id || product.order_type_id,
                    })
                  ),
                };
              }

              return orderline;
            });

            // Only proceed if there are new items to add
            if (updatedOrderlines.length > 0) {
              await updateOrder(
                {
                  orderlines: updatedOrderlines,
                },
                loadedOrder._id
              );

              toast.success(
                createToast(
                  "Order Updated Successfully",
                  "Your order has been updated",
                  "success"
                )
              );
            } else {
              toast.info(
                createToast(
                  "No Changes Made",
                  "No new items to add to the order",
                  "info"
                )
              );
            }

            localStorage.removeItem("loadedOrder");
            resetOrderState();
            dispatch(refreshOrders());
          } catch (error) {
            toast.error(
              createToast(
                "Order Update Failed",
                "There was an error updating your order",
                "error"
              )
            );
          } finally {
            setIsUpdating(false);
            if (user.position === "Waiter") {
              await logoutService();
              navigate("/login");
            }
          }
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
      setOpenDrawerPayments: (value: boolean) => {
        updateState("openDrawerPayments", value);
      },
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
      isUpdating,
    ]
  );

  return {
    state: {
      ...state,
      isActionsDisabled,
      expandedCustomers,
      isProcessing,
      isUpdating,
    },
    actions: handlers,
  };
};
