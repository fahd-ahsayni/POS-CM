import { filterOrderByTableNumber } from "@/api/services";
import { FilterCriteria } from "@/types/general";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

interface UseTableOrdersProps<T> {
  data: T[];
  filterCriteria: FilterCriteria;
  defaultSort?: SortConfig;
}

export function useTableOrders<T>({
  data,
  filterCriteria,
  defaultSort,
}: UseTableOrdersProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    defaultSort || null
  );
  const [tableData, setTableData] = useState<T[]>([]);

  const ordersVersion = useSelector((state: any) => state.orders.version);
  const ordersStatus = useSelector((state: any) => state.orders.status);
  const ordersCancellationStatus = useSelector((state: any) => state.orders.cancellationStatus);

  // Fetch table data when tableNumber changes
  useEffect(() => {
    const fetchTableData = async () => {
      if (filterCriteria.tableNumber) {
        try {
          const response = await filterOrderByTableNumber(
            filterCriteria.tableNumber
          );
          setTableData(response.data);
        } catch (error) {
          console.error("Error fetching table data:", error);
          setTableData([]);
        }
      } else {
        setTableData([]);
      }
    };

    fetchTableData();
  }, [filterCriteria.tableNumber, ordersVersion, ordersStatus, ordersCancellationStatus]);

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev?.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj) ?? "";
  };

  const normalizeStatus = (status: string) => {
    return status?.toLowerCase()?.trim() || "";
  };

  const extractOrderNumber = (ref: string) => {
    const match = ref?.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const sortedData = useMemo(() => {
    // Ensure we're working with an array
    let filtered = filterCriteria.tableNumber 
      ? (Array.isArray(tableData) ? tableData : [])
      : [...data];

    // Apply other filters
    if (filterCriteria) {
      filtered = filtered.filter((item) => {
        const matchesEmployee =
          !filterCriteria.employee ||
          getNestedValue(item, "created_by.name")
            ?.toLowerCase()
            .includes(filterCriteria.employee.toLowerCase());

        const matchesOrderType =
          !filterCriteria.orderType ||
          getNestedValue(item, "order_type_id.type")?.toLowerCase() ===
            filterCriteria.orderType.toLowerCase();

        const itemStatus = normalizeStatus(getNestedValue(item, "status"));
        const filterStatus = normalizeStatus(filterCriteria.status);
        const matchesStatus = !filterStatus || itemStatus === filterStatus;

        const matchesOrderId =
          !filterCriteria.orderId ||
          getNestedValue(item, "ref")
            ?.toLowerCase()
            .includes(filterCriteria.orderId.toLowerCase());

        return (
          matchesEmployee && matchesOrderType && matchesStatus && matchesOrderId
        );
      });
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue = getNestedValue(a, sortConfig.key);
        let bValue = getNestedValue(b, sortConfig.key);

        // Handle different data types
        if (sortConfig.key === "ref") {
          const aNum = extractOrderNumber(aValue);
          const bNum = extractOrderNumber(bValue);
          return sortConfig.direction === "ascending"
            ? aNum - bNum
            : bNum - aNum;
        }

        if (sortConfig.key === "total_amount") {
          const aNum = Number(aValue) || 0;
          const bNum = Number(bValue) || 0;
          return sortConfig.direction === "ascending"
            ? aNum - bNum
            : bNum - aNum;
        }

        if (sortConfig.key === "createdAt") {
          return sortConfig.direction === "ascending"
            ? new Date(aValue).getTime() - new Date(bValue).getTime()
            : new Date(bValue).getTime() - new Date(aValue).getTime();
        }

        if (sortConfig.key === "status") {
          aValue = normalizeStatus(aValue);
          bValue = normalizeStatus(bValue);
        }

        // Default string comparison
        const comparison = String(aValue).localeCompare(String(bValue));
        return sortConfig.direction === "ascending" ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, filterCriteria, sortConfig, tableData]);

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
}
