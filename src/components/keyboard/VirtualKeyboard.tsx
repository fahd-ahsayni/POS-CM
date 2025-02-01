import {
  BackSpace,
  EnterButton,
  KeyboardClose,
  ShiftActive,
} from "@/assets/keyboard-icons";
import { cn } from "@/lib/utils";
import React, { ReactNode, useEffect, useRef, useState, useMemo } from "react";

interface Position {
  x: number;
  y: number;
}

interface KeyConfig {
  label: string | ReactNode;
  colSpan?: number; // Optional column span
  action: string | (() => void);
  textColor?: string;
  bgColor?: string;
}

interface VirtualKeyboardProps {
  onClose: () => void;
  onKeyPress: (key: string) => void;
  inputType: string | null;
  customLayout?: KeyConfig[][];
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onClose,
  onKeyPress,
  customLayout,
}) => {
  const [position, setPosition] = useState<Position>({ x: 90, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isShiftActive, setIsShiftActive] = useState(false); // Shift stays active until toggled
  const headerRef = useRef<HTMLDivElement>(null);

  const getDefaultLayout = useMemo<KeyConfig[][]>(() => {
    return [
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
        { label: "-", action: "-" },
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
          action: () => onKeyPress("\n"),
          textColor: "text-white",
          bgColor: "bg-primary-red",
        },
      ],
      [
        {
          label: <ShiftActive className="dark:text-white text-primary-black" />,
          colSpan: 2,
          action: () => setIsShiftActive((prev) => !prev),
          bgColor: "bg-neutral-bright-grey dark:bg-[#3F4042]",
        },
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
        { label: "@", colSpan: 2, action: "@" },
        { label: "", colSpan: 7, action: () => onKeyPress(" ") },
        {
          label: (
            <KeyboardClose className="dark:text-white text-primary-black size-6" />
          ),
          colSpan: 2,
          action: onClose,
          bgColor: "bg-neutral-bright-grey dark:bg-[#3F4042]",
        },
      ],
    ];
  }, [onKeyPress, onClose]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      headerRef.current &&
      (headerRef.current === e.target ||
        headerRef.current.contains(e.target as Node))
    ) {
      setIsDragging(true);
      setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleKeyPress = (key: KeyConfig) => {
    if (typeof key.action === "function") {
      key.action();
    } else {
      const activeElement = document.activeElement as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;

      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA")
      ) {
        const { selectionStart, selectionEnd, value } = activeElement;

        if (key.action === "Backspace") {
          if (selectionStart !== null && selectionEnd !== null) {
            if (selectionStart !== selectionEnd) {
              // Remove the selected text
              const newValue =
                value.substring(0, selectionStart) +
                value.substring(selectionEnd);
              activeElement.value = newValue;
              activeElement.setSelectionRange(selectionStart, selectionStart);
            } else if (selectionStart > 0) {
              // Remove one character before the cursor
              const newValue =
                value.substring(0, selectionStart - 1) +
                value.substring(selectionEnd);
              activeElement.value = newValue;
              activeElement.setSelectionRange(
                selectionStart - 1,
                selectionStart - 1
              );
            }

            // Dispatch an input event so React recognizes the change
            const event = new Event("input", { bubbles: true });
            activeElement.dispatchEvent(event);
          }
          return; // Stop further processing
        }
      }

      // Handle normal keypress behavior
      onKeyPress(
        isShiftActive && /^[a-z]$/.test(key.action)
          ? key.action.toUpperCase()
          : key.action
      );
    }
  };

  return (
    <div
      className={`fixed bg-secondary-white dark:bg-primary-black rounded-lg shadow-xl px-4 pb-4 select-none ${isDragging ? "opacity-70" : ""
        }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "667px",
        zIndex: 9999,
      }}
    >
      <div
        ref={headerRef}
        className="flex justify-center items-center py-4 cursor-move rounded-t-lg w-full"
        onMouseDown={handleMouseDown}
      >
        <div className="w-6 h-1 rounded-lg bg-secondary-black dark:bg-secondary-white" />
      </div>
      <div className="space-y-1.5">
        {(customLayout || getDefaultLayout).map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-11 gap-1.5">
            {row.map((key, keyIndex) => (
              <button
                key={keyIndex}
                onClick={() => handleKeyPress(key)}
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
                {isShiftActive && /^[a-z]$/.test(key.label as string)
                  ? (key.label as string).toUpperCase()
                  : key.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualKeyboard;
