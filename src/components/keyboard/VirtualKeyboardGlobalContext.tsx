import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect, useRef } from "react";

interface VirtualKeyboardGlobalContextProps {
  showKeyboard: boolean;
  activeInput: string | null;
  onKeyPress: ((key: string, cursorAdjustment: number) => void) | null;
  openKeyboard: (
    activeInput: string, 
    onKeyPress: (key: string, cursorAdjustment: number) => void, 
    initialCursorPosition?: number
  ) => void;
  closeKeyboard: () => void;
  lastFocusedInput: string | null;
  focusIsChanging: boolean;
  setFocusIsChanging: (value: boolean) => void;
  cursorPosition: number;
  setCursorPosition: (position: number) => void;
  syncCursorPosition: (position: number) => void;
  lockKeyboard: () => void;
  unlockKeyboard: () => void;
}

const VirtualKeyboardGlobalContext = createContext<VirtualKeyboardGlobalContextProps | undefined>(undefined);

export const VirtualKeyboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [lastFocusedInput, setLastFocusedInput] = useState<string | null>(null);
  const [focusIsChanging, setFocusIsChanging] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [keyboardLocked, setKeyboardLocked] = useState(false);
  const pendingOperationsRef = useRef<boolean>(false);
  const keyPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [keyPressCallback, setKeyPressCallback] = useState<((key: string, cursorAdjustment: number) => void) | null>(
    null
  );

  // Lock keyboard to prevent it from closing during operations
  const lockKeyboard = useCallback(() => {
    setKeyboardLocked(true);
  }, []);

  // Unlock keyboard
  const unlockKeyboard = useCallback(() => {
    setKeyboardLocked(false);
  }, []);

  // Modified openKeyboard with immediate cursor positioning
  const openKeyboard = useCallback(
    (
      activeInput: string, 
      onKeyPress: (key: string, cursorAdjustment: number) => void,
      initialCursorPosition?: number
    ) => {
      setActiveInput(activeInput);
      setLastFocusedInput(activeInput);
      setKeyPressCallback(() => onKeyPress);
      setShowKeyboard(true);
      
      if (initialCursorPosition !== undefined) {
        setCursorPosition(initialCursorPosition);
      }
      
      // Cancel any pending keypress timeouts
      if (keyPressTimeoutRef.current) {
        clearTimeout(keyPressTimeoutRef.current);
        keyPressTimeoutRef.current = null;
      }
    },
    []
  );

  // Improved closeKeyboard that respects locks
  const closeKeyboard = useCallback(() => {
    // Don't close keyboard if focus is changing between inputs
    if (focusIsChanging) return;
    
    // Don't close keyboard if locked
    if (keyboardLocked) return;
    
    // Don't close keyboard if there are pending operations
    if (pendingOperationsRef.current) return;
    
    setShowKeyboard(false);
    setActiveInput(null);
    setKeyPressCallback(null);
  }, [focusIsChanging, keyboardLocked]);

  // Sync cursor position with improved error handling
  const syncCursorPosition = useCallback((position: number) => {
    if (position < 0) position = 0;
    setCursorPosition(position);
  }, []);

  // Ensure keyboard doesn't close unexpectedly
  useEffect(() => {
    if (activeInput && !showKeyboard && !keyboardLocked) {
      setShowKeyboard(true);
    }
  }, [activeInput, showKeyboard, keyboardLocked]);

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
        
        // If focused input has data-cursor-position attribute, read from it
        if (target instanceof HTMLInputElement && target.dataset.cursorPosition) {
          const pos = parseInt(target.dataset.cursorPosition, 10);
          if (!isNaN(pos)) {
            setCursorPosition(pos);
          } else {
            // If no valid position, use selection
            setCursorPosition(target.selectionStart || 0);
          }
        }
        
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

  // Detect when active input changes to reset state appropriately
  useEffect(() => {
    if (activeInput) {
      // Clear any queued operations when switching between fields
      if (keyPressTimeoutRef.current) {
        clearTimeout(keyPressTimeoutRef.current);
        keyPressTimeoutRef.current = null;
      }
      
      // Mark that focus is changing to prevent keyboard closing
      setFocusIsChanging(true);
      
      // Reset after a short delay
      setTimeout(() => {
        setFocusIsChanging(false);
      }, 100);
    }
  }, [activeInput]);

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
      cursorPosition,
      setCursorPosition,
      syncCursorPosition,
      lockKeyboard,
      unlockKeyboard,
    }),
    [
      showKeyboard, activeInput, keyPressCallback, openKeyboard, 
      closeKeyboard, lastFocusedInput, focusIsChanging, setFocusIsChanging,
      cursorPosition, setCursorPosition, syncCursorPosition,
      lockKeyboard, unlockKeyboard
    ]
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