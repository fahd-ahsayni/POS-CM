import { useState } from "react";

export function useTableNumber() {
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [tableValid, setTableValid] = useState<"valid" | "invalid" | "not-found" | "">("");

  const handleNumberClick = (number: string) => {
    setTableNumber(number);
    // Example validation logic: Check if the number is a valid table number
    if (number.match(/^\d+$/)) { // Assuming valid table numbers are numeric
      setTableValid("valid");
    } else {
      setTableValid("invalid");
    }
  };

  const handleConfirm = (number: string | null) => {
    if (number) {
      // Example logic: Confirm the table number if it's valid
      if (tableValid === "valid") {
        console.log(`Table number ${number} confirmed.`);
        // Additional logic to handle confirmed table number
      } else {
        console.log("Cannot confirm: Invalid table number.");
      }
    } else {
      console.log("No table number to confirm.");
    }
  };

  const handleCancel = () => {
    setTableNumber(null);
    setTableValid("");
  };

  const getValidationMessage = () => {
    switch (tableValid) {
      case "invalid":
        return "Invalid table number";
      case "not-found":
        return "Table not found";
      default:
        return "";
    }
  };

  return {
    tableNumber,
    tableValid,
    handleNumberClick,
    handleConfirm,
    handleCancel,
    getValidationMessage,
  };
}
