import { filterOrderByTableNumber } from "@/api/services";
import { FilterCriteria } from "@/interfaces/general";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

interface UseTableOrdersProps {
  data: any[];
  filterCriteria: FilterCriteria;
  defaultSort?: SortConfig;
}

export function useTableOrders({
  data,
  filterCriteria,
  defaultSort,
}: UseTableOrdersProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    defaultSort || null
  );
  const [tableData, setTableData] = useState<any[]>([]);

  const ordersVersion = useSelector((state: any) => state.orders.version);
  const ordersStatus = useSelector((state: any) => state.orders.status);
  const ordersCancellationStatus = useSelector(
    (state: any) => state.orders.cancellationStatus
  );

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
  }, [
    filterCriteria.tableNumber,
    ordersVersion,
    ordersStatus,
    ordersCancellationStatus,
  ]);

  const getNestedValue = (obj: any, path: string) => {
    if (!obj) return "";
    // Handle special case for order_type column
    if (path === "order_type") {
      return obj.order_type_id?.type || "";
    }
    return path.split(".").reduce((acc, part) => {
      if (acc === null || acc === undefined) return "";
      return acc[part];
    }, obj);
  };

  const handleSort = (key: string) => {
    // Normalize the key for certain columns
    let sortKey = key;
    if (key === "order_type") {
      sortKey = "order_type_id.type";
    }

    setSortConfig((prev) => ({
      key: sortKey,
      direction:
        prev?.key === sortKey && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  const normalizeStatus = (status: string) => {
    return status?.toLowerCase()?.trim() || "";
  };

  const extractOrderNumber = (ref: string) => {
    const match = ref?.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const sortedData = useMemo(() => {
    let filtered = [...data]; // Start with all data

    if (filterCriteria) {
      filtered = filtered.filter((item) => {
        const matchesEmployee =
          !filterCriteria.employee ||
          getNestedValue(item, "created_by.name")
            ?.toLowerCase()
            .includes(filterCriteria.employee.toLowerCase());

        const matchesOrderType =
          !filterCriteria.orderType ||
          item.order_type_id?._id === filterCriteria.orderType;

        const itemStatus = normalizeStatus(getNestedValue(item, "status"));
        const filterStatus = normalizeStatus(filterCriteria.status);
        const matchesStatus = !filterStatus || itemStatus === filterStatus;

        const matchesOrderId =
          !filterCriteria.orderId ||
          getNestedValue(item, "ref")
            ?.toLowerCase()
            .includes(filterCriteria.orderId.toLowerCase());

        const matchesTableNumber =
          !filterCriteria.tableNumber ||
          String(item.table_id?.name).toLowerCase() ===
            String(filterCriteria.tableNumber).toLowerCase();

        return (
          matchesEmployee &&
          matchesOrderType &&
          matchesStatus &&
          matchesOrderId &&
          matchesTableNumber
        );
      });
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue = getNestedValue(a, sortConfig.key);
        let bValue = getNestedValue(b, sortConfig.key);

        // Handle different data types
        switch (sortConfig.key) {
          case "ref":
            const orderNumA = extractOrderNumber(aValue);
            const orderNumB = extractOrderNumber(bValue);
            return sortConfig.direction === "ascending"
              ? orderNumA - orderNumB
              : orderNumB - orderNumA;

          case "total_amount":
            const amountA = parseFloat(aValue) || 0;
            const amountB = parseFloat(bValue) || 0;
            return sortConfig.direction === "ascending"
              ? amountA - amountB
              : amountB - amountA;

          case "createdAt":
            const aDate = new Date(aValue).getTime();
            const bDate = new Date(bValue).getTime();
            return sortConfig.direction === "ascending"
              ? aDate - bDate
              : bDate - aDate;

          case "status":
            aValue = normalizeStatus(aValue);
            bValue = normalizeStatus(bValue);
            break;

          case "order_type_id.type":
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
            break;

          case "created_by.name":
            aValue = String(aValue || "").toLowerCase();
            bValue = String(bValue || "").toLowerCase();
            break;
        }

        // Default string comparison
        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

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
