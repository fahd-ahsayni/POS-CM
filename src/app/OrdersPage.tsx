import OrderDetails from "@/components/global/drawers/order-details/OrderDetails";
import OrdersTable from "@/components/views/orders/components/OrdersTable";
import { TABLE_HEADERS } from "@/components/views/orders/config/table-config";
import { useTableOrders } from "@/components/views/orders/hooks/useTableOrders";
import { AppDispatch, RootState } from "@/store";
import {
  fetchOrders,
  refreshOrders,
  setFilteredDataLength
} from "@/store/slices/data/orders.slice";
import { FilterCriteria } from "@/types/general";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import Footer from "./components/Footer";
import Header from "./components/Header";

export interface OrdersState {
  orders: any[];
  status: "idle" | "loading" | "succeeded" | "failed";
}

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { orders } = useSelector((state: RootState) => state.orders);

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    employee: "",
    orderType: "",
    status: "",
    orderId: "",
    tableNumber: "",
  });

  // Use the hook instead of direct filtering
  const { sortedData: filteredOrders } = useTableOrders({
    data: orders,
    filterCriteria,
    defaultSort: {
      key: "createdAt",
      direction: "descending"
    }
  });

  // Update filtered data length in Redux store
  useEffect(() => {
    dispatch(setFilteredDataLength(filteredOrders.length));
  }, [filteredOrders.length, dispatch]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleRefreshOrders = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(refreshOrders());
    setFilterCriteria({
      employee: "",
      orderType: "",
      status: "",
      orderId: "",
      tableNumber: "",
    });
    setLoading(false);
  };

  const handleFilterChange = (filters: FilterCriteria) => {
    setFilterCriteria(filters);
  };

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
          totalItems={orders.length}
        />
        <main className="mt-6 flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <BeatLoader color="#fb0000" size={10} />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">No orders available</p>
            </div>
          ) : (
            <OrdersTable
              headers={TABLE_HEADERS}
              data={filteredOrders}
              caption="A list of your recent orders."
              withPrintButton={true}
              filterCriteria={filterCriteria}
            />
          )}
        </main>
        <Footer ordersLength={filteredOrders.length} />
      </motion.div>
    </>
  );
}
