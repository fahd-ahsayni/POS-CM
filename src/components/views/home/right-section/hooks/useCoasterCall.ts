import { selectOrder, setCoasterCall } from "@/store/slices/order/create-order.slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useCoasterCall = () => {
  const dispatch = useDispatch();
  const orderState = useSelector(selectOrder);
  const [number, setNumber] = useState(orderState.coaster_call || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setNumber("");
      dispatch(setCoasterCall(null));
    } else if (value === "delete") {
      const newValue = number.slice(0, -1);
      setNumber(newValue);
      dispatch(setCoasterCall(newValue || null));
    } else {
      const newValue = number + value;
      if (parseInt(newValue) <= 999999) {
        setNumber(newValue);
        dispatch(setCoasterCall(newValue));
      }
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Error confirming coaster call:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    number,
    setNumber,
    handleNumberClick,
    isLoading,
    handleConfirm,
  };
};
