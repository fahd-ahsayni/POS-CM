import { useState } from "react";
import { TypographyH2 } from "@/components/ui/typography";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SelectNumberOfOrderPerPage from "@/components/views/orders/components/SelectNumberOfOrderPerPage";
import { TablePagination } from "@/components/views/orders/components/TablePagination";
import {
  ArrowDown01,
  ArrowUp01,
  ArrowDownZA,
  ArrowUpZA,
  ArrowUpDown,
} from "lucide-react";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function OrdersPage() {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortConfig !== null) {
      const key = sortConfig.key as keyof (typeof invoices)[0];
      if (a[key] < b[key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
    }
    return 0;
  });

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

  const getSortIcon = (key: string, className: string) => {
    if (!sortConfig || sortConfig.key !== key)
      return <ArrowUpDown className={className} />; // Default icon for unsorted

    const isNumeric = (value: string) =>
      !isNaN(parseFloat(value)) && isFinite(Number(value));
    const sampleValue = invoices[0][key as keyof (typeof invoices)[0]];

    if (isNumeric(sampleValue)) {
      return sortConfig.direction === "ascending" ? (
        <ArrowUp01 className={className} />
      ) : (
        <ArrowDown01 className={className} />
      ); // Numeric icons
    } else {
      return sortConfig.direction === "ascending" ? (
        <ArrowUpZA className={className} />
      ) : (
        <ArrowDownZA className={className} />
      ); // Character icons
    }
  };

  return (
    <div className="px-4 sm:px-6 pt-8 w-full">
      <TypographyH2>Orders</TypographyH2>

      <div className="w-full mt-10">
        <Table className="w-full rounded-lg">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader className="bg-muted !rounded-lg">
            <TableRow>
              <TableHead onClick={() => requestSort("invoice")}>
                <span className="flex items-center gap-x-1">
                  <span>Invoice</span>
                  {getSortIcon("invoice", "w-3.5 h-3.5")}
                </span>
              </TableHead>
              <TableHead onClick={() => requestSort("paymentStatus")}>
                <span className="flex items-center gap-x-1">
                  <span>Status</span>{" "}
                  {getSortIcon("paymentStatus", "w-3.5 h-3.5")}
                </span>
              </TableHead>
              <TableHead onClick={() => requestSort("paymentMethod")}>
                <span className="flex items-center gap-x-1">
                  <span>Method</span>{" "}
                  {getSortIcon("paymentMethod", "w-3.5 h-3.5")}
                </span>
              </TableHead>
              <TableHead onClick={() => requestSort("totalAmount")}>
                <span className="flex items-center gap-x-1">
                  <span>Total</span> {getSortIcon("totalAmount", "w-3.5 h-3.5")}
                </span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInvoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.paymentStatus}</TableCell>
                <TableCell>{invoice.paymentMethod}</TableCell>
                <TableCell>{invoice.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="w-full h-14 absolute bottom-0 left-0 bg-background flex justify-between items-center px-4 sm:px-6">
        <SelectNumberOfOrderPerPage />
        <div>
          <TablePagination />
        </div>
      </div>
    </div>
  );
}
