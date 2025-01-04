import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCoasterCall } from "@/store/slices/order/createOrder";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { ORDER_SUMMARY_VIEW } from "@/components/views/home/right-section/constants";

export const useCoasterCall = () => {
  const [number, setNumber] = useState("");
  const dispatch = useDispatch();
  const { setViews } = useRightViewContext();

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setNumber("");
    } else if (value === "delete") {
      setNumber((prev) => prev.slice(0, -1));
    } else {
      setNumber((prev) => {
        const newValue = prev + value;
        if (parseInt(newValue) <= 999999) {
          return newValue;
        }
        return prev;
      });
    }
  };

  const handleSubmit = () => {
    if (number) {
      dispatch(setCoasterCall(number));
    }
  };

  return {
    number,
    handleNumberClick,
    handleSubmit,
  };
};
