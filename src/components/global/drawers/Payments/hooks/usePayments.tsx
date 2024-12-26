import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectOrder } from "@/store/slices/order/createOrder";
import { toast } from "sonner";

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
  onComplete?: (payments: PaymentMethod[]) => void;
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

  const order = useSelector(selectOrder);

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

  const handlePaymentMethodSelect = useCallback(
    (method: PaymentMethod, initialAmount?: string) => {
      const newPayment = {
        ...method,
        _id: `${method._id}_${Date.now()}`,
        originalId: method._id,
        amount: initialAmount ? parseFloat(initialAmount) : getRemainingAmount(), // Assign initial amount here
      };

      setSelectedPayments((prev) => [...prev, newPayment]);
      setActivePaymentIndex((prev) => prev + 1);
      setCurrentAmount(initialAmount || ""); // Reflect the initial amount
    },
    []
  );

  const handleAmountInput = useCallback(
    (value: string) => {
      // Case 1: First input with no selected payment
      if (paymentMethods.length > 0 && selectedPayments.length === 0) {
        const firstMethod = paymentMethods[0];
        handlePaymentMethodSelect(firstMethod, value);
        return;
      }

      // Case 2: No active payment selected
      if (activePaymentIndex === -1) {
        toast.error("Please select a payment method first");
        return;
      }

      // Case 3: Normal input handling
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

  const getTotalPaidAmount = useCallback(() => {
    return selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [selectedPayments]);

  const getRemainingAmount = useCallback(() => {
    return Number((order.total_amount - getTotalPaidAmount()).toFixed(2));
  }, [order.total_amount, getTotalPaidAmount]);

  const handleComplete = useCallback(async () => {
    setIsProcessing(true);
    try {
      console.log('=== Payment Summary ===');
      console.log('Selected Payments:', selectedPayments);
      console.log('Total Amount:', order.total_amount);
      console.log('Total Paid:', getTotalPaidAmount());
      console.log('Remaining Amount:', getRemainingAmount());
      console.log('Payment Methods Details:', selectedPayments.map(payment => ({
        id: payment._id,
        originalId: payment.originalId,
        name: payment.name,
        amount: payment.amount
      })));

      await onComplete?.(selectedPayments);
      setSelectedPayments([]);
      setCurrentAmount("");
      setActivePaymentIndex(-1);
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  }, [selectedPayments, onComplete, order.total_amount, getTotalPaidAmount, getRemainingAmount]);

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
