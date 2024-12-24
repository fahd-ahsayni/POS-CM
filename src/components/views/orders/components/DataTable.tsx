import { AppDispatch } from "@/store";
import { fetchOrders } from "@/store/slices/data/ordersSlice";
import { Order } from "@/types/getDataByDay";
import { ArrowDownAZ, ArrowUpAZ, SortDesc } from "lucide-react";
import React, { useCallback, useMemo, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TABLE_CONFIG,
  TABLE_MESSAGES,
} from "@/components/views/orders/config/table-config";
import { format } from "date-fns";
import { currency } from "@/preferences";
import { PrinterIcon } from "@/assets/figma-icons";
import { printOrder } from "@/api/services";


export interface Header {
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

const formatData = (order: Order) => {
  const formattedDate = format(
    new Date(order.createdAt),
    "dd.MM.yyyy - hh:mm a"
  );

  return {
    orderId: order.ref,
    dateTime: formattedDate,
    orderedBy: order.created_by.name,
    orderType: order.order_type_id.type,
    deliveryPerson: order.delivery_guy_id || "Not Assigned",
    paymentStatus: order.status,
    orderTotal: order.total_amount,
    id: order._id,
  };
};

const DataTable: React.FC<DataTableProps> = ({ headers }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, pageSize, currentPage } = useSelector(
    (state: any) => state.orders
  );
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const formattedData = useMemo(() => orders.map(formatData), [orders]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return formattedData;

    return [...formattedData].sort((a, b) => {
      const { key, direction } = sortConfig;
      const comparison = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
      return direction === "ascending" ? comparison : -comparison;
    });
  }, [formattedData, sortConfig]);

  const paginatedData = useMemo(
    () =>
      sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize),
    [sortedData, currentPage, pageSize]
  );

  const getStatusTextColor = useCallback((status?: string) => {
    if (!status) return "";
    return (
      TABLE_CONFIG.status.colors[
        status.toLowerCase() as keyof typeof TABLE_CONFIG.status.colors
      ] || TABLE_CONFIG.status.colors.default
    );
  }, []);

  const requestSort = useCallback((key: string) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev?.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  }, []);

  if (!orders.length) {
    return <div className="text-center py-4">{TABLE_MESSAGES.noData}</div>;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <TableHeader
        headers={headers}
        sortConfig={sortConfig}
        onSort={requestSort}
      />
      <TableBody
        headers={headers}
        data={paginatedData}
        getStatusTextColor={getStatusTextColor}
      />
    </div>
  );
};

const TableHeader: React.FC<{
  headers: Header[];
  sortConfig: { key: string; direction: string } | null;
  onSort: (key: string) => void;
}> = memo(({ headers, sortConfig, onSort }) => (
  <div className="sticky top-0 dark:bg-secondary-black bg-white z-10 flex rounded-md w-full mb-2">
    {headers.map((header) => (
      <HeaderCell
        key={header.key}
        header={header}
        sortConfig={sortConfig}
        onSort={onSort}
      />
    ))}
  </div>
));

const HeaderCell: React.FC<{
  header: Header;
  sortConfig: { key: string; direction: string } | null;
  onSort: (key: string) => void;
}> = memo(({ header, sortConfig, onSort }) => (
  <div
    onClick={() => onSort(header.key)}
    className="cursor-pointer px-4 py-2 text-xs flex items-center justify-between"
    style={{ width: header.width }}
  >
    {header.label}
    <SortIcon header={header} sortConfig={sortConfig} />
  </div>
));

const SortIcon: React.FC<{
  header: Header;
  sortConfig: { key: string; direction: string } | null;
}> = memo(({ header, sortConfig }) => {
  if (sortConfig?.key !== header.key) {
    return <SortDesc className="ml-2 h-3.5 w-3.5 text-neutral-dark-grey" />;
  }
  return sortConfig.direction === "ascending" ? (
    <ArrowUpAZ className="ml-2 h-3.5 w-3.5 text-neutral-dark-grey" />
  ) : (
    <ArrowDownAZ className="ml-2 h-3.5 w-3.5 text-neutral-dark-grey" />
  );
});

const TableBody: React.FC<{
  headers: Header[];
  data: any[];
  getStatusTextColor: (status?: string) => string;
}> = memo(({ headers, data, getStatusTextColor }) => (
  <div className="w-full">
    {data.map((item, index) => (
      <div
        key={index}
        className="flex w-full hover:bg-primary-black/5 dark:hover:bg-white/5 transition-colors duration-200 rounded-md cursor-pointer"
      >
        {headers.map((header) => (
          <TableCell
            key={header.key}
            header={header}
            item={item}
            getStatusTextColor={getStatusTextColor}
          />
        ))}
      </div>
    ))}
  </div>
));

const TableCell: React.FC<{
  header: Header;
  item: any;
  getStatusTextColor: (status?: string) => string;
}> = memo(({ header, item, getStatusTextColor }) => (
  <div
    className={`px-4 py-3 text-xs flex-shrink-0 ${
      header.key === "paymentStatus" ? getStatusTextColor(item[header.key]) : ""
    } ${
      header.isTextMuted
        ? "text-neutral-dark-grey"
        : "dark:text-white text-primary-black"
    }
    ${header.isPrice ? "text-right" : ""}`}
    style={{
      width: header.width,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {header.isPrice ? (
      <span className="text-right flex items-center justify-end w-full">
        {item[header.key].toFixed(currency.toFixed)} Dhs
        <button
          className="ml-4"
          onClick={() => {
            printOrder(item.id);
          }}
        >
          <PrinterIcon className="dark:!fill-white fill-primary-black w-5 h-5" />
        </button>
      </span>
    ) : (
      item[header.key]
    )}
  </div>
));

export default memo(DataTable);
