import OrdersTable from "@/components/views/orders/components/OrdersTable";
import {
  TABLE_HEADERS,
} from "@/components/views/orders/config/table-config";
import { AppDispatch, RootState } from "@/store";
import { fetchOrders, refreshOrders } from "@/store/slices/data/ordersSlice";
import { FilterCriteria } from "@/types";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import Footer from "./components/Footer";
import Header from "./components/Header";
import OrderDetails from "@/components/global/drawers/order-details/OrderDetails";

export interface OrdersState {
  orders: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { orders, status: orderStatus, error } = useSelector(
    (state: RootState) => state.orders
  );
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    employee: "",
    orderType: "",
    status: "",
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleRefreshOrders = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(refreshOrders());
    setLoading(false);
  };

  const handleFilterChange = (filters: FilterCriteria) => {
    setFilterCriteria(filters);
  };

  console.log('Orders in component:', orders, 'Status:', orderStatus, 'Error:', error);

  return (
    <>
      <OrderDetails />
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
              <BeatLoader color="#fb0000" size={10} />
            </div>
          ) : (
            <OrdersTable
              headers={TABLE_HEADERS}
              data={orders}
              caption="A list of your recent orders."
              withPrintButton={true}
              filterCriteria={filterCriteria}
            />
          )}
        </main>
        <Footer ordersLength={orders.length} />
      </motion.div>
    </>
  );
}
