import { AppDispatch } from "@/store";
import { fetchOrders } from "@/store/slices/data/ordersSlice";
import { ArrowDownAZ, ArrowUpAZ, SortDesc } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Header {
  key: string;
  label: string;
  width: string;
  isTextMuted?: boolean;
  isPrice?: boolean;
}

interface DataTableProps {
  headers: Header[];
  data: Record<string, any>[];
  caption: string;
}

const DataTable: React.FC<DataTableProps> = ({ headers }) => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: any) => state.orders.orders);
  const pageSize = useSelector((state: any) => state.orders.pageSize);
  const currentPage = useSelector((state: any) => state.orders.currentPage);
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: string;
  } | null>(null);

  React.useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const sortedData = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (sortConfig !== null) {
        const key = sortConfig.key;
        if (a[key] < b[key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
      }
      return 0;
    });
  }, [orders, sortConfig]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize
    );
  }, [sortedData, currentPage, pageSize]);

  const getStatusTextColor = useCallback((status: string | undefined) => {
    if (!status) return ""; // Return an empty string if status is undefined
    switch (status.toLowerCase()) {
      case "paid":
        return "!text-green-500";
      case "canceled":
        return "text-red-500 dark:text-red-600";
      default:
        return "";
    }
  }, []);

  const requestSort = useCallback(
    (key: string) => {
      setSortConfig((prevSortConfig) => {
        let direction = "ascending";
        if (
          prevSortConfig &&
          prevSortConfig.key === key &&
          prevSortConfig.direction === "ascending"
        ) {
          direction = "descending";
        }
        return { key, direction };
      });
    },
    [sortConfig]
  );

  if (orders.length === 0) {
    return <div className="text-center py-4">Data not found</div>;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="sticky top-0 dark:bg-muted bg-white z-10 flex rounded-md">
        {headers.map((header) => (
          <div
            key={header.key}
            onClick={() => requestSort(header.key)}
            className="cursor-pointer px-4 py-2 text-sm flex items-center"
            style={{ width: header.width }}
          >
            {header.label}
            {sortConfig?.key === header.key ? (
              sortConfig.direction === "ascending" ? (
                <ArrowUpAZ className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ArrowDownAZ className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
              )
            ) : (
              <SortDesc className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
      <div>
        {paginatedData.map((item, index) => (
          <div key={index} className="flex">
            {headers.map((header) => (
              <div
                key={header.key}
                className={`px-4 py-3 text-sm ${
                  header.key === "paymentStatus"
                    ? getStatusTextColor(item[header.key])
                    : ""
                } ${header.isTextMuted ? "text-muted-foreground" : ""}`}
                style={{
                  width: header.width,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item[header.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DataTable);
