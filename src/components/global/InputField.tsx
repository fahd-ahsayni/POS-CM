import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import React, { ReactNode, useState } from "react";

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
    isFocused = false,
    onFocus,
    onBlur,
  } = config;

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const getInputType = () => {
    if (isPasswordToggleable && type === "password") {
      return isVisible ? "text" : "password";
    }
    return type;
  };

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between gap-x-1">
        <Label className="pl-1">
          {label}
          {required && <span className="text-destructive">*</span>}
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
            hasError && "border-primary-red",
            startIcon && "ps-9",
            suffix && "pe-9",
            isPasswordToggleable && "pe-9",
            type === "number" &&
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          )}
          type={getInputType()}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
          aria-invalid={hasError}
          aria-describedby={
            helperText || errorMessage ? `description` : undefined
          }
          value={value ?? ""}
          onChange={(e) =>
            setValue?.(
              type === "number" ? Number(e.target.value) : e.target.value
            )
          }
          onFocus={onFocus}
          onBlur={onBlur}
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
