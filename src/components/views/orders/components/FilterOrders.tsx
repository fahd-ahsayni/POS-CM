import { FilterIcon } from "@/assets/figma-icons";
import InputComponent from "@/components/global/InputField";
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
import { FilterCriteria } from "@/types/general.d";
import { useCallback, useMemo, useState } from "react";

interface FilterOrdersProps {
  onFilterChange: (filters: FilterCriteria) => void;
  totalItems: number;
}

export default function FilterOrders({ onFilterChange }: FilterOrdersProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [open, setOpen] = useState(false);

  const users = useMemo(
    () => JSON.parse(localStorage.getItem("users") || "[]").cashiers,
    []
  );
  const employees = useMemo(
    () =>
      users?.map((user: any) => ({
        value: user.name,
        label: user.name,
      })),
    [users]
  );

  const orderTypesData = useMemo(
    () => JSON.parse(localStorage.getItem("generalData") || "[]").orderTypes,
    []
  );
  const orderTypes = useMemo(
    () =>
      orderTypesData?.map((type: any) => ({
        value: type.type,
        label: type.name,
      })),
    [orderTypesData]
  );

  const statuses = useMemo(
    () => [
      { value: "new", label: "New" },
      { value: "paid", label: "Paid" },
      { value: "cancelled", label: "Cancelled" },
    ],
    []
  );

  const handleEmployeeSelect = useCallback((value: string) => {
    setSelectedEmployee(value);
  }, []);

  const handleOrderTypeSelect = useCallback((value: string) => {
    setSelectedOrderType(value);
  }, []);

  const handleStatusSelect = useCallback((value: string) => {
    setSelectedStatus(value);
  }, []);

  const handleOrderIdChange = useCallback((value: string | number | null) => {
    setOrderId(value?.toString() || "");
  }, []);

  const handleClearFilter = useCallback(
    (
      filterType:
        | "employee"
        | "orderType"
        | "status"
        | "orderId"
        | "tableNumber"
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
        case "orderId":
          setOrderId("");
          break;
        case "tableNumber":
          setTableNumber("");
          break;
      }
    },
    []
  );

  const handleReset = useCallback(() => {
    setSelectedEmployee("");
    setSelectedOrderType("");
    setSelectedStatus("");
    setOrderId("");
    setTableNumber("");
    onFilterChange({
      employee: "",
      orderType: "",
      status: "",
      orderId: "",
      tableNumber: "",
    });
  }, [onFilterChange]);

  const handleApplyFilter = useCallback(() => {
    onFilterChange({
      employee: selectedEmployee,
      orderType: selectedOrderType,
      status: selectedStatus,
      orderId: orderId,
      tableNumber: tableNumber,
    });
    setSelectedEmployee("");
    setSelectedOrderType("");
    setSelectedStatus("");
    setOrderId("");
    setTableNumber("");
    setOpen(false);
  }, [
    onFilterChange,
    selectedEmployee,
    selectedOrderType,
    selectedStatus,
    orderId,
    tableNumber,
  ]);

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
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <h2 className="mb-4 text-sm font-semibold">Filter Orders</h2>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                  setValue: handleOrderIdChange,
                }}
              />
            </div>

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
              <Select value={selectedEmployee} onValueChange={handleEmployeeSelect}>
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
              <Select value={selectedOrderType} onValueChange={handleOrderTypeSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an order type" />
                </SelectTrigger>
                <SelectContent>
                  {orderTypes.map((type: any) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
              <Select value={selectedStatus} onValueChange={handleStatusSelect}>
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
          <div className="flex justify-end gap-x-2 mt-6">
            <Button
              variant="secondary"
              className="dark:bg-white/10 bg-white border border-border"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button onClick={handleApplyFilter}>Apply Filter</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
