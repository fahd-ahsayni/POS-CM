import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react";

interface VirtualKeyboardGlobalContextProps {
  showKeyboard: boolean;
  activeInput: string | null;
  onKeyPress: ((key: string, cursorAdjustment: number) => void) | null; // Add onKeyPress here
  openKeyboard: (activeInput: string, onKeyPress: (key: string, cursorAdjustment: number) => void) => void;
  closeKeyboard: () => void;
}

const VirtualKeyboardGlobalContext = createContext<VirtualKeyboardGlobalContextProps | undefined>(undefined);

export const VirtualKeyboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [keyPressCallback, setKeyPressCallback] = useState<((key: string, cursorAdjustment: number) => void) | null>(
    null
  );

  const openKeyboard = useCallback(
    (activeInput: string, onKeyPress: (key: string, cursorAdjustment: number) => void) => {
      setActiveInput(activeInput);
      setKeyPressCallback(() => onKeyPress);
      setShowKeyboard(true);
    },
    []
  );

  const closeKeyboard = useCallback(() => {
    setShowKeyboard(false);
    setActiveInput(null);
    setKeyPressCallback(null);
  }, []);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (keyPressCallback) {
        let cursorAdjustment = 0;

        if (key === "Backspace") {
          cursorAdjustment = -1;
        } else {
          cursorAdjustment = key.length;
        }

        keyPressCallback(key, cursorAdjustment);
      }
    },
    [keyPressCallback]
  );

  const contextValue = useMemo(
    () => ({
      showKeyboard,
      activeInput,
      onKeyPress: handleKeyPress, // Include onKeyPress in the context value
      openKeyboard,
      closeKeyboard,
    }),
    [showKeyboard, activeInput, handleKeyPress, openKeyboard, closeKeyboard]
  );

  return <VirtualKeyboardGlobalContext.Provider value={contextValue}>{children}</VirtualKeyboardGlobalContext.Provider>;
};

export const useVirtualKeyboard = () => {
  const context = useContext(VirtualKeyboardGlobalContext);
  if (!context) {
    throw new Error("useVirtualKeyboard must be used within a VirtualKeyboardProvider");
  }
  return context;
};