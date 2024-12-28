import { closeShift } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { RootState } from "@/store";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface PaymentAmount {
  cm_payment_method: string;
  cashier_amount: number;
}

interface PaymentMethod {
  _id: string;
  name: string;
  image: string | null;
  in_situation: boolean;
  is_tpe: boolean;
  is_cash: boolean;
  is_cmi: boolean;
  parent_id: string | null;
  children: PaymentMethod[];
}

export const useCloseShift = () => {
  const [selectedCashier, setSelectedCashier] = useState<User | null>(null);
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, number>>(
    {}
  );
  const [requiredNextCashier, setRequiredNextCashier] =
    useState<boolean>(false);
  const [openCurrencyQuantity, setOpenCurrencyQuantity] =
    useState<boolean>(false);
  const [currencyQuantities, setCurrencyQuantities] = useState<
    Record<number, number>
  >({});
  const [focusedDenomination, setFocusedDenomination] = useState<number | null>(
    null
  );
  const [focusedMethod, setFocusedMethod] = useState<string | null>(null);
  const [savedTotal, setSavedTotal] = useState<number>(0);

  const orders = useSelector((state: RootState) => state.orders.orders);

  const paymentMethods: PaymentMethod[] =
    JSON.parse(localStorage.getItem("generalData") || "{}")?.paymentMethods ||
    [];

  useEffect(() => {
    const hasNewOrder = orders.some((order) => order.status === "new");
    setRequiredNextCashier(hasNewOrder);
  }, [orders]);

  const handleAmountChange = (methodId: string, value: string) => {
    setPaymentAmounts((prev) => ({
      ...prev,
      [methodId]: Number(value),
    }));
  };

  const handleCurrencyQuantityChange = (
    denomination: number,
    value: string | number | null
  ) => {
    const newQuantity = Number(value) || 0;

    const updatedQuantities = {
      ...currencyQuantities,
      [denomination]: newQuantity,
    };
    setCurrencyQuantities(updatedQuantities);

    const cashMethod = paymentMethods.find((method) => method.is_cash);
    if (cashMethod) {
      const newTotal = Object.entries(updatedQuantities).reduce(
        (total, [denom, qty]) => {
          return total + Number(denom) * Number(qty);
        },
        0
      );

      setSavedTotal(newTotal);
      setFocusedMethod(cashMethod._id);
      handleAmountChange(cashMethod._id, newTotal.toString());
    }

    setFocusedDenomination(denomination);
  };

  const handleCurrencyIconClick = () => {
    setOpenCurrencyQuantity(!openCurrencyQuantity);
    const cashMethod = paymentMethods.find((method) => method.is_cash);
    if (cashMethod) {
      setFocusedMethod(cashMethod._id);
    }
  };

  const getPaymentAmounts = (): PaymentAmount[] => {
    return Object.entries(paymentAmounts)
      .filter(([_, amount]) => amount !== null && amount !== 0)
      .map(([_id, amount]) => {
        return {
          cm_payment_method: _id,
          cashier_amount: amount,
        };
      });
  };

  const validateForm = (): boolean => {
    const hasCashAmount = paymentMethods
      .filter((method) => method.is_cash)
      .some((method) => paymentAmounts[method._id]);

    if (!hasCashAmount) {
      toast.error(createToast("Please enter the cash amount", "...", "error"));
      return false;
    }

    if (requiredNextCashier && !selectedCashier) {
      toast.error(
        createToast(
          "Please select the next cashier",
          "There is a new order",
          "error"
        )
      );
      return false;
    }

    return true;
  };

  const handleCloseShift = async () => {
    if (!validateForm()) return;

    const data = {
      next_cashier: selectedCashier?._id,
      shift_id: localStorage.getItem("shiftId"),
      closing_amounts: getPaymentAmounts(),
    };

    console.log(data);

    const response = await closeShift(data);
    return response;
  };

  const handleReset = () => {
    setCurrencyQuantities({});
    const cashMethod = paymentMethods.find((method) => method.is_cash);
    if (cashMethod) {
      handleAmountChange(cashMethod._id, "0");
    }
  };

  const handleValidate = () => {
    const cashMethod = paymentMethods.find((method) => method.is_cash);
    if (cashMethod) {
      setPaymentAmounts((prev) => ({
        ...prev,
        [cashMethod._id]: savedTotal,
      }));
    }

    setCurrencyQuantities({});
    setOpenCurrencyQuantity(false);
  };

  return {
    selectedCashier,
    setSelectedCashier,
    paymentAmounts,
    requiredNextCashier,
    openCurrencyQuantity,
    setOpenCurrencyQuantity,
    currencyQuantities,
    focusedDenomination,
    focusedMethod,
    setFocusedMethod,
    paymentMethods,
    handleAmountChange,
    handleCurrencyQuantityChange,
    handleCurrencyIconClick,
    handleCloseShift,
    handleReset,
    handleValidate,
  } as const;
};
