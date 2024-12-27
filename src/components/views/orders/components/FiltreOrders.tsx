import ComboboxText from "@/components/global/ComboboxText";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FilterIcon } from "lucide-react";
import { useState } from "react";

interface FilterCriteria {
  employee: string;
  orderType: string;
  status: string;
}

export default function FiltreOrders({
  onFilterChange,
}: {
  onFilterChange: (filters: FilterCriteria) => void;
}) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const users = JSON.parse(localStorage.getItem("users") || "[]").cashiers;

  const employees = users?.map((user: any) => ({
    value: user.name,
    label: user.name,
  }));

  const orderTypesData = JSON.parse(
    localStorage.getItem("generalData") || "[]"
  ).orderTypes;

  const orderTypes = orderTypesData?.map((type: any) => ({
    value: type.type,
    label: type.name,
  }));

  const statuses = [
    { value: "new", label: "New" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
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

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    console.log("Selected status:", value);
  };

  const handleClearFilter = (
    filterType: "employee" | "orderType" | "status"
  ) => {
    switch (filterType) {
      case "employee":
        setSelectedEmployee("");
        break;
      case "orderType":
        setSelectedOrderType("");
        break;
      case "status":
        setSelectedStatus("");
        break;
    }
  };

  const handleReset = () => {
    setSelectedEmployee("");
    setSelectedOrderType("");
    setSelectedStatus("");
    onFilterChange({ employee: "", orderType: "", status: "" });
  };

  const handleApplyFilter = () => {
    onFilterChange({
      employee: selectedEmployee,
      orderType: selectedOrderType,
      status: selectedStatus,
    });
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
          className="w-72 mr-[6.5rem] dark:bg-secondary-black bg-secondary-white"
        >
          <h2 className="mb-4 text-sm font-semibold">Filter Orders</h2>
          <form className="space-y-5">
            <div>
              <div className="mb-0.5 flex items-center justify-between gap-1">
                <Label className="pl-2">users</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("employee")}
                >
                  Clear
                </span>
              </div>
              <div className="relative">
                <ComboboxText
                  items={employees}
                  placeholder="Select an employee"
                  searchPlaceholder="Search by name ..."
                  onSelect={handleEmployeeSelect}
                  value={selectedEmployee}
                />
              </div>
            </div>
            <div>
              <div className="mb-0.5 flex items-center justify-between gap-1">
                <Label className="pl-2">Order Type</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("orderType")}
                >
                  Clear
                </span>
              </div>
              <div className="relative">
                <ComboboxText
                  items={orderTypes}
                  placeholder="Select an order type"
                  searchPlaceholder="Search by name ..."
                  onSelect={handleOrderTypeSelect}
                  value={selectedOrderType}
                />
              </div>
            </div>
            <div>
              <div className="mb-0.5 flex items-center justify-between gap-1">
                <Label className="pl-2">Status</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("status")}
                >
                  Clear
                </span>
              </div>
              <div className="relative">
                <ComboboxText
                  items={statuses}
                  placeholder="Select a status"
                  searchPlaceholder="Search by name ..."
                  onSelect={handleStatusSelect}
                  value={selectedStatus}
                />
              </div>
            </div>
          </form>
          <div className="flex justify-end gap-x-2 mt-6">
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApplyFilter}>Apply Filter</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
