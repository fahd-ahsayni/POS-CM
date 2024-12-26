import { printOrder } from "@/api/services";
import { PrinterIcon } from "@/assets/figma-icons";
import {
  TABLE_CONFIG,
  TABLE_MESSAGES,
} from "@/components/views/orders/config/table-config";
import { currency } from "@/preferences";
import { AppDispatch } from "@/store";
import { fetchOrders } from "@/store/slices/data/ordersSlice";
import { ArrowDownAZ, ArrowUpAZ, SortDesc } from "lucide-react";
import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { handleRowClick } from "../config/waiting-table-config";
import { useLeftViewContext } from "../../home/left-section/contexts/leftViewContext";
import { useNavigate } from "react-router-dom";
import { ORDER_SUMMARY_VIEW } from "../../home/right-section/constants";
import { useRightViewContext } from "../../home/right-section/contexts/rightViewContext";

export interface Header {
  key: string;
  label: string;
  width: string;
  isTextMuted?: boolean;
  isPrice?: boolean;
  hasPrintButton?: boolean;
}

interface DataTableProps {
  headers: Header[];
  data: Record<string, any>[];
  caption: string;
  formatData: (order: any, pos: any) => FormattedData;
  withPrintButton?: boolean;
  isWaitingOrders?: boolean;
}

interface FormattedData {
  [key: string]: any;
  orderId: string;
  dateTime: string;
  orderedBy: string;
  orderType: string;
  deliveryPerson: string;
  paymentStatus: string;
  orderTotal: number;
  id: string;
}

const DataTable: React.FC<DataTableProps> = ({
  headers,
  data,
  caption,
  formatData,
  withPrintButton,
  isWaitingOrders,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, pageSize, currentPage } = useSelector(
    (state: any) => state.orders
  );
  const pos = useSelector((state: RootState) => state.pos);
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const safeData = Array.isArray(data) ? data : [];

  const formattedData = useMemo(
    () => safeData.map((order) => formatData(order, pos)),
    [safeData, pos]
  );

  const sortedData = useMemo(() => {
    if (!sortConfig) return formattedData;

    return [...formattedData].sort((a: FormattedData, b: FormattedData) => {
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
        withPrintButton={withPrintButton}
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
  withPrintButton?: boolean;
}> = memo(({ headers, data, getStatusTextColor, withPrintButton }) => (
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
            withPrintButton={withPrintButton}
            isWaitingOrders={true}
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
  withPrintButton?: boolean;
  isWaitingOrders?: boolean;
}> = memo(
  ({ header, item, getStatusTextColor, withPrintButton, isWaitingOrders }) => {
    const { setSelectedProducts } = useLeftViewContext();
    const { setViews, setCustomerIndex, setSelectedCustomer} = useRightViewContext();
    const navigate = useNavigate();

    return (
      <div
        onClick={() => {
          if (isWaitingOrders) {
            handleRowClick(item, setSelectedProducts, setCustomerIndex, setSelectedCustomer);
            navigate("/");
            setViews(ORDER_SUMMARY_VIEW);
          }
        }}
        className={`px-4 py-3 text-xs flex-shrink-0 ${
          header.key === "paymentStatus"
            ? getStatusTextColor(item[header.key])
            : ""
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
          <span className="text-right flex items-center justify-end w-full gap-2">
            {item[header.key].toFixed(currency.toFixed)} Dhs
            {withPrintButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  printOrder(item.id);
                }}
                className="hover:bg-primary-black/5 dark:hover:bg-white/5 p-1 rounded-md mr-2"
              >
                <PrinterIcon className="w-5 h-5 fill-white" />
              </button>
            )}
          </span>
        ) : (
          item[header.key]
        )}
      </div>
    );
  }
);

export default memo(DataTable);
