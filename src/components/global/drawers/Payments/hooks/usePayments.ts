import { createPayment } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { TYPE_OF_ORDER_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { useCustomerManagement } from "@/components/views/home/right-section/hooks/useCustomerManagement";
import { currency } from "@/preferences";
import { selectOrder, resetOrder } from "@/store/slices/order/create-order.slice";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNumberOfTable } from "@/components/views/home/right-section/hooks/useNumberOfTable";
import { useCoasterCall } from "@/components/views/home/right-section/hooks/useCoasterCall";

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
}

/**
 * Custom hook to manage payment methods and calculations
 * @param onComplete - Callback function called when payments are completed
 */
export function usePayments({ onComplete }: UsePaymentsProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<PaymentMethod[]>([]);
  const [currentAmount, setCurrentAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activePaymentIndex, setActivePaymentIndex] = useState<number>(-1);

  const { handlePaymentComplete } = useCustomerManagement();
  const { setViews: setViewsRight } = useRightViewContext();
  const { setViews: setViewsLeft } = useLeftViewContext();

  const order = useSelector(selectOrder);
  const dispatch = useDispatch();

  const { setTableNumber } = useNumberOfTable();
  const { setNumber } = useCoasterCall();

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
    return Number((order.total_amount - getTotalPaidAmount()).toFixed(2));
  }, [order.total_amount, getTotalPaidAmount]);

  const handlePaymentMethodSelect = useCallback(
    (method: PaymentMethod, initialAmount?: string) => {
      const remainingAmount = getRemainingAmount();
      const currentTotalPaid = getTotalPaidAmount();

      if (currentTotalPaid < order.total_amount) {
        const newPayment = {
          ...method,
          _id: `${method._id}_${Date.now()}`,
          originalId: method._id,
          amount: initialAmount ? parseFloat(initialAmount) : remainingAmount,
        };

        setSelectedPayments((prev) => [...prev, newPayment]);
        setActivePaymentIndex((prev) => prev + 1);
        setCurrentAmount(initialAmount || remainingAmount.toString());
      } else {
        toast.info(
          createToast(
            "Payment completed",
            "You have already paid the full amount",
            "info"
          )
        );
      }
    },
    [getRemainingAmount, getTotalPaidAmount, order.total_amount]
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
        toast.error("Please select a payment method first");
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
        toast.error("Please select a payment method first");
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

    setIsProcessing(true);

    try {
      // 1. Process the payment
      const validPaymentData = selectedPayments.map((item) => ({
        payment_method_id: item.originalId,
        amount_given: item.amount,
      }));
      if (order.shift_id) {
        await createPayment({
          order: order,
          shift_id: order.shift_id,
          payments: validPaymentData,
        });
      } else {
        await createPayment({
          order: {
            ...order,
            shift_id: localStorage.getItem("shiftId"),
          },
          shift_id: localStorage.getItem("shiftId"),
          payments: validPaymentData,
        });
      }

      // 2. Call the onComplete callback if provided
      await onComplete?.(selectedPayments);

      // 3. Reset payment-related state
      setSelectedPayments([]);
      setCurrentAmount("");
      setActivePaymentIndex(-1);
      localStorage.removeItem("orderType");

      // 4. Reset customer and order state using the customer management hook
      handlePaymentComplete();

      // 5. Reset order state but keep shift_id
      dispatch(resetOrder());

      // 6. Reset views to initial state
      setViewsLeft(ALL_CATEGORIES_VIEW);
      setViewsRight(TYPE_OF_ORDER_VIEW);

      // 7. Show success message
      toast.success(
        createToast(
          "Payment completed successfully",
          `Total paid: ${getTotalPaidAmount().toFixed(currency.toFixed || 2)} ${
            currency.symbol
          }`,
          "success"
        )
      );

      // Reset table number and coaster call
      setTableNumber("");
      setNumber("");

    } catch (error) {
      toast.error(
        createToast(
          "Failed to process payment",
          "Check your payment details and try again or contact support",
          "error"
        )
      );
    } finally {
      setIsProcessing(false);
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
    dispatch,
    setTableNumber,
    setNumber,
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
  };
}
