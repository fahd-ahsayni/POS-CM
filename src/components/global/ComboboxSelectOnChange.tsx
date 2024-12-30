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
          {label && <Label className="pl-2">{label}</Label>}
          <div className="relative mt-1">
            <ComboboxInput
              className="w-full h-[38px] placeholder:text-muted-foreground/70 rounded-md focus:ring-1 focus:ring-primary-black/10 dark:focus:ring-white/10 bg-primary-black/5 dark:bg-white/5 py-1 pl-3 pr-10 shadow-sm focus:outline-none text-[.8rem]"
              onChange={handleInputChange}
              displayValue={(item: any) => {
                if (typeof item === "string") return item;
                return displayValue(item);
              }}
              placeholder={placeholder}
            />
            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronDown
                className="h-5 w-5 text-primary-black dark:text-white"
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
        </>
      )}
    </Combobox>
  );
}
