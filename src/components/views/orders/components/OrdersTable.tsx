import { getOrderById, printOrder } from "@/api/services";
import { PrinterIcon } from "@/assets/figma-icons";
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
import { refreshOrders } from "@/store/slices/data/orders.slice";
import { Order } from "@/types/order.types";
import { format } from "date-fns";
import { SortDesc } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

interface OrdersTableProps {
  data: Order[];
  withPrintButton?: boolean;
}

export default function OrdersTable({
  data = [],
  withPrintButton,
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
    { key: "order_type_id.name", label: "Order Type" },
    { key: "table_id.name", label: "Table" },
    { key: "status", label: "Status" },
    { key: "total_amount", label: "Total (Dhs)", isPrice: true },
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
    <div className="rounded-md h-full relative overflow-y-auto pr-3">
      <Table>
        <TableHeader className="dark:bg-secondary-black bg-white sticky top-0 z-10">
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className="text-sm text-primary-black dark:text-white"
              >
                <div className="flex items-center justify-between">
                  {column.label}
                  <SortDesc className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((order) => (
              <TableRow
                key={order._id}
                onClick={() => handleRowClick(order)}
                className="cursor-pointer hover:bg-white/70 dark:hover:bg-white/5"
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${order._id}-${column.key}`}
                    className={column.isPrice ? "text-right" : ""}
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
