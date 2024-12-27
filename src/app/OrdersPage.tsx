import { AppDispatch, RootState } from "@/store";
import { fetchOrders, refreshOrders } from "@/store/slices/data/ordersSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "@/components/views/orders/components/DataTable";
import {
  formatData,
  TABLE_HEADERS,
} from "@/components/views/orders/config/table-config";
import { motion } from "framer-motion";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Loading } from "@/components/global/loading";
import { FilterCriteria } from "@/types";

interface OrdersState {
  orders: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { orders, status: orderStatus } = useSelector(
    (state: RootState) => state.orders as OrdersState
  );
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    employee: "",
    orderType: "",
    status: "",
  });

  const handleRefreshOrders = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(refreshOrders());
    setLoading(false);
  };

  const handleFilterChange = (filters: FilterCriteria) => {
    setFilterCriteria(filters);
  };

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
      <Header
        handleRefreshOrders={handleRefreshOrders}
        title="Orders"
        withFilter={true}
        onFilterChange={handleFilterChange}
      />
      <main className="mt-6 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loading color="text-red-600" />
          </div>
        ) : (
          <DataTable
            headers={TABLE_HEADERS}
            data={orders}
            caption="A list of your recent orders."
            withPrintButton={true}
            formatData={formatData}
            filterCriteria={filterCriteria}
            isWaitingOrders={false}
          />
        )}
      </main>
      <Footer ordersLength={orders.length} />
    </motion.div>
  );
}
