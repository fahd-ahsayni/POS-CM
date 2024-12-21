import React, { createContext, useState, useContext, useCallback } from "react";

// Keyboard Context
interface KeyboardContextProps {
  isOpen: boolean;
  isShiftActive: boolean;
  isNumbersVisible: boolean;
  toggleKeyboard: () => void;
  toggleShift: () => void;
  handleKeyPress: (label: string) => void;
  inputRef: React.RefObject<HTMLInputElement> | null;
  setInputRef: (ref: React.RefObject<HTMLInputElement> | null) => void;
}

const KeyboardContext = createContext<KeyboardContextProps | undefined>(
  undefined
);

// Keyboard Provider
export const KeyboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [isNumbersVisible, setIsNumbersVisible] = useState(false);
  const [inputRef, setInputRef] =
    useState<React.RefObject<HTMLInputElement> | null>(null);

  const toggleKeyboard = useCallback(() => {
    setIsOpen(true);
  }, []);

  const toggleShift = useCallback(() => {
    setIsShiftActive((prev) => !prev);
  }, []);

  const handleKeyPress = useCallback(
    (label: string) => {
      if (!inputRef?.current) return;

      if (label === "toggle") {
        toggleKeyboard();
        return;
      }

      if (label === "123") {
        setIsNumbersVisible((prev) => !prev);
        return;
      }

      if (label.toLowerCase() === "shift") {
        toggleShift();
        return;
      }

      if (label === "delete") {
        const start = inputRef.current.selectionStart;
        const end = inputRef.current.selectionEnd;
        const value = inputRef.current.value;

        if (start === end && start !== null) {
          inputRef.current.value =
            value.slice(0, start - 1) + value.slice(start);
          inputRef.current.setSelectionRange(start - 1, start - 1);
          // Trigger input event
          const event = new Event("input", { bubbles: true });
          inputRef.current.dispatchEvent(event);
        } else if (start !== null && end !== null) {
          inputRef.current.value = value.slice(0, start) + value.slice(end);
          inputRef.current.setSelectionRange(start, start);
        }
        return;
      }

      // For number inputs, only allow numeric values
      if (inputRef.current.type === "number") {
        if (!/^\d$/.test(label)) return; // Only allow single digits
      }

      const output =
        label === "space"
          ? " "
          : label === "-"
          ? isShiftActive
            ? "_"
            : "-"
          : isShiftActive
          ? label.toUpperCase()
          : label.toLowerCase();

      const start = inputRef.current.selectionStart ?? 0;
      const end = inputRef.current.selectionEnd ?? 0;
      const value = inputRef.current.value;

      // Insert the character at the cursor position
      const newValue = value.slice(0, start) + output + value.slice(end);
      inputRef.current.value = newValue;

      // Move cursor after the inserted character
      const newPosition = start + output.length;
      inputRef.current.setSelectionRange(newPosition, newPosition);
    },
    [isShiftActive, toggleKeyboard, toggleShift]
  );

  return (
    <KeyboardContext.Provider
      value={{
        isOpen,
        isShiftActive,
        isNumbersVisible,
        toggleKeyboard,
        toggleShift,
        handleKeyPress,
        inputRef,
        setInputRef,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};

// Hook to use Keyboard Context
export const useKeyboard = (): KeyboardContextProps => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboard must be used within a KeyboardProvider");
  }
  return context;
};
