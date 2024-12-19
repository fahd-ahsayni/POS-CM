import ComboboxText from "@/components/global/ComboboxText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterIcon, Search } from "lucide-react";
import { useState } from "react";

export default function FiltreOrders() {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("");

  const employees = [
    { value: "john_doe", label: "John Doe" },
    { value: "jane_smith", label: "Jane Smith" },
    { value: "alice_jones", label: "Alice Jones" },
  ];

  const orderTypes = [
    { value: "glovo-n12", label: "Glovo - N12" },
    { value: "ubereats-n12", label: "UberEats - N12" },
    { value: "pickup-n12", label: "Pickup - N12" },
  ];

  const handleEmployeeSelect = (value: string) => {
    setSelectedEmployee(value);
    console.log("Selected employee:", value);
    // Implement any additional logic needed when an employee is selected
  };

  const handleOrderTypeSelect = (value: string) => {
    setSelectedOrderType(value);
    console.log("Selected order type:", value);
    // Implement any additional logic needed when an order type is selected
  };

  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon">
            <FilterIcon className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-72 mr-[6.5rem] dark:bg-zinc-900"
        >
          <h2 className="mb-2 text-sm font-semibold">Filter Orders</h2>
          <form className="space-y-3">
            <div>
              <div className="mb-2 flex items-center justify-between gap-1">
                <Label
                  htmlFor="input-04"
                  className="leading-6 text-muted-foreground"
                >
                  Order ID
                </Label>
                <span className="text-xs text-red-500 cursor-pointer">
                  Reset
                </span>
              </div>
              <div className="relative">
                <Input
                  id="input-26"
                  className="peer pe-9 ps-9 dark:bg-muted"
                  placeholder="Search..."
                  type="search"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  <Search size={16} strokeWidth={2} />
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-1">
                <Label
                  htmlFor="input-04"
                  className="leading-6 text-muted-foreground"
                >
                  Employee
                </Label>
                <span className="text-xs text-red-500 cursor-pointer">
                  Reset
                </span>
              </div>
              <div className="relative">
                <ComboboxText
                  items={employees}
                  placeholder="Select an employee"
                  searchPlaceholder="Search by name ..."
                  onSelect={handleEmployeeSelect}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-1">
                <Label
                  htmlFor="input-04"
                  className="leading-6 text-muted-foreground"
                >
                  Order Type
                </Label>
                <span className="text-xs text-red-500 cursor-pointer">
                  Reset
                </span>
              </div>
              <div className="relative">
                <ComboboxText
                  items={orderTypes}
                  placeholder="Select an order type"
                  searchPlaceholder="Search by name ..."
                  onSelect={handleOrderTypeSelect}
                />
              </div>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}
