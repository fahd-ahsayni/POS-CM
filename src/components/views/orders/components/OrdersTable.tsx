import { printOrder } from "@/api/services";
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
import { useTableOrders } from "@/components/views/orders/hooks/useTableOrders";
import { FilterCriteria } from "@/types";
import { Order } from "@/types/getDataByDay";
import { ArrowDownAZ, ArrowUpAZ, SortDesc } from "lucide-react";
import { useSelector } from "react-redux";

interface DataTableProps {
  headers: {
    key: string;
    label: string;
    isTextMuted?: boolean;
    isPrice?: boolean;
    hasPrintButton?: boolean;
    defaultValue?: string;
  }[];
  data: Order[];
  caption?: string;
  withPrintButton?: boolean;
  filterCriteria: FilterCriteria;
}

export default function DataTable({
  headers,
  data = [],
  withPrintButton,
  filterCriteria,
}: DataTableProps) {
  const { setSelectedOrder, setOpenOrderDetails } = useOrder();
  const currentPage = useSelector((state: any) => state.orders.currentPage);
  const pageSize = useSelector((state: any) => state.orders.pageSize);

  // Slice the data based on currentPage and pageSize
  const paginatedData = data.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const { sortedData, sortConfig, handleSort } = useTableOrders({
    data: paginatedData,
    filterCriteria,
  });

  const renderSortIcon = (headerKey: string) => {
    if (sortConfig?.key !== headerKey) {
      return <SortDesc className="ml-2 h-3.5 w-3.5 text-muted-foreground" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ArrowUpAZ className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
    ) : (
      <ArrowDownAZ className="ml-2 h-3.5 w-3.5 text-muted-foreground" />
    );
  };

  const renderCell = (
    row: any,
    header: DataTableProps["headers"][0],
    rowIndex: number
  ) => {
    // Helper function to get nested values
    const getValue = (obj: any, path: string, defaultValue = "-") => {
      const value = path.split(".").reduce((acc, part) => acc?.[part], obj);
      return value ?? defaultValue;
    };

    const cellValue = header.key.includes(".")
      ? getValue(row, header.key, header.defaultValue)
      : row[header.key] || header.defaultValue || "-";

    const cellContent = header.isPrice ? (
      <>
        <span>
          {typeof cellValue === 'number' 
            ? cellValue.toFixed(2) 
            : Number(cellValue || 0).toFixed(2)
          } Dhs
        </span>
        {withPrintButton && header.hasPrintButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              printOrder(row._id);
            }}
          >
            <PrinterIcon className="h-5 w-5 dark:fill-white fill-primary-black" />
          </Button>
        )}
      </>
    ) : (
      cellValue
    );

    return (
      <TableCell
        key={`${row._id || rowIndex}-${header.key}`}
        className={`${header.isTextMuted ? "text-muted-foreground" : ""} ${
          header.isPrice ? "text-right" : ""
        }`}
      >
        <div
          className={`flex items-center ${
            header.isPrice ? "justify-end" : "justify-between"
          }`}
        >
          {cellContent}
        </div>
      </TableCell>
    );
  };

  const handleRowClick = (row: any) => {
    setSelectedOrder({
      ...row,
      orderLines: row.orderline_ids || [],
      id: row._id,
    });
    setOpenOrderDetails(true);
  };

  return (
    <div className="rounded-md h-full relative overflow-y-auto">
      <Table className="w-full">
        <TableHeader className="dark:bg-secondary-black bg-white sticky top-0 z-10">
          <TableRow>
            {headers.map((header) => (
              <TableHead
                key={header.key}
                className="cursor-pointer text-sm text-primary-black dark:text-white"
                onClick={() => handleSort(header.key)}
              >
                <div className="flex items-center justify-between">
                  {header.label}
                  {renderSortIcon(header.key)}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((row, index) => (
              <TableRow
                key={row._id || index}
                onClick={() => handleRowClick(row)}
                className="cursor-pointer hover:bg-white/70 dark:hover:bg-white/5"
              >
                {headers.map((header) => renderCell(row, header, index))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
