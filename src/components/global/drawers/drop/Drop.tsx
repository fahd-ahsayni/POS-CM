import { useState, useRef } from "react";
import { currency } from "@/preferences";
import Drawer from "../layout/Drawer";
import InputComponent from "../../InputComponent";
import { Button } from "@/components/ui/button";
import { dropCash } from "@/api/services";
import { toast } from "react-toastify";
import { createToast } from "../../Toasters";
import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";

export default function Drop({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");
  const [activeInput, setActiveInput] = useState<"amount" | "comment" | null>(
    null
  );
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  // Refs for managing cursor positions
  const amountRef = useRef<HTMLInputElement | null>(null);
  const commentRef = useRef<HTMLInputElement | null>(null);

  // Virtual keyboard functions
  const { openKeyboard } = useVirtualKeyboard();

  // Handle input value updates with cursor tracking
  const updateInputValue = (
    field: "amount" | "comment",
    newValue: string,
    newPosition: number
  ) => {
    if (field === "amount") {
      setAmount(newValue);
    } else {
      setComment(newValue);
    }

    setCursorPosition(newPosition);
    const inputRef =
      field === "amount" ? amountRef.current : commentRef.current;
    if (inputRef) {
      setTimeout(() => {
        inputRef.setSelectionRange(newPosition, newPosition);
        inputRef.focus();
      }, 0);
    }
  };

  // Handle key press events
  const handleKeyPress = (key: string, cursorAdjustment: number) => {
    if (!activeInput) return;

    const currentValue = activeInput === "amount" ? amount : comment;
    let newValue = currentValue;
    let newPosition = cursorPosition;

    switch (key) {
      case "Backspace":
        if (cursorPosition > 0) {
          newValue =
            currentValue.slice(0, cursorPosition - 1) +
            currentValue.slice(cursorPosition);
          newPosition = cursorPosition - 1;
        }
        break;
      case "ArrowLeft":
        newPosition = Math.max(0, cursorPosition - 1);
        break;
      case "ArrowRight":
        newPosition = Math.min(currentValue.length, cursorPosition + 1);
        break;
      case "Delete":
        newValue = ""; // Clear the entire field
        newPosition = 0;
        break;
      default:
        newValue =
          currentValue.slice(0, cursorPosition) +
          key +
          currentValue.slice(cursorPosition);
        newPosition = cursorPosition + cursorAdjustment;
        break;
    }

    updateInputValue(activeInput, newValue, newPosition);
  };

  // Handle input focus
  const handleInputFocus = (field: "amount" | "comment") => {
    setActiveInput(field);
    openKeyboard(field, handleKeyPress);
    const inputRef =
      field === "amount" ? amountRef.current : commentRef.current;
    if (inputRef) {
      setCursorPosition(inputRef.selectionStart || 0);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!amount) {
      toast.warning(
        createToast(
          "Fields required",
          "Please fill in all required fields",
          "warning"
        )
      );
      return;
    }
    const data = {
      amount: parseFloat(amount),
      comment: comment,
      shift_id: localStorage.getItem("shiftId"),
    };
    await dropCash(data);
    toast.success(
      createToast(
        "Cash Drop registered",
        "Cash Drop registered successfully",
        "success"
      )
    );
    setOpen(false);
  };

  return (
    <Drawer open={open} setOpen={setOpen} title="Register a Cash Drop">
      <div className="flex flex-col gap-4 h-full relative">
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col gap-y-6 px-2">
            {/* Amount Input with Virtual Keyboard */}
            <InputComponent
              config={{
                label: "Total amount",
                type: "text",
                placeholder: "Enter the cash amount to drop",
                setValue: (value: string | number | null) =>
                  setAmount(value?.toString() || ""),
                value: amount,
                suffix: currency.currency,
                onFocus: () => handleInputFocus("amount"),
                onSelect: (e) => {
                  setCursorPosition(
                    (e.target as HTMLInputElement).selectionStart || 0
                  );
                },
                ref: amountRef,
              }}
            />

            {/* Comment Input with Virtual Keyboard */}
            <InputComponent
              config={{
                label: "Comment",
                type: "text",
                placeholder: "Add a description or reason for the drop",
                setValue: (value: string | number | null) =>
                  setComment(value?.toString() || ""),
                value: comment,
                onFocus: () => handleInputFocus("comment"),
                onSelect: (e) => {
                  setCursorPosition(
                    (e.target as HTMLInputElement).selectionStart || 0
                  );
                },
                ref: commentRef,
              }}
            />
          </div>
          <div className="w-full absolute bottom-0 px-2">
            <Button className="w-full" onClick={handleSubmit}>
              Submit Cash Drop
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
