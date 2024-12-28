import { useEffect, useState } from "react";

interface UseNumberPadProps {
  maxValue?: number;
  initialValue?: string;
  onValidityChange?: (isValid: boolean) => void;
}

interface UseNumberPadReturn {
  number: string;
  valid: string;
  setValid: (status: string) => void;
  handleNumberClick: (value: string) => void;
  resetNumber: () => void;
}

export function useNumberPad({
  maxValue = 999999,
  initialValue = "",
  onValidityChange,
}: UseNumberPadProps = {}): UseNumberPadReturn {
  const [number, setNumber] = useState(initialValue);
  const [valid, setValid] = useState<string>("valid");

  useEffect(() => {
    setValid("valid");
    onValidityChange?.(true);
  }, [number, onValidityChange]);

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setNumber("");
    } else if (value === "delete") {
      setNumber((prev) => prev.slice(0, -1));
    } else {
      setNumber((prev) => {
        const newValue = prev + value;
        return parseInt(newValue) <= maxValue ? newValue : prev;
      });
    }
  };

  const resetNumber = () => {
    setNumber("");
    setValid("valid");
  };

  return {
    number,
    valid,
    setValid,
    handleNumberClick,
    resetNumber,
  };
}
