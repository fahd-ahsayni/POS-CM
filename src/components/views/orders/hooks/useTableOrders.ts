import { useState, useMemo } from "react";
import { FilterCriteria } from "@/types";

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
    let filtered = [...data];

    // Apply filters
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

        return matchesEmployee && matchesOrderType && matchesStatus;
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
          return sortConfig.direction === "ascending"
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
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
  }, [data, filterCriteria, sortConfig]);

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
}
