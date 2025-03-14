import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react";

interface VirtualKeyboardGlobalContextProps {
  showKeyboard: boolean;
  activeInput: string | null;
  onKeyPress: ((key: string, cursorAdjustment: number) => void) | null;
  openKeyboard: (activeInput: string, onKeyPress: (key: string, cursorAdjustment: number) => void) => void;
  closeKeyboard: () => void;
  lastFocusedInput: string | null;
  focusIsChanging: boolean;
  setFocusIsChanging: (value: boolean) => void;
}

const VirtualKeyboardGlobalContext = createContext<VirtualKeyboardGlobalContextProps | undefined>(undefined);

export const VirtualKeyboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [lastFocusedInput, setLastFocusedInput] = useState<string | null>(null);
  const [focusIsChanging, setFocusIsChanging] = useState(false);
  const [keyPressCallback, setKeyPressCallback] = useState<((key: string, cursorAdjustment: number) => void) | null>(
    null
  );

  const openKeyboard = useCallback(
    (activeInput: string, onKeyPress: (key: string, cursorAdjustment: number) => void) => {
      setActiveInput(activeInput);
      setLastFocusedInput(activeInput);
      setKeyPressCallback(() => onKeyPress);
      setShowKeyboard(true);
    },
    []
  );

  const closeKeyboard = useCallback(() => {
    // Don't close keyboard if focus is changing between inputs
    if (focusIsChanging) return;
    
    setShowKeyboard(false);
    setActiveInput(null);
    setKeyPressCallback(null);
  }, [focusIsChanging]);

  // Ensure keyboard doesn't close unexpectedly
  useEffect(() => {
    if (activeInput && !showKeyboard) {
      setShowKeyboard(true);
    }
  }, [activeInput, showKeyboard]);

  // Detect focus events on inputs to keep keyboard open
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      
      // Only handle focus on input elements
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        // Signal that focus is changing to prevent keyboard closing
        setFocusIsChanging(true);
        
        // Reset after a short delay
        setTimeout(() => {
          setFocusIsChanging(false);
        }, 200);
      }
    };
    
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, []);

  const handleKeyPress = useCallback(
    (key: string, cursorAdjustment: number) => {
      if (keyPressCallback) {
        keyPressCallback(key, cursorAdjustment);
      }
    },
    [keyPressCallback]
  );

  const contextValue = useMemo(
    () => ({
      showKeyboard,
      activeInput,
      onKeyPress: keyPressCallback,
      openKeyboard,
      closeKeyboard,
      lastFocusedInput,
      focusIsChanging,
      setFocusIsChanging,
    }),
    [showKeyboard, activeInput, keyPressCallback, openKeyboard, 
     closeKeyboard, lastFocusedInput, focusIsChanging, setFocusIsChanging]
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