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
import { motion } from "framer-motion";
import Header from "./components/Header";

export default function WaitingOrders() {
  const { holdOrders, getOrderTypeName, handleRowClick } = useWaitingOrders();

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.35 }}
      className="flex h-full w-[calc(100vw-80px)] flex-col overflow-hidden px-4 pt-8 sm:px-6"
    >
      <Header title="Waiting Orders" />
      <Table className="mt-6">
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
    </motion.div>
  );
}
