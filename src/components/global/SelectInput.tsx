import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const Square = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    data-square
    className={cn(
      "flex size-5 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground",
      className
    )}
    aria-hidden="true"
  >
    {children}
  </span>
);

interface DataItem {
  value: string;
  bgColor: string;
  textColor: string;
  initial: string;
  name: string;
}

interface SelectConfig {
  data: DataItem[];
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const SelectDemo: React.FC<{ config: SelectConfig }> = ({ config }) => {
  const {
    data,
    defaultValue = "s1",
    onValueChange,
    label = "Options with placeholder avatar",
    placeholder = "Select framework",
  } = config;

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="select-39">{label}</Label>
      <Select value={selectedValue} onValueChange={handleChange}>
        <SelectTrigger className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_[data-square]]:shrink-0">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
          <SelectGroup>
            <SelectLabel className="ps-2">Impersonate user</SelectLabel>
            {data.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                <Square className={`${item.bgColor} ${item.textColor}`}>
                  {item.initial}
                </Square>
                <span className="truncate">{item.name}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDemo;
