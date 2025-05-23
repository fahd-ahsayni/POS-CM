import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWaitingOrders } from "@/components/views/orders/hooks/useWaitingOrders";
import { currency } from "@/preferences";
import { format } from "date-fns";
import Header from "./components/Header";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function WaitingOrders() {
  const { holdOrders, getOrderTypeName, handleRowClick } = useWaitingOrders();

  return (
    <ScrollArea className="flex rounded-md h-full w-[calc(100vw-80px)] flex-col overflow-hidden px-4 pt-8 sm:px-6">
      <Header title="Waiting Orders" />
      <Table className="mt-6 !rounded-lg overflow-hidden">
        {holdOrders.length === 0 && (
          <TableCaption>List of waiting orders</TableCaption>
        )}
        <TableHeader className="sticky top-0 bg-white dark:bg-secondary-black">
          <TableRow>
            <TableHead className="text-primary-black dark:text-white">
              Date & Time
            </TableHead>
            <TableHead className="text-primary-black dark:text-white">
              Created By
            </TableHead>
            <TableHead className="text-primary-black dark:text-white">
              Order Type
            </TableHead>
            <TableHead className="text-primary-black dark:text-white text-right">
              Order Total (Dhs)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdOrders.map((order) => (
            <TableRow
              key={order._id}
              onClick={() => handleRowClick(order)}
              className="cursor-pointer hover:bg-white/50 dark:hover:bg-white/5"
            >
              <TableCell className="font-medium">
                {format(new Date(order.createdAt), "dd.MM.yyyy - hh:mm a")}
              </TableCell>
              <TableCell>{order.created_by.name}</TableCell>
              <TableCell>{getOrderTypeName(order)}</TableCell>
              <TableCell className="text-right">
                {order.total_amount.toFixed(2)} {currency.currency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
