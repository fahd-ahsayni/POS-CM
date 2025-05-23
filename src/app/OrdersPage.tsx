import OrderDetails from "@/components/global/drawers/order-details/OrderDetails";
import { TextShimmer } from "@/components/ui/text-shimmer";
import OrdersTable from "@/components/views/orders/components/OrdersTable";
import { useTableOrders } from "@/components/views/orders/hooks/useTableOrders";
import { FilterCriteria } from "@/interfaces/general";
import { loadingColors } from "@/preferences";
import { AppDispatch } from "@/store";
import {
  fetchOrders,
  refreshOrders,
  setFilteredDataLength,
} from "@/store/slices/data/orders.slice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { orders } = useSelector((state: any) => state.orders);

  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    employee: "",
    orderType: "",
    status: "",
    orderId: "",
    tableNumber: "",
  });

  const [rfidInput, setRfidInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const {
    sortedData: filteredOrders,
    sortConfig,
    handleSort,
  } = useTableOrders({
    data: orders,
    filterCriteria,
    defaultSort: {
      key: "createdAt",
      direction: "descending",
    },
  });

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

  // Handle RFID input
  const handleRfidSubmit = useCallback((orderId: string) => {
    setFilterCriteria((prev) => ({
      ...prev,
      orderId,
    }));
    setIsScanning(false);
    setRfidInput("");
  }, []);

  // Listen for RFID input
  useEffect(() => {
    let rfidTimeout: NodeJS.Timeout;
    let scanningTimeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if focus is on an input element
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Add the pressed key to the input
      setRfidInput((prev) => {
        const newInput = prev + e.key;
        
        // Only set scanning to true if we have actual input
        if (newInput.length > 0) {
          setIsScanning(true);
          
          // Clear previous scanning timeout and set new one
          clearTimeout(scanningTimeout);
          scanningTimeout = setTimeout(() => {
            setIsScanning(false);
          }, 2000); // Show scanning overlay for 2 seconds
        }
        
        return newInput;
      });

      // Clear previous timeout for input reset
      clearTimeout(rfidTimeout);

      // Set new timeout for input reset if no more keys are pressed
      rfidTimeout = setTimeout(() => {
        if (rfidInput && rfidInput.length > 0) {
          handleRfidSubmit(rfidInput);
        }
        setRfidInput("");
      }, 500); // Wait for 500ms before processing the complete input

      // Handle Enter key immediately
      if (e.key === "Enter" && rfidInput) {
        clearTimeout(rfidTimeout);
        clearTimeout(scanningTimeout);
        handleRfidSubmit(rfidInput);
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(rfidTimeout);
      clearTimeout(scanningTimeout);
    };
  }, [rfidInput, handleRfidSubmit]);

  return (
    <>
      <OrderDetails />
      <div className="flex h-full w-[calc(100vw-80px)] flex-col overflow-hidden px-4 pt-8 sm:px-6">
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
              <BeatLoader color={loadingColors.primary} size={10} />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">No orders available</p>
            </div>
          ) : (
            <OrdersTable
              data={filteredOrders}
              withPrintButton={true}
              onSort={handleSort}
              sortConfig={sortConfig}
            />
          )}
        </main>
        <Footer ordersLength={filteredOrders.length} />
        {isScanning && (
          <div className="absolute flex items-center justify-center w-screen h-screen bg-black/90 bottom-0 left-0 p-3 rounded shadow-lg z-[99] ">
            <TextShimmer>Scanning Order ID...</TextShimmer>
          </div>
        )}
      </div>
    </>
  );
}
