import React, { useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, SortDesc } from "lucide-react";
import { useOrdersContext } from "@/components/views/orders/context/orderContext"; // Import the context

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

const DataTable: React.FC<DataTableProps> = ({ headers, data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const { pageSize, currentPage } = useOrdersContext();

  const sortedData = [...data].sort((a, b) => {
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

  const paginatedData = sortedData.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  console.log("Current Page:", currentPage);
  console.log("Page Size:", pageSize);
  console.log("Paginated Data:", paginatedData);

  const requestSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusTextColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-500";
      case "canceled":
        return "text-red-500 dark:text-red-600";
      default:
        return "";
    }
  };

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
                  textOverflow: "ellipsis"
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



export default DataTable;
