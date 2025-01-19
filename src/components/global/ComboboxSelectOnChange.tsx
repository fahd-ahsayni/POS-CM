import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface ComboboxSelectOnChangeProps<T> {
  label?: string;
  items: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  displayValue: (item: T) => string;
  filterFunction: (query: string, item: T) => boolean;
  renderOption: (
    item: T,
    active: boolean,
    selected: boolean
  ) => React.ReactElement;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
  hasError?: boolean;
  helperText?: string;
  optionalText?: string;
}

export default function ComboboxSelectOnChange<T>({
  label,
  items,
  value,
  onChange,
  displayValue,
  filterFunction,
  renderOption,
  placeholder = "Select an option...",
  required = false,
  errorMessage,
  hasError = false,
  helperText,
  optionalText,
}: ComboboxSelectOnChangeProps<T>) {
  const [query, setQuery] = useState("");

  const filteredItems =
    query === "" ? items : items.filter((item) => filterFunction(query, item));

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setQuery(newValue);
    onChange(newValue as unknown as T);
  };

  return (
    <Combobox className="w-full" as="div" value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <div className="flex items-center justify-between gap-x-1">
            {label && (
              <Label className="pl-2">
                {label}
                {required && <span className="text-primary-red pl-0.5">*</span>}
              </Label>
            )}
            {optionalText && (
              <span className="text-[0.65rem] text-neutral-dark-grey">
                {optionalText}
              </span>
            )}
          </div>
          <div className="relative mt-1.5">
            <ComboboxInput
              className={cn(
                "w-full h-9 rounded-md border border-input dark:bg-white/5 bg-primary-black/5 px-3 py-2 text-[.8rem] text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 dark:focus-visible:border-white/80 focus-visible:border-primary-black/40 focus-visible:outline-none focus-visible:ring-[3px] dark:focus-visible:ring-ring/20 focus-visible:ring-ring/10 disabled:cursor-not-allowed disabled:opacity-50",
                hasError && "!border-none ring-2 ring-primary-red"
              )}
              onChange={handleInputChange}
              displayValue={(item: any) => {
                if (typeof item === "string") return item;
                return displayValue(item);
              }}
              placeholder={placeholder}
              aria-invalid={hasError}
              aria-describedby={
                helperText || errorMessage ? `${label}-description` : undefined
              }
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronDown
                className={cn(
                  "h-4 w-4",
                  hasError
                    ? "text-primary-red"
                    : "text-primary-black/70 dark:text-white/70"
                )}
                aria-hidden="true"
              />
            </ComboboxButton>

            {filteredItems.length > 0 && open && (
              <ComboboxOptions className="absolute z-10 mt-2 max-h-56 min-w-64 w-full overflow-auto rounded-lg dark:bg-primary-black bg-white py-2 shadow-lg dark:shadow-black/50 ring-1 ring-black ring-opacity-5 focus:outline-none px-2">
                {filteredItems.map((item, index) => (
                  <ComboboxOption
                    key={index}
                    value={item}
                    className={({ active }) =>
                      cn(
                        "relative cursor-default select-none py-2 pl-3 pr-9 text-[.8rem] rounded-md",
                        active
                          ? "dark:bg-white/5 bg-primary-black/5 dark:text-white text-primary-black"
                          : "dark:text-white text-primary-black"
                      )
                    }
                  >
                    {({ active, selected }) =>
                      renderOption(item, active, selected)
                    }
                  </ComboboxOption>
                ))}
              </ComboboxOptions>
            )}
          </div>
          
          {(helperText || errorMessage) && (
            <p
              id={`${label}-description`}
              className={cn(
                "mt-2 text-xs font-medium pl-2",
                hasError ? "text-primary-red" : "text-neutral-dark-grey"
              )}
              role={hasError ? "alert" : "region"}
            >
              {hasError ? errorMessage : helperText}
            </p>
          )}
        </>
      )}
    </Combobox>
  );
}
