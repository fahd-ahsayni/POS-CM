import { closeShift } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/slices/authentication/auth.slice";
import { fetchOrders } from "@/store/slices/data/orders.slice";
import { User } from "@/types/user.types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

interface PaymentAmount {
  payment_method: string;
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
  const dispatch = useDispatch<AppDispatch>();
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
  const [isLoading, setIsLoading] = useState(false);

  const availableCashiers: User[] = (() => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    return users.cashiers || [];
  })();

  const orders = useSelector((state: RootState) => state.orders.orders);

  const paymentMethods: PaymentMethod[] =
    JSON.parse(localStorage.getItem("generalData") || "{}")?.paymentMethods ||
    [];

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  useEffect(() => {
    const hasNewOrder = Array.isArray(orders)
      ? orders.some((order) => order.status === "new")
      : false;
    setRequiredNextCashier(hasNewOrder);
  }, [orders]);

  const handleAmountChange = (methodId: string, value: string) => {
    const cleanValue = value.replace(/[^\d.]/g, "");
    const numericValue = cleanValue === "" ? 0 : parseFloat(cleanValue);

    setPaymentAmounts((prev) => ({
      ...prev,
      [methodId]: isNaN(numericValue) ? 0 : numericValue,
    }));
  };

  const handleCurrencyQuantityChange = (
    denomination: number,
    value: string | number | null
  ) => {
    const numericValue = value === null || value === "" ? 0 : Number(value);
    const newQuantity = isNaN(numericValue) ? 0 : numericValue;

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
      .filter(([_, amount]) => amount !== null && !isNaN(amount))
      .map(([_id, amount]) => ({
        payment_method: _id,
        cashier_amount: Number(amount),
      }));
  };

  const validateForm = (): boolean => {
    const hasCashAmount = paymentMethods
      .filter((method) => method.is_cash)
      .some((method) => paymentAmounts[method._id]);

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

    setIsLoading(true);
    try {
      const data = {
        next_cashier: selectedCashier?._id,
        shift_id: localStorage.getItem("shiftId"),
        closing_amounts: getPaymentAmounts(),
      };

      const response = await closeShift(data);

      if (response.status === 200) {
        dispatch(logout());
        toast.success(
          createToast(
            "Shift closed successfully",
            "You have been logged out",
            "success"
          )
        );
      }
    } catch (error) {
      toast.error(
        createToast("Failed to close shift", "Please try again", "error")
      );
    } finally {
      setIsLoading(false);
    }
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

  const resetAllInputs = () => {
    setSelectedCashier(null);
    setPaymentAmounts({});
    setCurrencyQuantities({});
    setOpenCurrencyQuantity(false);
    setFocusedDenomination(null);
    setFocusedMethod(null);
    setSavedTotal(0);
  };

  useEffect(() => {
    if (!open) {
      resetAllInputs();
    }
  }, [open]);

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
    isLoading,
    availableCashiers,
    resetAllInputs,
  } as const;
};
