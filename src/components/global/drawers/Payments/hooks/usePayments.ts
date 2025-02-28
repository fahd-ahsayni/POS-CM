import {
  createPayment,
  logoutService,
  payNewOrder,
  paySelectedProducts,
} from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { TYPE_OF_ORDER_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { useCoasterCall } from "@/components/views/home/right-section/hooks/useCoasterCall";
import { useCustomerManagement } from "@/components/views/home/right-section/hooks/useCustomerManagement";
import { useNumberOfTable } from "@/components/views/home/right-section/hooks/useNumberOfTable";
import { Order } from "@/interfaces/order";
import { currency } from "@/preferences";
import {
  resetOrder,
  selectOrder,
  setCustomerCount,
} from "@/store/slices/order/create-order.slice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Represents a payment method with its properties
 */
interface PaymentMethod {
  _id: string;
  name: string;
  amount: number;
  originalId?: string;
}

/**
 * Props for the usePayments hook
 */
interface UsePaymentsProps {
  onComplete?: (payments: PaymentMethod[]) => Promise<void>;
  selectedOrder?: Order;
  totalAmount?: number;
  selectedOrderlines?: any[]; // Add this prop
}

/**
 * Custom hook to manage payment methods and calculations
 * @param onComplete - Callback function called when payments are completed
 */
export function usePayments({
  onComplete,
  selectedOrder,
  totalAmount,
  selectedOrderlines, // Add this prop
}: UsePaymentsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<PaymentMethod[]>([]);
  const [currentAmount, setCurrentAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePaymentIndex, setActivePaymentIndex] = useState<number>(-1);
  const [editedAmount, setEditedAmount] = useState<number | null>(null);

  const { handlePaymentComplete } = useCustomerManagement();
  const { setViews: setViewsRight } = useRightViewContext();
  const { setViews: setViewsLeft } = useLeftViewContext();
  const { customerIndex } = useRightViewContext();

  const order = useSelector(selectOrder);
  const dispatch = useDispatch();

  const { setTableNumber } = useNumberOfTable();
  const { setNumber } = useCoasterCall();

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Initialize payment methods
  useEffect(() => {
    const fetchPaymentMethods = () => {
      const parsedData = JSON.parse(
        localStorage.getItem("generalData") || "{}"
      );
      setPaymentMethods(parsedData.paymentMethods || []);
    };

    fetchPaymentMethods();
  }, []);

  const getTotalPaidAmount = useCallback(() => {
    return selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [selectedPayments]);

  const getRemainingAmount = useCallback(() => {
    // Use totalAmount prop if provided (for selected orderlines), otherwise fallback to order totals
    const orderTotal =
      editedAmount ??
      (selectedOrder
        ? totalAmount ?? selectedOrder.total_amount
        : order.changed_price !== null
        ? order.changed_price
        : order.total_amount);

    const remaining = orderTotal - getTotalPaidAmount();
    return Number(remaining.toFixed(2));
  }, [
    editedAmount,
    totalAmount,
    selectedOrder,
    order.changed_price,
    order.total_amount,
    getTotalPaidAmount,
  ]);

  const handlePaymentMethodSelect = useCallback(
    (method: PaymentMethod, initialAmount?: string) => {
      const remainingAmount = getRemainingAmount();

      // Only show warning if trying to add payment when fully paid
      if (remainingAmount <= 0 && !initialAmount) {
        toast.warning(
          createToast(
            "Payment amount exceeded",
            "Cannot add more payments",
            "warning"
          )
        );
        return;
      }

      const newPayment = {
        ...method,
        _id: `${method._id}_${Date.now()}`,
        originalId: method._id,
        amount: initialAmount ? parseFloat(initialAmount) : remainingAmount,
      };

      setSelectedPayments((prev) => [...prev, newPayment]);
      setActivePaymentIndex((prev) => prev + 1);
      setCurrentAmount(initialAmount || remainingAmount.toString());
    },
    [getRemainingAmount]
  );

  const handleAmountInput = useCallback(
    (value: string) => {
      // Early return if trying to clear/delete with no payments
      if (
        (value === "C" || value === "delete") &&
        selectedPayments.length === 0
      ) {
        setCurrentAmount("0");
        return;
      }

      // Handle Clear button
      if (value === "C") {
        if (activePaymentIndex !== -1) {
          setCurrentAmount("0");
          setSelectedPayments((payments) =>
            payments.map((p, index) =>
              index === activePaymentIndex ? { ...p, amount: 0 } : p
            )
          );
        }
        return;
      }

      // Handle Delete button
      if (value === "delete") {
        setCurrentAmount((prev) => {
          const newAmount = prev.slice(0, -1) || "0";
          const numericAmount = parseFloat(newAmount) || 0;

          setSelectedPayments((payments) =>
            payments.map((p, index) =>
              index === activePaymentIndex ? { ...p, amount: numericAmount } : p
            )
          );

          return newAmount;
        });
        return;
      }

      // Rest of the existing handleAmountInput logic...
      if (paymentMethods.length > 0 && selectedPayments.length === 0) {
        const firstMethod = paymentMethods[0];
        handlePaymentMethodSelect(firstMethod, value);
        return;
      }

      if (activePaymentIndex === -1) {
        toast.warning(
          createToast(
            "Payment method required",
            "Please select a payment method first",
            "warning"
          )
        );
        return;
      }

      setCurrentAmount((prev) => {
        const newAmount = prev === "0" ? value : prev + value;
        const numericAmount = parseFloat(newAmount) || 0;

        setSelectedPayments((payments) =>
          payments.map((p, index) =>
            index === activePaymentIndex ? { ...p, amount: numericAmount } : p
          )
        );

        return newAmount;
      });
    },
    [
      paymentMethods,
      selectedPayments.length,
      activePaymentIndex,
      handlePaymentMethodSelect,
    ]
  );

  const handleQuickAmount = useCallback(
    (amount: number) => {
      if (activePaymentIndex === -1) {
        toast.warning(
          createToast(
            "Payment method required",
            "Please select a payment method first",
            "warning"
          )
        );
        return;
      }

      setCurrentAmount((prev) => {
        const prevAmount = parseFloat(prev) || 0;
        const newAmount = prevAmount + amount;

        setSelectedPayments((payments) =>
          payments.map((p, index) =>
            index === activePaymentIndex ? { ...p, amount: newAmount } : p
          )
        );

        return newAmount.toString();
      });
    },
    [activePaymentIndex]
  );

  const removePaymentMethod = useCallback(
    (methodId: string) => {
      const removedIndex = selectedPayments.findIndex(
        (p) => p._id === methodId
      );

      setSelectedPayments((prev) => prev.filter((p) => p._id !== methodId));

      if (activePaymentIndex === removedIndex) {
        setActivePaymentIndex(-1);
        setCurrentAmount("");
      } else if (activePaymentIndex > removedIndex) {
        setActivePaymentIndex((prev) => prev - 1);
      }
    },
    [selectedPayments, activePaymentIndex]
  );

  const handleComplete = useCallback(async () => {
    if (isProcessing) return;

    const remainingAmount = getRemainingAmount();
    if (remainingAmount > 0) {
      toast.warning(
        createToast(
          "Incomplete Payment",
          `There is still ${remainingAmount.toFixed(currency.toFixed || 2)} ${
            currency.symbol
          } remaining`,
          "warning"
        )
      );
      return;
    }

    setIsProcessing(true);

    try {
      const shiftId = localStorage.getItem("shiftId");

      // Calculate actual customer count from order lines
      const uniqueCustomerIndices = new Set(
        order.orderlines.map((line) => line.customer_index)
      );
      const actualCustomerCount = Math.max(
        uniqueCustomerIndices.size,
        customerIndex,
        1
      );

      // Update customer count before payment
      dispatch(setCustomerCount(actualCustomerCount));

      if (selectedOrder) {
        // Check if there are selected orderlines
        if (selectedOrderlines && selectedOrderlines.length > 0) {
          // Determine if all valid orderlines are selected
          const allValidOrderLineIds = selectedOrder.orderline_ids
            .filter(
              (line: any) => !line.is_paid && line.cancelled_qty < line.quantity
            )
            .map((line: any) => line._id);

          const allValidOrderlinesSelected =
            selectedOrderlines.length === allValidOrderLineIds.length &&
            selectedOrderlines.every((id) => allValidOrderLineIds.includes(id));

          // If all valid orderlines are selected and they're all the orderlines in the order,
          // use payNewOrder, otherwise use paySelectedProducts
          if (
            allValidOrderlinesSelected &&
            allValidOrderLineIds.length === selectedOrder.orderline_ids.length
          ) {
            await payNewOrder({
              order_id: selectedOrder._id,
              shift_id: shiftId,
              payments: selectedPayments.map((item) => ({
                payment_method_id: item.originalId,
                amount_given: item.amount,
              })),
            });
          } else {
            await paySelectedProducts({
              orderlines: selectedOrderlines,
              order_id: selectedOrder._id,
              payments: selectedPayments.map((item) => ({
                payment_method_id: item.originalId,
                amount_given: item.amount,
              })),
              shift_id: shiftId || "",
            });
          }
        } else {
          toast.error(
            createToast(
              "Payment failed",
              "No products selected for payment",
              "error"
            )
          );
          setIsProcessing(false);
          return;
        }
      } else {
        // Handle new order creation
        await createPayment({
          order: {
            ...order,
            shift_id: order.shift_id || shiftId,
            customer_count: actualCustomerCount,
          },
          shift_id: order.shift_id || shiftId,
          payments: selectedPayments.map((item) => ({
            payment_method_id: item.originalId,
            amount_given: item.amount,
          })),
        });
      }

      // Handle success
      await onComplete?.(selectedPayments);
      setSelectedPayments([]);
      setCurrentAmount("");
      setActivePaymentIndex(-1);
      localStorage.removeItem("orderType");
      handlePaymentComplete();
      dispatch(resetOrder());
      setViewsLeft(ALL_CATEGORIES_VIEW);
      setViewsRight(TYPE_OF_ORDER_VIEW);

      toast.success(
        createToast(
          "Payment completed successfully",
          `Total paid: ${getTotalPaidAmount().toFixed(currency.toFixed || 2)} ${
            currency.symbol
          }`,
          "success"
        )
      );

      setTableNumber("");
      setNumber("");
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error(
        createToast(
          "Payment failed",
          "Please try again or contact support",
          "error"
        )
      );
    } finally {
      setIsProcessing(false);
      if (user.position === "Waiter") {
        await logoutService();
        navigate("/login");
      }
    }
  }, [
    isProcessing,
    selectedPayments,
    onComplete,
    handlePaymentComplete,
    setViewsLeft,
    setViewsRight,
    getTotalPaidAmount,
    order,
    selectedOrder,
    dispatch,
    setTableNumber,
    setNumber,
    customerIndex,
    order.orderlines,
    selectedOrderlines,
    getRemainingAmount,
  ]);

  const resetPayments = useCallback(() => {
    setSelectedPayments([]);
    setCurrentAmount("");
    setActivePaymentIndex(-1);
    setIsProcessing(false);
  }, []);

  return {
    paymentMethods,
    selectedPayments,
    currentAmount,
    isProcessing,
    activePaymentIndex,
    getTotalPaidAmount,
    getRemainingAmount,
    handlePaymentMethodSelect,
    setActivePaymentIndex,
    setCurrentAmount,
    handleAmountInput,
    handleQuickAmount,
    removePaymentMethod,
    handleComplete,
    resetPayments,
    editedAmount,
    setEditedAmount,
  };
}
