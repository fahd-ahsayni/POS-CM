import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchOrders } from "@/store/slices/data/ordersSlice";

import { TypographyH2 } from "@/components/ui/typography";
import DataTable from "@/components/views/orders/components/DataTable";
import SelectNumberOfOrderPerPage from "@/components/views/orders/components/SelectNumberOfOrderPerPage";
import { TablePagination } from "@/components/views/orders/components/TablePagination";
import FiltreOrders from "@/components/views/orders/components/FiltreOrders";
import { motion } from "framer-motion";

const headers = [
  { key: "orderId", label: "Order ID", width: "14%", isTextMuted: true },
  { key: "dateTime", label: "Date & Time", width: "17%", isTextMuted: true },
  { key: "orderedBy", label: "Ordered by", width: "12%", isTextMuted: false },
  { key: "orderType", label: "Order Type", width: "16%", isTextMuted: false },
  {
    key: "deliveryPerson",
    label: "Delivery Person",
    width: "14%",
    isTextMuted: true,
  },
  {
    key: "paymentStatus",
    label: "Payment Status",
    width: "15%",
    isTextMuted: true,
  },
  {
    key: "orderTotal",
    label: "Order Total",
    width: "12%",
    isTextMuted: false,
    isPrice: true,
  },
];

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.orders.orders);
  const orderStatus = useSelector((state: RootState) => state.orders.status);

  useEffect(() => {
    if (orderStatus === "idle") {
      dispatch(fetchOrders());
    }
  }, [orderStatus, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        duration: 0.35,
      }}
      className="px-4 sm:px-6 pt-8 w-full flex flex-col h-full overflow-hidden"
    >
      <div className="flex justify-between items-center">
        <TypographyH2>Orders</TypographyH2>
        <FiltreOrders />
      </div>

      <div className="flex-1 overflow-hidden mt-6">
        <DataTable
          headers={headers}
          data={orders}
          caption="A list of your recent orders."
        />
      </div>

      <div className="w-full h-14 bg-background flex justify-between items-center px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <SelectNumberOfOrderPerPage itemsLength={orders.length} />
        </div>
        <div>
          <TablePagination itemsLength={orders.length} />
        </div>
      </div>
    </motion.div>
  );
}
