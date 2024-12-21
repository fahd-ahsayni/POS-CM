import React, { useState } from "react";
import { AtSign, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputProps {
  label: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  helperText?: string;
  defaultValue?: string;
  hasError?: boolean;
  startIcon?: React.ReactNode;
  isPasswordToggleable?: boolean;
  optionalText?: string; // Optional case to display custom text like "Optional"
  value?: string | number;
  setValue?: (value: string | number) => void;
}

const InputComponent: React.FC<InputProps> = ({
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
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const inputType =
    isPasswordToggleable && type === "password"
      ? isVisible
        ? "text"
        : "password"
      : type;

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-1 mt-4">
        <Label className="leading-3 pl-2">{label}</Label>
        {optionalText && (
          <span className="text-sm text-muted-foreground">{optionalText}</span>
        )}
      </div>

      <div className="relative">
        {startIcon && (
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80">
            {startIcon}
          </div>
        )}

        <Input
          className={`w-full${
            hasError
              ? "border-red-500"
              : "border-gray-300"
          } ${startIcon ? "ps-9" : ""} ${isPasswordToggleable ? "pe-9" : ""} ${
            type === "number" ? "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" : ""
          }`}
          type={inputType}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
          aria-invalid={hasError}
          aria-describedby={
            helperText || errorMessage ? `description` : undefined
          }
          value={value}
          onChange={(e) => setValue?.(type === "number" ? Number(e.target.value) : e.target.value)}
        />

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
          className={`mt-2 text-xs ${
            hasError ? "text-destructive" : "text-muted-foreground"
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
