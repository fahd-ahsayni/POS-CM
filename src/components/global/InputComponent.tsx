import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useVirtualKeyboard } from "../keyboard/VirtualKeyboardGlobalContext";

interface InputConfig {
  label?: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  helperText?: string;
  defaultValue?: string;
  hasError?: boolean;
  startIcon?: React.ReactNode;
  isPasswordToggleable?: boolean;
  optionalText?: string;
  value?: string | number | null;
  setValue?: (value: string | number | null) => void;
  suffix?: ReactNode | string;
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onSelect?: (e: React.SyntheticEvent<HTMLInputElement>) => void; // Tracks cursor position
  ref?: React.RefObject<HTMLInputElement>;
  fieldId?: string; // Add field ID for isolation
}

const InputComponent: React.FC<{ config: InputConfig; className?: string }> = ({
  config,
  className,
}) => {
  const {
    label,
    type = "text",
    placeholder = "",
    required = false,
    errorMessage,
    helperText,
    defaultValue,
    hasError = false,
    startIcon,
    isPasswordToggleable = false,
    optionalText,
    value,
    setValue,
    suffix,
    onFocus,
    onBlur,
    onSelect, // NEW - Captures cursor position
    ref,
    fieldId, // New field ID prop
  } = config;

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { syncCursorPosition, lockKeyboard, unlockKeyboard, activeInput } =
    useVirtualKeyboard();
  const prevValueRef = useRef<string | number | null>(value ?? null);
  const cursorPosRef = useRef<number>(0);

  // Only update cursor position for this field if it's the active field
  const isActiveField = fieldId && activeInput === fieldId;

  // Track cursor position on value changes
  useEffect(() => {
    if (prevValueRef.current !== value) {
      prevValueRef.current = value ?? null;

      // Only set cursor position after value changes if we have a stored position
      // AND this is the active field
      if (
        inputRef.current &&
        document.activeElement === inputRef.current &&
        isActiveField
      ) {
        const newPos = Math.min(
          cursorPosRef.current,
          String(value || "").length
        );
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    }
  }, [value, isActiveField]);

  const getInputType = () => {
    if (isPasswordToggleable && type === "password") {
      return isVisible ? "text" : "password";
    }
    return type;
  };

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  // Helper to update cursor position after any input changes
  // Only sync with keyboard if this is the active field
  const updateCursorPosition = (element: HTMLInputElement) => {
    const pos = element.selectionStart || 0;
    cursorPosRef.current = pos;

    if (isActiveField) {
      syncCursorPosition(pos);
    }
  };

  // Handle selection and cursor movement with improved field isolation
  const handleCursorChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const element = e.currentTarget;
    updateCursorPosition(element);
    if (onSelect) onSelect(e);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-x-1">
        <Label className="pl-1">
          {label}
          {required && <span className="text-primary-red pl-0.5">*</span>}
        </Label>
        {optionalText && (
          <span className="text-[0.65rem] text-neutral-dark-grey">
            {optionalText}
          </span>
        )}
      </div>

      <div className="relative mt-0.5">
        {startIcon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80">
            {startIcon}
          </div>
        )}

        <Input
          className={cn(
            "w-full",
            hasError && "ring-2 ring-primary-red !border-none",
            startIcon && "ps-9",
            suffix && "pe-9",
            isPasswordToggleable && "pe-9",
            type === "number" &&
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          type={getInputType()}
          placeholder={placeholder}
          required={required}
          ref={(el) => {
            // Handle both forwarded ref and internal ref
            inputRef.current = el;
            if (typeof ref === "object" && ref !== null) {
              (ref as React.MutableRefObject<HTMLInputElement | null>).current =
                el;
            }
          }}
          defaultValue={defaultValue}
          aria-invalid={hasError}
          aria-describedby={
            helperText || errorMessage ? `description` : undefined
          }
          value={value ?? ""}
          onChange={(e) => {
            const newValue =
              type === "number" ? Number(e.target.value) : e.target.value;

            // Lock keyboard during value update
            if (isActiveField) {
              lockKeyboard();
            }

            setValue?.(newValue);

            // Capture the cursor position after change
            updateCursorPosition(e.target);

            // Unlock keyboard after a short delay (only if this is active field)
            if (isActiveField) {
              setTimeout(() => {
                unlockKeyboard();
              }, 30);
            }

            // Call original onSelect if provided
            if (onSelect) {
              onSelect(e);
            }
          }}
          onFocus={(e) => {
            updateCursorPosition(e.target);
            if (onFocus) onFocus();
          }}
          onBlur={(_) => {
            if (onBlur) onBlur();
          }}
          onSelect={handleCursorChange}
          onClick={(e) => {
            e.stopPropagation();
            updateCursorPosition(e.currentTarget);
            if (onSelect) {
              onSelect(e);
            }
          }}
          onKeyDown={(e) => {
            // Track cursor position for arrow keys and other navigation
            if (
              [
                "ArrowLeft",
                "ArrowRight",
                "Home",
                "End",
                "Backspace",
                "Delete",
              ].includes(e.key)
            ) {
              // Use setTimeout to allow the cursor to move before getting position
              setTimeout(() => {
                if (e.currentTarget) {
                  updateCursorPosition(e.currentTarget);
                }
              }, 0);
            }
          }}
          // Add data attributes for field identification and cursor position tracking
          data-cursor-position={cursorPosRef.current}
          data-field-id={fieldId}
        />

        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-[0.8rem] font-medium dark:text-white text-primary-black">
            {suffix}
          </span>
        )}

        {isPasswordToggleable && (
          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground"
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {(helperText || errorMessage) && (
        <p
          className={`mt-2 text-xs font-medium pl-1 ${
            hasError ? "text-primary-red" : "text-neutral-dark-grey"
          }`}
          role={hasError ? "alert" : "region"}
        >
          {hasError ? errorMessage : helperText}
        </p>
      )}
    </div>
  );
};

export default InputComponent;
