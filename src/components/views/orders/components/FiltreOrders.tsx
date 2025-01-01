import ComboboxSelect from "@/components/global/ComboboxSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { FilterIcon } from "@/assets/figma-icons";

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

  const users = useMemo(() => JSON.parse(localStorage.getItem("users") || "[]").cashiers, []);
  const employees = useMemo(() => users?.map((user: any) => ({
    value: user.name,
    label: user.name,
  })), [users]);

  const orderTypesData = useMemo(() => JSON.parse(localStorage.getItem("generalData") || "[]").orderTypes, []);
  const orderTypes = useMemo(() => orderTypesData?.map((type: any) => ({
    value: type.type,
    label: type.name,
  })), [orderTypesData]);

  const statuses = useMemo(() => [
    { value: "new", label: "New" },
    { value: "paid", label: "Paid" },
    { value: "cancelled", label: "Cancelled" },
  ], []);

  const handleEmployeeSelect = useCallback((value: string) => {
    setSelectedEmployee(value);
    console.log("Selected employee:", value);
  }, []);

  const handleOrderTypeSelect = useCallback((value: string) => {
    setSelectedOrderType(value);
    console.log("Selected order type:", value);
  }, []);

  const handleStatusSelect = useCallback((value: string) => {
    setSelectedStatus(value);
    console.log("Selected status:", value);
  }, []);

  const handleClearFilter = useCallback((filterType: "employee" | "orderType" | "status") => {
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
  }, []);

  const handleReset = useCallback(() => {
    setSelectedEmployee("");
    setSelectedOrderType("");
    setSelectedStatus("");
    onFilterChange({ employee: "", orderType: "", status: "" });
  }, [onFilterChange]);

  const handleApplyFilter = useCallback(() => {
    onFilterChange({
      employee: selectedEmployee,
      orderType: selectedOrderType,
      status: selectedStatus,
    });
  }, [onFilterChange, selectedEmployee, selectedOrderType, selectedStatus]);

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
                <Label className="pl-2">Users</Label>
                <span
                  className="text-xs font-medium text-error-color cursor-pointer"
                  onClick={() => handleClearFilter("employee")}
                >
                  Clear
                </span>
              </div>
              <ComboboxSelect
                items={employees}
                value={employees.find((e: any) => e.value === selectedEmployee) || null}
                onChange={(item) => handleEmployeeSelect(item?.value || "")}
                displayValue={(item) => item?.label || ""}
                placeholder="Select an employee"
                filterFunction={(query, item) => 
                  item.label.toLowerCase().includes(query.toLowerCase())
                }
                renderOption={(item, active, selected) => (
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {selected && <CheckIcon className="h-4 w-4 text-primary-red" />}
                  </div>
                )}
              />
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
              <ComboboxSelect
                items={orderTypes}
                value={orderTypes.find((t: any) => t.value === selectedOrderType) || null}
                onChange={(item) => handleOrderTypeSelect(item?.value || "")}
                displayValue={(item) => item?.label || ""}
                placeholder="Select an order type"
                filterFunction={(query, item) => 
                  item.label.toLowerCase().includes(query.toLowerCase())
                }
                renderOption={(item, active, selected) => (
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {selected && <CheckIcon className="h-4 w-4 text-primary-red" />}
                  </div>
                )}
              />
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
              <ComboboxSelect
                items={statuses}
                value={statuses.find(s => s.value === selectedStatus) || null}
                onChange={(item) => handleStatusSelect(item?.value || "")}
                displayValue={(item) => item?.label || ""}
                placeholder="Select a status"
                filterFunction={(query, item) => 
                  item.label.toLowerCase().includes(query.toLowerCase())
                }
                renderOption={(item, active, selected) => (
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {selected && <CheckIcon className="h-4 w-4 text-primary-red" />}
                  </div>
                )}
              />
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
