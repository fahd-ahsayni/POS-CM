import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchOrders, refreshOrders } from "@/store/slices/data/ordersSlice";

import { TypographyH2 } from "@/components/ui/typography";
import DataTable from "@/components/views/orders/components/DataTable";
import SelectNumberOfOrderPerPage from "@/components/views/orders/components/SelectNumberOfOrderPerPage";
import { TablePagination } from "@/components/views/orders/components/TablePagination";
import FiltreOrders from "@/components/views/orders/components/FiltreOrders";
import { motion } from "framer-motion";
import { TABLE_HEADERS } from "@/components/views/orders/config/table-config";
import { RefreshCwIcon } from "lucide-react";

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, status: orderStatus } = useSelector(
    (state: RootState) => state.orders
  );

  useEffect(() => {
    if (orderStatus === "idle") {
      dispatch(fetchOrders());
    }
  }, [orderStatus, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.35 }}
      className="flex h-full w-[calc(100vw-80px)] flex-col overflow-hidden px-4 pt-8 sm:px-6"
    >
      <Header />
      <main className="mt-6 flex-1 overflow-hidden">
        <DataTable
          headers={TABLE_HEADERS}
          data={orders}
          caption="A list of your recent orders."
        />
      </main>
      <Footer ordersLength={orders.length} />
    </motion.div>
  );
}

function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const handleRefreshOrders = () => {
    dispatch(refreshOrders());
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <TypographyH2>Orders</TypographyH2>
        <button onClick={handleRefreshOrders}>
          <RefreshCwIcon className="w-4 h-4 rotate-[66deg] text-secondary-black dark:text-secondary-white" />
        </button>
      </div>
      <FiltreOrders />
    </div>
  );
}

function Footer({ ordersLength }: { ordersLength: number }) {
  return (
    <div className="flex h-14 w-full items-center justify-between bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <SelectNumberOfOrderPerPage itemsLength={ordersLength} />
      </div>
      <div>
        <TablePagination itemsLength={ordersLength} />
      </div>
    </div>
  );
}
