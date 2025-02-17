import { FilterIcon } from "@/assets/figma-icons";
import InputComponent from "@/components/global/InputComponent";
import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterCriteria } from "@/interfaces/general";
import { useRef, useState } from "react";
import useFilterCriteria from "./hooks/useFilterOrder";

interface FilterOrdersProps {
  onFilterChange: (filters: FilterCriteria) => void;
}

export default function FilterOrders({ onFilterChange }: FilterOrdersProps) {
  const [open, setOpen] = useState(false);
  const { openKeyboard, showKeyboard } = useVirtualKeyboard();

  // Track cursor position
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  // Ref for the Order ID input
  const orderIdRef = useRef<HTMLInputElement | null>(null);

  // Add ref for table number input
  const tableNumberRef = useRef<HTMLInputElement | null>(null);

  // Add state for table number cursor position
  const [tableNumberCursorPosition, setTableNumberCursorPosition] =
    useState<number>(0);

  const {
    selectedEmployee,
    setSelectedEmployee,
    selectedOrderType,
    setSelectedOrderType,
    selectedStatus,
    setSelectedStatus,
    orderId,
    setOrderId,
    tableNumber,
    setTableNumber,
    employees,
    orderTypesData,
    statuses,
    handleClearFilter,
    handleReset,
    handleApplyFilter,
  } = useFilterCriteria(onFilterChange);

  // Handle virtual keyboard input with correct cursor tracking
  const handleKeyPress = (key: string, cursorAdjustment: number) => {
    if (!orderIdRef.current) return;

    let currentValue = orderId;
    let newValue = currentValue;
    let newPosition = cursorPosition;

    switch (key) {
      case "Backspace":
        if (cursorPosition > 0) {
          newValue =
            currentValue.slice(0, cursorPosition - 1) +
            currentValue.slice(cursorPosition);
          newPosition = cursorPosition - 1;
        }
        break;
      case "ArrowLeft":
        newPosition = Math.max(0, cursorPosition - 1);
        break;
      case "ArrowRight":
        newPosition = Math.min(currentValue.length, cursorPosition + 1);
        break;
      case "Delete":
        newValue = ""; // Clear the entire field
        newPosition = 0;
        break;
      default:
        newValue =
          currentValue.slice(0, cursorPosition) +
          key +
          currentValue.slice(cursorPosition);
        newPosition = cursorPosition + cursorAdjustment;
        break;
    }

    setOrderId(newValue);
    setCursorPosition(newPosition);

    // Ensure the cursor stays in the correct place
    setTimeout(() => {
      orderIdRef.current?.setSelectionRange(newPosition, newPosition);
      orderIdRef.current?.focus();
    }, 0);
  };

  // Add handler for table number keyboard input
  const handleTableNumberKeyPress = (key: string, cursorAdjustment: number) => {
    if (!tableNumberRef.current) return;

    let currentValue = tableNumber;
    let newValue = currentValue;
    let newPosition = tableNumberCursorPosition;

    switch (key) {
      case "Backspace":
        if (tableNumberCursorPosition > 0) {
          newValue =
            currentValue.slice(0, tableNumberCursorPosition - 1) +
            currentValue.slice(tableNumberCursorPosition);
          newPosition = tableNumberCursorPosition - 1;
        }
        break;
      case "ArrowLeft":
        newPosition = Math.max(0, tableNumberCursorPosition - 1);
        break;
      case "ArrowRight":
        newPosition = Math.min(
          currentValue.length,
          tableNumberCursorPosition + 1
        );
        break;
      case "Delete":
        newValue = "";
        newPosition = 0;
        break;
      default:
        newValue =
          currentValue.slice(0, tableNumberCursorPosition) +
          key +
          currentValue.slice(tableNumberCursorPosition);
        newPosition = tableNumberCursorPosition + cursorAdjustment;
        break;
    }

    setTableNumber(newValue);
    setTableNumberCursorPosition(newPosition);

    setTimeout(() => {
      tableNumberRef.current?.setSelectionRange(newPosition, newPosition);
      tableNumberRef.current?.focus();
    }, 0);
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover
        open={open}
        onOpenChange={(newState) => {
          if (!showKeyboard) setOpen(newState);
        }}
      >
        <PopoverTrigger asChild>
          <Button size="icon" onClick={() => setOpen(true)}>
            <FilterIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-72 mr-[6.5rem] dark:bg-secondary-black bg-secondary-white"
          onPointerDownOutside={(event) => {
            if (showKeyboard) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (orderIdRef.current?.contains(event.target as Node)) {
              event.preventDefault();
            }
          }}
        >
          <h2 className="mb-4 text-sm font-semibold">Filter Orders</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Order ID Input with Virtual Keyboard */}
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
                  onFocus: () => {
                    openKeyboard("order-id", handleKeyPress);
                    setCursorPosition(orderIdRef.current?.selectionStart || 0);
                    setOpen(true); // Keep popover open
                  },
                  onSelect: (e) => {
                    setCursorPosition(
                      (e.target as HTMLInputElement).selectionStart || 0
                    );
                  },
                  ref: orderIdRef,
                }}
              />
            </div>

            {/* Table Number Input */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="pl-2">Table Number</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("tableNumber")}
                >
                  Clear
                </span>
              </div>
              <InputComponent
                config={{
                  type: "text",
                  placeholder: "Enter Table Number",
                  value: tableNumber,
                  setValue: (value: string | number | null) =>
                    setTableNumber(value ? value.toString() : ""),
                  onFocus: () => {
                    openKeyboard("table-number", handleTableNumberKeyPress);
                    setTableNumberCursorPosition(
                      tableNumberRef.current?.selectionStart || 0
                    );
                    setOpen(true);
                  },
                  onSelect: (e) => {
                    setTableNumberCursorPosition(
                      (e.target as HTMLInputElement).selectionStart || 0
                    );
                  },
                  ref: tableNumberRef,
                }}
              />
            </div>

            {/* Users Filter */}
            <div>
              <Label className="pl-2">Users</Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
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
              <Label className="pl-2">Order Type</Label>
              <Select
                value={selectedOrderType}
                onValueChange={setSelectedOrderType}
              >
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
              <Label className="pl-2">Status</Label>
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
