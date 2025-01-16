import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useWaitingOrders } from "@/components/views/orders/hooks/useWaitingOrders";
import { motion } from "framer-motion";

export default function WaitingOrders() {
  const { holdOrders, getOrderTypeName, handleRowClick } = useWaitingOrders();

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.35 }}
      className="flex h-full w-[calc(100vw-80px)] flex-col overflow-hidden px-4 pt-8 sm:px-6"
    >
      <Table>
        <TableCaption>List of waiting orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead className="text-right">Order Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdOrders.map((order) => (
            <TableRow
              key={order._id}
              onClick={() => handleRowClick(order)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell className="font-medium">
                {format(new Date(order.createdAt), "dd.MM.yyyy - hh:mm a")}
              </TableCell>
              <TableCell>{order.created_by.name}</TableCell>
              <TableCell>{getOrderTypeName(order)}</TableCell>
              <TableCell className="text-right">
                ${order.total_amount.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
