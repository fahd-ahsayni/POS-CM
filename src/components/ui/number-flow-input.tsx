"use client";
import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext"; // <-- new import
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";
import * as React from "react";

type Props = {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  className?: string;
};

export function Input({
  value = 0,
  min = -Infinity,
  max = Infinity,
  onChange,
  className,
}: Props) {
  const defaultValue = React.useRef(value);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(String(value));

  const { openKeyboard } = useVirtualKeyboard(); // <-- grab context methods

  React.useEffect(() => {
    if (!isEditing) {
      setInputValue(String(value));
    }
  }, [value, isEditing]);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: el,
  }) => {
    setInputValue(el.value);

    if (el.value === "") {
      onChange?.(defaultValue.current);
      return;
    }

    const num = parseInt(el.value);
    if (!isNaN(num)) {
      if ((min != null && num < min) || (max != null && num > max)) {
        setInputValue(String(value));
      } else {
        onChange?.(num);
      }
    }
  };

  // New callback to handle virtual keyboard input using functional state update
  const handleVirtualKeyPress = React.useCallback(
    (key: string, _cursorAdjustment: number) => {
      setInputValue((prev) => {
        let newInput = prev;
        if (key === "Backspace") {
          newInput = prev.slice(0, -1);
        } else if (key === "Delete") {
          newInput = "";
        } else if (key === "\n") {
          // Do nothing for enter key
          return prev;
        } else {
          newInput = prev + key;
        }
        if (newInput === "") {
          onChange?.(defaultValue.current);
          return newInput;
        }
        const num = parseInt(newInput);
        if (!isNaN(num)) {
          if ((min != null && num < min) || (max != null && num > max)) {
            return String(value);
          } else {
            onChange?.(num);
            return newInput;
          }
        }
        return prev;
      });
    },
    [min, max, onChange, value]
  );

  const handleBlur = () => {
    setIsEditing(false);
    if (inputValue === "" || isNaN(parseInt(inputValue))) {
      setInputValue(String(value));
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
    openKeyboard("numberFlowInput", handleVirtualKeyPress); // <-- open keyboard with callback
  };

  const handlePointerDown =
    (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse") {
        event?.preventDefault();
      }
      const newVal = Math.min(Math.max(value + diff, min), max);
      onChange?.(newVal);
    };

  return (
    <div
      className={cn(
        "group flex items-stretch rounded-md text-base font-medium border border-border/50 w-fit bg-accent-white/10",
        className
      )}
    >
      <button
        aria-hidden
        tabIndex={-1}
        className="flex items-center pl-2 pr-1 hover:bg-accent-white/20 transition-colors"
        disabled={min != null && value <= min}
        onPointerDown={handlePointerDown(-1)}
      >
        <Minus className="size-3.5" absoluteStrokeWidth strokeWidth={2.5} />
      </button>
      <div className="relative grid items-center justify-items-center text-center">
        <input
          ref={inputRef}
          className={cn(
            "caret-primary",
            "spin-hide w-[2em] bg-transparent py-1.5 text-center font-[inherit] outline-none appearance-none text-inherit"
          )}
          style={{ fontKerning: "none" }}
          type="text"
          min={min}
          step={1}
          autoComplete="off"
          inputMode="numeric"
          max={max}
          value={inputValue}
          onInput={handleInput}
          onFocus={handleFocus} // <-- modified to open virtual keyboard
          onBlur={handleBlur} // <-- modified to close virtual keyboard
        />
      </div>
      <button
        aria-hidden
        tabIndex={-1}
        className="flex items-center pl-1 pr-2 hover:bg-accent-white/20 transition-colors"
        disabled={max != null && value >= max}
        onPointerDown={handlePointerDown(1)}
      >
        <Plus className="size-3.5" absoluteStrokeWidth strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default function index() {
  const [value, setValue] = React.useState(0);
  return (
    <>
      <Input value={value} min={0} max={99} onChange={setValue} />
    </>
  );
}
