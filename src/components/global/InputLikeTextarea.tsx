import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ChangeEvent, useRef } from "react";

interface InputLikeTextareaProps {
  label: string;
  placeholder: string;
  rows?: number;
  value: string;
  setValue: (value: string) => void;
  error?: string;
  required?: boolean;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}

export default function InputLikeTextarea({
  value,
  setValue,
  label,
  placeholder,
  rows = 1,
  error,
  required = false,
  maxLength,
  disabled = false,
  className,
}: InputLikeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const defaultRows = 1;
  const maxRows = undefined; // You can set a max number of rows

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";

    const style = window.getComputedStyle(textarea);
    const borderHeight =
      parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
    const paddingHeight =
      parseInt(style.paddingTop) + parseInt(style.paddingBottom);

    const lineHeight = parseInt(style.lineHeight);
    const maxHeight = maxRows
      ? lineHeight * maxRows + borderHeight + paddingHeight
      : Infinity;

    const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
    setValue(textarea.value);
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center">
        <Label>
          {label}
          {required && <span className="text-primary-red pl-0.5">*</span>}
        </Label>
        {maxLength && (
          <span className="text-xs text-muted-foreground">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <Textarea
        value={value}
        placeholder={placeholder}
        ref={textareaRef}
        onChange={handleInput}
        rows={rows || defaultRows}
        className={cn(
          "min-h-[none] h-9 w-full resize-none scrollbar-hide",
          error && "ring-[1.25px] ring-primary-red",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      {error && (
        <p
          id={`${label}-error`}
          className="text-xs text-primary-red pl-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
