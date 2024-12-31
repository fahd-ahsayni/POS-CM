import { useState, useEffect, useCallback } from "react";
import { WaitingOrder } from "@/types/waitingOrders";
import { formatTableData } from "../config/waiting-table-config";
import { ProductSelected } from "@/types";

export const useWaitingOrdersManagement = () => {
  const [holdOrders, setHoldOrders] = useState<WaitingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWaitingOrders = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      const storedOrders = JSON.parse(
        localStorage.getItem("holdOrders") || "[]"
      );
      const formattedOrders: WaitingOrder[] = storedOrders.map(
        (order: any) => ({
          _id: order._id,
          createdAt: order.createdAt,
          created_by: order.created_by || { name: "-", _id: "-" },
          order_type_id: order.order_type_id || { type: "-" },
          total_amount: order.total_amount || 0,
          orderLines: (order.orderlines || []).map((line: any) => ({
            product_variant_id: line.product_variant_id,
            quantity: line.quantity || 1,
            price: line.price || 0,
            customer_index: 1, // Reset to 1
            notes: line.notes || [],
            is_paid: false,
            is_ordred: false,
            suite_commande: false,
          })),
        })
      );

      setHoldOrders(formattedOrders);
    } catch (error) {
      console.error("Error loading waiting orders:", error);
      setError("Failed to load waiting orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeWaitingOrder = useCallback((orderId: string) => {
    setHoldOrders((prev) => prev.filter((order) => order._id !== orderId));

    try {
      const storedOrders = JSON.parse(
        localStorage.getItem("holdOrders") || "[]"
      );
      localStorage.setItem(
        "holdOrders",
        JSON.stringify(
          storedOrders.filter((order: WaitingOrder) => order._id !== orderId)
        )
      );
    } catch (error) {
      console.error("Error removing waiting order:", error);
      setError("Failed to remove waiting order");
    }
  }, []);

  useEffect(() => {
    loadWaitingOrders();
  }, [loadWaitingOrders]);

  return {
    holdOrders,
    loading,
    error,
    loadWaitingOrders,
    removeWaitingOrder,
    formattedOrders: holdOrders.map(formatTableData),
  };
};

export const handleWaitingOrderSelect = (
  order: WaitingOrder,
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>,
  setCustomerIndex: (index: number) => void,
  setSelectedCustomer: (index: number) => void
) => {};
