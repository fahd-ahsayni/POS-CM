import { checkIsNewOrders, closeShift, logoutService } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { AppDispatch } from "@/store";
import { fetchOrders } from "@/store/slices/data/orders.slice";
import { User } from "@/interfaces/user";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCashier, setSelectedCashier] = useState<User | null>(null);
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, number>>(
    {}
  );

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

  const paymentMethods: PaymentMethod[] =
    JSON.parse(localStorage.getItem("generalData") || "{}")?.paymentMethods ||
    [];

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

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
    // Ensure all payment methods have a value, defaulting to 0 if empty
    return paymentMethods.map(method => ({
      payment_method: method._id,
      cashier_amount: Number(paymentAmounts[method._id]) || 0
    }));
  };

  const validateForm = async (): Promise<boolean> => {
    const response = await checkIsNewOrders(
      localStorage.getItem("shiftId") || ""
    );
    if (!selectedCashier && response.data.newOrder) {
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
    if (!(await validateForm())) return;

    setIsLoading(true);
    try {
      const data = {
        next_cashier: selectedCashier?._id,
        shift_id: localStorage.getItem("shiftId"),
        closing_amounts: getPaymentAmounts(),
      };

      const response = await closeShift(data);

      if (response.status === 200) {
        localStorage.clear();
        logoutService();
        navigate("/login");
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
