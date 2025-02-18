import { getOrderById, printOrder } from "@/api/services";
import { PrinterIcon } from "@/assets/figma-icons";
import {
  Table2Seats,
  Table4Seats,
  Table6Seats,
  Table8Seats,
} from "@/assets/tables-icons";
import { useOrder } from "@/components/global/drawers/order-details/context/OrderContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { refreshOrders } from "@/store/slices/data/orders.slice";
import { Order } from "@/interfaces/order";
import { format } from "date-fns";
import { SortDesc } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface OrdersTableProps {
  data: any;
  withPrintButton?: boolean;
  onSort?: (key: string) => void;
  sortConfig?: { key: string; direction: "ascending" | "descending" } | null;
}

const OrderTypeCell = ({ order }: { order: any }) => {
  const orderType = order.order_type_id;

  // Compute baseUrl dynamically
  const baseUrl =
    localStorage.getItem("ipAddress") ||
    window.ENV?.VITE_BASE_URL ||
    import.meta.env.VITE_BASE_URL;

  if (!orderType) return <span>-</span>;

  const renderOrderTypeContent = () => {
    switch (orderType.type) {
      case "takeAway":
        if (order.coaster_call !== null && orderType.select_coaster_call) {
          return `Coaster Call - N° ${order.coaster_call}`;
        }
        if (order.coaster_call === null && !orderType.select_coaster_call) {
          return "Takeaway";
        }
        if (order.coaster_call === null && orderType.select_table) {
          const tableName =
            typeof order.table_id === "object"
              ? order.table_id?.name
              : order.table_id;
          return `Table ${tableName || ""} - Takeaway`;
        }
        return orderType.name;

      case "delivery":
        if (order.delivery_guy_id === null && orderType.select_delivery_boy) {
          return orderType.name;
        }
        if (order.delivery_guy_id === null && !orderType.select_delivery_boy) {
          if (orderType.delivery_companies_name === "Glovo") {
            if (order.glovo_pick_up_code) {
              return `Glovo - N° ${order.glovo_pick_up_code}`;
            } else {
              return "Glovo";
            }
          } else {
            return orderType.name;
          }
        }
        if (order.delivery_guy_id !== null && orderType.select_delivery_boy) {
          return `${orderType.name}`;
        }
        return orderType.name;

      case "onPlace":
        const TableIcon =
          order.table_id?.seats > 7
            ? Table8Seats
            : order.table_id?.seats > 5
            ? Table6Seats
            : order.table_id?.seats > 3
            ? Table4Seats
            : Table2Seats;

        return (
          <div className="flex items-center space-x-1.5">
            {order.table_id && (
              <TableIcon className="w-auto h-5 text-primary-black dark:text-white/80" />
            )}
            <TypographySmall className="font-medium">
              {order.table_id
                ? `Table N° ${order.table_id.name}`
                : orderType.name}
            </TypographySmall>
          </div>
        );

      default:
        return orderType.name;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {orderType.image && (
        <div className="h-6 w-6 rounded-md relative overflow-hidden">
          <img
            src={`${baseUrl}${orderType.image}`}
            alt="order-type"
            loading="lazy"
            crossOrigin="anonymous"
            className="absolute w-full h-full object-cover top-0 left-0"
          />
        </div>
      )}
      {renderOrderTypeContent()}
    </div>
  );
};

export default function OrdersTable({
  data = [],
  withPrintButton,
  onSort,
  sortConfig,
}: OrdersTableProps) {
  const dispatch = useDispatch();
  const { setSelectedOrder, setOpenOrderDetails } = useOrder();
  const currentPage = useSelector((state: any) => state.orders.currentPage);
  const pageSize = useSelector((state: any) => state.orders.pageSize);

  // Define table columns based on the actual data structure
  const columns = [
    { key: "ref", label: "Order ID" },
    { key: "createdAt", label: "Date & Time" },
    { key: "created_by.name", label: "Ordered by" },
    { key: "order_type", label: "Order Type", custom: true },
    { key: "status", label: "Status" },
    {
      key: "total_amount",
      label: "Order Total (Dhs)",
      isPrice: true,
      alignRight: true,
    },
  ];

  const handleRowClick = async (order: Order) => {
    try {
      const response = await getOrderById(order._id);
      if (response.data) {
        setSelectedOrder({
          ...response.data,
          id: order._id,
        });
        setOpenOrderDetails(true);
        await dispatch(refreshOrders() as any);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const formatCellValue = (key: string, value: any): string => {
    switch (key) {
      case "createdAt":
        return format(new Date(value), "dd.MM.yyyy HH:mm");
      case "total_amount":
        return `${Number(value || 0).toFixed(2)} Dhs`;
      case "status":
        return value?.charAt(0).toUpperCase() + value?.slice(1) || "-";
      default:
        return value || "-";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-green-500 dark:text-green-400";
      case "canceled":
        return "text-error-color";
      case "new":
        return "text-primary-blue";
      default:
        return "";
    }
  };

  const renderCell = (order: Order, column: (typeof columns)[0]) => {
    if (column.key === "order_type") {
      return <OrderTypeCell order={order} />;
    }

    const value = column.key
      .split(".")
      .reduce((obj: any, key: string) => obj?.[key], order);

    if (column.key === "status") {
      return (
        <span className={getStatusColor(value)}>
          {formatCellValue(column.key, value)}
        </span>
      );
    }

    if (column.isPrice) {
      return (
        <div className="flex items-center justify-end gap-2">
          <span>{formatCellValue(column.key, value)}</span>
          {withPrintButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                printOrder(order._id);
              }}
            >
              <PrinterIcon className="h-5 w-5 dark:text-white text-primary-black" />
            </Button>
          )}
        </div>
      );
    }

    return formatCellValue(column.key, value);
  };

  // Get paginated data
  const paginatedData = data.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  return (
    <div className="rounded-md h-full relative pr-3 [&>div]:max-h-[530px]">
      <Table>
        <TableHeader className="sticky top-0 z-10 dark:bg-secondary-black bg-white">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`text-[0.8rem] text-primary-black dark:text-white ${
                  column.alignRight ? "text-right" : ""
                }`}
                onClick={() => onSort?.(column.key)}
                style={{ cursor: "pointer" }}
              >
                <div
                  className={`flex items-center ${
                    column.alignRight ? "justify-end" : "justify-between"
                  }`}
                >
                  <span className="pr-2.5">{column.label}</span>
                  <SortDesc
                    className={cn(
                      "h-3 w-3",
                      sortConfig?.key === column.key
                        ? "text-primary"
                        : "text-muted-foreground",
                      sortConfig?.key === column.key &&
                        sortConfig.direction === "ascending" &&
                        "rotate-180"
                    )}
                  />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((order: any) => (
              <TableRow
                key={order._id}
                onClick={() => handleRowClick(order)}
                className="cursor-pointer hover:bg-white/70 dark:hover:bg-white/5"
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${order._id}-${column.key}`}
                    className={cn(
                      column.alignRight ? "text-right" : "",
                      "text-sm"
                    )}
                  >
                    {renderCell(order, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No orders available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
