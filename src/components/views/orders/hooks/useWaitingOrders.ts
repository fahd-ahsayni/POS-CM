import { Order } from "@/types/order.types";
import { format, isValid } from "date-fns";
import { useCallback, useEffect, useState } from "react";

export function useWaitingOrders() {
  const [holdOrders, setHoldOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy HH:mm") : "Invalid Date";
  };

  const loadWaitingOrders = useCallback(() => {
    try {
      setLoading(true);
      const orders = JSON.parse(localStorage.getItem('holdOrders') || '[]');
      setHoldOrders(orders);
    } catch (err) {
      setError('Failed to load waiting orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeWaitingOrder = useCallback((orderId: string) => {
    try {
      const orders = JSON.parse(localStorage.getItem('holdOrders') || '[]');
      const updatedOrders = orders.filter((order: Order) => 
        order._id !== orderId
      );
      localStorage.setItem('holdOrders', JSON.stringify(updatedOrders));
      setHoldOrders(updatedOrders);
    } catch (err) {
      setError('Failed to remove order');
    }
  }, []);

  const formatTableData = useCallback(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const orderTypes = JSON.parse(
      localStorage.getItem("generalData") || "{}"
    ).orderTypes;

    return holdOrders.map((order) => ({
      _id: order._id,
      orderId: order._id,
      createdBy: user.name,
      orderType: orderTypes?.find(
        (type: any) => type._id === order.order_type_id
      )?.name || 'Unknown',
      createdAt: formatDate(order.createdAt || ""),
      orderTotal: order.total_amount || 0,
      originalOrder: order
    }));
  }, [holdOrders]);

  useEffect(() => {
    loadWaitingOrders();
  }, [loadWaitingOrders]);

  return {
    tableData: formatTableData(),
    loading,
    error,
    loadWaitingOrders,
    removeWaitingOrder
  };
}