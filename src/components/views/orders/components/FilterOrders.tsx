import { FilterIcon } from "@/assets/figma-icons";
import InputComponent from "@/components/global/InputComponent";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterCriteria } from "@/interfaces/general";
import { useState, useRef } from "react";
import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";
import useFilterCriteria from "./hooks/useFilterOrder";

interface FilterOrdersProps {
  onFilterChange: (filters: FilterCriteria) => void;
}

export default function FilterOrders({ onFilterChange }: FilterOrdersProps) {
  const [open, setOpen] = useState(false);
  const { openKeyboard, showKeyboard } = useVirtualKeyboard();
  const orderIdRef = useRef<HTMLInputElement | null>(null);

  const {
    selectedEmployee,
    setSelectedEmployee,
    selectedOrderType,
    setSelectedOrderType,
    selectedStatus,
    setSelectedStatus,
    orderId,
    setOrderId,
    employees,
    orderTypesData,
    statuses,
    handleClearFilter,
    handleReset,
    handleApplyFilter,
  } = useFilterCriteria(onFilterChange);

  // Handle virtual keyboard input
  const handleKeyPress = (key: string) => {
    if (!orderIdRef.current) return;

    let newValue = orderId;
    if (key === "Backspace") {
      newValue = newValue.slice(0, -1);
    } else {
      newValue += key;
    }

    setOrderId(newValue);
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button size="icon">
            <FilterIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-72 mr-[6.5rem] dark:bg-secondary-black bg-secondary-white"
          onPointerDownOutside={(event) => {
            if (showKeyboard) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            if (orderIdRef.current?.contains(event.target as Node)) {
              event.preventDefault();
            }
          }}
        >
          <h2 className="mb-4 text-sm font-semibold">Filter Orders</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Order ID with Virtual Keyboard */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="pl-2">Order ID</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("orderId")}
                >
                  Clear
                </span>
              </div>
              <InputComponent
                config={{
                  type: "text",
                  placeholder: "Enter Order ID",
                  value: orderId,
                  setValue: (value: string | number | null) =>
                    setOrderId(value ? value.toString() : ""),
                  onFocus: () => openKeyboard("order-id", handleKeyPress),
                  ref: orderIdRef,
                }}
              />
            </div>

            {/* Users Filter */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-1">
                <Label className="pl-2">Users</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("employee")}
                >
                  Clear
                </span>
              </div>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee: any) => (
                    <SelectItem key={employee.value} value={employee.value}>
                      {employee.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Order Type Filter */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-1">
                <Label className="pl-2">Order Type</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("orderType")}
                >
                  Clear
                </span>
              </div>
              <Select value={selectedOrderType} onValueChange={setSelectedOrderType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an order type" />
                </SelectTrigger>
                <SelectContent>
                  {orderTypesData.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-1">
                <Label className="pl-2">Status</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("status")}
                >
                  Clear
                </span>
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="flex justify-end gap-x-2 mt-6">
            <Button
              variant="secondary"
              className="dark:bg-white/10 bg-white border border-border"
              onClick={() => {
                handleReset();
                setOpen(false);
              }}
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                handleApplyFilter();
                setOpen(false);
              }}
            >
              Apply Filter
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
