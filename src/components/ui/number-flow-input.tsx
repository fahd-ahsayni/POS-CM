"use client";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
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
  const [animated, setAnimated] = React.useState(true);
  // Hide the caret during transitions so you can't see it shifting around:
  const [showCaret, setShowCaret] = React.useState(true);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: el,
  }) => {
    setAnimated(false);
    if (el.value === "") {
      onChange?.(defaultValue.current);
      return;
    }
    const num = parseInt(el.value);
    if (
      isNaN(num) ||
      (min != null && num < min) ||
      (max != null && num > max)
    ) {
      // Revert input's value:
      el.value = String(value);
    } else {
      // Manually update value in case they e.g. start with a "0" or end with a "."
      // which won't trigger a DOM update (because the number is the same):
      el.value = String(num);
      onChange?.(num);
    }
  };

  const handlePointerDown =
    (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      setAnimated(true);
      if (event.pointerType === "mouse") {
        event?.preventDefault();
        inputRef.current?.focus();
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
      <div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
        <input
          ref={inputRef}
          className={cn(
            showCaret ? "caret-primary" : "caret-transparent",
            "spin-hide w-[2em] bg-transparent py-1.5 text-center font-[inherit] text-transparent outline-none appearance-none"
          )}
          style={{ fontKerning: "none" }}
          type="text"
          min={min}
          step={1}
          autoComplete="off"
          inputMode="numeric"
          max={max}
          value={value}
          onInput={handleInput}
        />
        <NumberFlow
          value={value}
          format={{ useGrouping: false }}
          aria-hidden
          animated={animated}
          onAnimationsStart={() => setShowCaret(false)}
          onAnimationsFinish={() => setShowCaret(true)}
          className="pointer-events-none"
          willChange
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
