import { useCallback, useMemo, useState } from "react";
import { FilterCriteria } from "@/interfaces/general";

export default function useFilterCriteria(
  onFilterChange: (filters: FilterCriteria) => void
) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string>("");

  const users = useMemo(
    () => {
      const userData = JSON.parse(localStorage.getItem("users") || "{}");
      return [...(userData.cashiers || []), ...(userData.waiters || [])];
    },
    []
  );

  const employees = useMemo(
    () => users.map((user: any) => ({ value: user.name, label: user.name })),
    [users]
  );

  const orderTypesData = useMemo(() => {
    const data =
      JSON.parse(localStorage.getItem("generalData") || "{}")?.orderTypes || [];
    const flattenOrderTypes = (types: any[]): any[] => {
      return types.reduce((acc: any[], type: any) => {
        acc.push({
          id: type._id,
          value: type._id,
          label: type.name,
          type: type.type,
        });
        if (type.children && type.children.length > 0) {
          acc.push(...flattenOrderTypes(type.children));
        }
        return acc;
      }, []);
    };
    return flattenOrderTypes(data);
  }, []);

  const statuses = useMemo(
    () => [
      { value: "new", label: "New" },
      { value: "paid", label: "Paid" },
      { value: "canceled", label: "Canceled" },
    ],
    []
  );

  const handleClearFilter = useCallback((filterType: keyof FilterCriteria) => {
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
  }, []);

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
    const filters: FilterCriteria = {
      employee: selectedEmployee,
      orderType: selectedOrderType,
      status: selectedStatus,
      orderId,
      tableNumber,
    };
    onFilterChange(filters);
  }, [
    onFilterChange,
    selectedEmployee,
    selectedOrderType,
    selectedStatus,
    orderId,
    tableNumber,
  ]);

  return {
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
  };
}
