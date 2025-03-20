import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { BackSpace, EnterButton, KeyboardClose } from "@/assets/keyboard-icons";
import { cn } from "@/lib/utils";
import { useVirtualKeyboard } from "./VirtualKeyboardGlobalContext";

interface Position {
  x: number;
  y: number;
}

export interface KeyConfig {
  label: string | React.ReactNode;
  colSpan?: number;
  action: string | (() => void);
  textColor?: string;
  bgColor?: string;
}

interface VirtualKeyboardProps {
  onClose: () => void;
  onKeyPress: (key: string, cursorAdjustment: number) => void;
  inputType: string | null;
  customLayout?: KeyConfig[][];
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onClose,
  onKeyPress,
  customLayout,
}) => {
  const [isShiftActive, setIsShiftActive] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 90, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const headerRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<HTMLDivElement | null>(null);
  
  // Get the cursor position from context
  const { cursorPosition } = useVirtualKeyboard();
  
  // Debounce and throttle controls
  const keyPressQueue = useRef<{key: string, adjustment: number}[]>([]);
  const isProcessingQueue = useRef(false);
  const lastKeyPressTime = useRef<number>(0);
  const keyPressThrottleMs = 25; // Minimum ms between keypresses

  // Function to process keypress queue with throttling
  const processKeyPressQueue = useCallback(() => {
    if (keyPressQueue.current.length === 0) {
      isProcessingQueue.current = false;
      return;
    }
    
    isProcessingQueue.current = true;
    const currentTime = Date.now();
    
    // Enforce minimum time between keypresses
    if (currentTime - lastKeyPressTime.current < keyPressThrottleMs) {
      setTimeout(processKeyPressQueue, keyPressThrottleMs);
      return;
    }
    
    const { key, adjustment } = keyPressQueue.current.shift()!;
    lastKeyPressTime.current = currentTime;
    
    // Process the key press
    onKeyPress(key, adjustment);
    
    // Schedule next key processing
    setTimeout(processKeyPressQueue, keyPressThrottleMs);
  }, [onKeyPress]);

  // Only close keyboard when clicking outside, but ignore clicks on input elements
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't close keyboard when clicking on input elements
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      // Check if click is outside the keyboard
      if (keyboardRef.current && !keyboardRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  // Mouse Drag Handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        headerRef.current &&
        (headerRef.current === e.target ||
          headerRef.current.contains(e.target as Node))
      ) {
        setIsDragging(true);
        setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
        e.preventDefault();
      }
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Clamp position within viewport boundaries
        const clampedX = Math.max(0, Math.min(window.innerWidth - 667, newX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - 300, newY));

        setPosition({ x: clampedX, y: clampedY });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch Drag Handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (
        headerRef.current &&
        (headerRef.current === e.target ||
          headerRef.current.contains(e.target as Node))
      ) {
        const touch = e.touches[0];
        setIsDragging(true);
        setDragOffset({
          x: touch.clientX - position.x,
          y: touch.clientY - position.y,
        });
        e.preventDefault();
      }
    },
    [position]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;

        // Clamp position within viewport boundaries
        const clampedX = Math.max(0, Math.min(window.innerWidth - 667, newX));
        const clampedY = Math.max(0, Math.min(window.innerHeight - 300, newY));

        setPosition({ x: clampedX, y: clampedY });
      }
    },
    [isDragging, dragOffset]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/Remove Event Listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const defaultLayout = useMemo<KeyConfig[][]>(
    () => [
      [
        { label: "1", action: "1" },
        { label: "2", action: "2" },
        { label: "3", action: "3" },
        { label: "4", action: "4" },
        { label: "5", action: "5" },
        { label: "6", action: "6" },
        { label: "7", action: "7" },
        { label: "8", action: "8" },
        { label: "9", action: "9" },
        { label: "0", action: "0" },
        { label: "@", action: "@" },
      ],
      [
        { label: "q", action: "q" },
        { label: "w", action: "w" },
        { label: "e", action: "e" },
        { label: "r", action: "r" },
        { label: "t", action: "t" },
        { label: "y", action: "y" },
        { label: "u", action: "u" },
        { label: "i", action: "i" },
        { label: "o", action: "o" },
        { label: "p", action: "p" },
        {
          label: <BackSpace className="dark:text-white text-primary-black" />,
          action: "Backspace",
          bgColor: "bg-neutral-bright-grey dark:bg-[#3F4042]",
        },
      ],
      [
        { label: "a", action: "a" },
        { label: "s", action: "s" },
        { label: "d", action: "d" },
        { label: "f", action: "f" },
        { label: "g", action: "g" },
        { label: "h", action: "h" },
        { label: "j", action: "j" },
        { label: "k", action: "k" },
        { label: "l", action: "l" },
        {
          label: <EnterButton className="text-white" />,
          colSpan: 2,
          action: "\n",
          textColor: "text-white",
          bgColor: "bg-primary-red",
        },
      ],
      [
        { label: "_", action: "_" },
        { label: "-", action: "-" },
        { label: "z", action: "z" },
        { label: "x", action: "x" },
        { label: "c", action: "c" },
        { label: "v", action: "v" },
        { label: "b", action: "b" },
        { label: "n", action: "n" },
        { label: "m", action: "m" },
        { label: ",", action: "," },
        { label: ".", action: "." },
      ],
      [
        {
          label: "Delete",
          colSpan: 2,
          action: "Delete",
          textColor: "text-white",
          bgColor: "bg-primary-red",
        },
        { label: "", colSpan: 7, action: " " },
        {
          label: (
            <KeyboardClose className="dark:text-white text-primary-black size-6" />
          ),
          colSpan: 2,
          action: onClose,
          bgColor: "bg-neutral-bright-grey dark:bg-[#3F4042]",
        },
      ],
    ],
    [onClose]
  );

  const memoizedLayout = useMemo(
    () => customLayout || defaultLayout,
    [customLayout, defaultLayout]
  );

  // Optimized key press handler with improved queue processing
  const handleKeyPressInternal = useCallback(
    (action: string) => {
      let processedAction = action;

      if (isShiftActive && /^[a-z]$/.test(processedAction)) {
        processedAction = processedAction.toUpperCase();
        setIsShiftActive(false);
      }
      
      let adjustment = 1;
      if (processedAction === "Backspace") {
        adjustment = -1;
      } else if (processedAction === "ArrowLeft" || processedAction === "ArrowRight") {
        adjustment = 0; // No text insertion for arrow keys
      } else if (processedAction === "Delete") {
        adjustment = 0; // For Delete key (clear)
      }
      
      // Add to queue instead of processing immediately
      keyPressQueue.current.push({ key: processedAction, adjustment });
      
      // Start processing if not already doing so
      if (!isProcessingQueue.current) {
        processKeyPressQueue();
      }
    },
    [isShiftActive, processKeyPressQueue]
  );

  return (
    <div
      ref={keyboardRef}
      data-virtual-keyboard="true"
      data-cursor-position={cursorPosition}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{
        pointerEvents: "auto",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "667px",
        zIndex: 9999,
      }}
      className="fixed bg-secondary-white dark:bg-primary-black rounded-lg shadow-xl px-4 pb-4 select-none"
    >
      {/* Header for dragging */}
      <div
        ref={headerRef}
        className="flex justify-center items-center py-4 cursor-move rounded-t-lg w-full"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="w-6 h-1 rounded-lg bg-secondary-black dark:bg-secondary-white" />
      </div>
      {/* Keyboard layout */}
      <div className="space-y-1.5">
        {memoizedLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-11 gap-1.5">
            {row.map((key, keyIndex) => {
              const handleClick = () => {
                if (typeof key.action === "function") {
                  key.action();
                } else {
                  handleKeyPressInternal(key.action);
                }
              };

              return (
                <button
                  key={keyIndex}
                  onClick={handleClick}
                  className={cn(
                    "rounded-lg border border-border shadow active:shadow-none hover:scale-[0.96] duration-150 transition-all flex items-center justify-center font-medium h-12",
                    key.textColor || "text-primary-black dark:text-white",
                    key.bgColor ||
                      "bg-white dark:bg-[#646567] hover:bg-neutral-100",
                    key.colSpan ? `col-span-${key.colSpan}` : ""
                  )}
                  style={{
                    gridColumn: key.colSpan ? `span ${key.colSpan}` : "span 1",
                  }}
                >
                  {isShiftActive &&
                  typeof key.label === "string" &&
                  /^[a-z]$/.test(key.label)
                    ? key.label.toUpperCase()
                    : key.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(VirtualKeyboard);
