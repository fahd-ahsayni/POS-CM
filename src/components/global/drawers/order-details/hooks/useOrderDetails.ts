import { createToast } from "@/components/global/Toasters";
import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { ORDER_SUMMARY_VIEW } from "@/components/views/home/right-section/constants";
import { refreshOrders } from "@/store/slices/data/orders.slice";
import { setOrderData } from "@/store/slices/order/create-order.slice";
import { Product, ProductVariant } from "@/types/product.types";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useOrder } from "../context/OrderContext";

export const useOrderDetails = (
  setLeftViews: (view: string) => void,
  setRightViews: (view: string) => void,
  setSelectedProducts: (products: any[]) => void
) => {
  const { selectedOrder, openOrderDetails, setOpenOrderDetails } = useOrder();
  const [selectedOrderlines, setSelectedOrderlines] = useState<string[]>([]);
  const [openCancelOrder, setOpenCancelOrder] = useState(false);
  const [openPayments, setOpenPayments] = useState(false);
  const [editedAmount, setEditedAmount] = useState<number | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ordersStatus = useSelector((state: any) => state.orders.status);

  const handleProcessPayment = () => {
    setOpenOrderDetails(false);
    setOpenPayments(true);
  };

  const handlePaymentComplete = async () => {
    try {
      setOpenPayments(false);
      setOpenOrderDetails(false);
      setEditedAmount(null);
      setSelectedOrderlines([]);
      await dispatch(refreshOrders() as any);
    } catch (error) {
      console.error("Error handling payment completion:", error);
    }
  };

  const handleCancelComplete = () => {
    try {
      setOpenCancelOrder(false);
      setOpenOrderDetails(false);

      if (ordersStatus !== "loading") {
        dispatch(refreshOrders() as any)
          .unwrap()
          .catch((error: any) => {
            console.error("Error refreshing orders:", error);
          });
      }
    } catch (error) {
      console.error("Error in handleCancelComplete:", error);
    }
  };

  const handleLoadOrder = useCallback(() => {
    if (!selectedOrder) return;

    try {
      const generalData = JSON.parse(
        localStorage.getItem("generalData") || "{}"
      );
      const products = generalData.products || [];

      if (selectedOrder.table_id) {
        const tableName =
          typeof selectedOrder.table_id === "object"
            ? (selectedOrder.table_id as { name: string }).name
            : selectedOrder.table_id;
        localStorage.setItem("tableNumber", tableName.toString());
      } else {
        localStorage.removeItem("tableNumber");
      }

      const selectedProducts = selectedOrder.orderline_ids
        .map((line: any) => {
          if (!line.product_variant_id?._id) {
            console.warn("Product variant ID is missing:", line);
            return null;
          }

          const product = products.find((p: Product) =>
            p.variants.some(
              (v: ProductVariant) => v._id === line.product_variant_id._id
            )
          );

          const variant = product?.variants.find(
            (v: ProductVariant) => v._id === line.product_variant_id._id
          );

          if (!product || !variant) {
            console.warn("Product or variant not found:", line);
            return null;
          }

          return {
            ...product,
            id: line._id,
            product_variant_id: variant._id,
            quantity: line.quantity,
            price: line.price,
            unit_price: line.price,
            customer_index: line.customer_index,
            order_type_id: line.order_type_id?._id || null,
            uom_id: variant.uom_id?._id || "",
            notes: line.notes || [],
            discount: null,
            is_paid: line.is_paid,
            is_ordred: line.is_ordred,
            suite_commande: line.suite_commande,
            high_priority: line.high_priority,
          };
        })
        .filter(Boolean);

      const cleanOrder = {
        waiter_id: selectedOrder.waiter_id,
        coaster_call: selectedOrder.coaster_call?.toString() || null,
        urgent: selectedOrder.urgent,
        shift_id: selectedOrder?.shift_id
          ? typeof selectedOrder.shift_id === "object"
            ? selectedOrder.shift_id._id
            : selectedOrder.shift_id
          : localStorage.getItem("shiftId") ?? "",
        table_id: selectedOrder.table_id
          ? typeof selectedOrder.table_id === "object"
            ? (selectedOrder.table_id as { _id: string })._id
            : selectedOrder.table_id
          : null,
        delivery_guy_id: selectedOrder.delivery_guy_id,
        discount: selectedOrder.discount_amount || null,
        client_id: selectedOrder.client_id
          ? typeof selectedOrder.client_id === "object"
            ? (selectedOrder.client_id as { _id: string })._id
            : selectedOrder.client_id
          : null,
        customer_count: selectedOrder.customer_count,
        notes: selectedOrder.notes?.[0] || "",
        one_time: selectedOrder.one_time,
        total_amount: selectedOrder.total_amount || 0,
        changed_price: selectedOrder.changed_price || null,
        order_type_id: selectedOrder.order_type_id?._id || null,
        orderlines: selectedProducts.map((line: any) => ({
          product_variant_id: line.product_variant_id,
          quantity: line.quantity,
          price: line.price,
          customer_index: line.customer_index,
          notes: line.notes,
          is_paid: line.is_paid,
          is_ordred: line.is_ordred,
          suite_commande: line.suite_commande,
          high_priority: line.high_priority,
          discount: line.discount,
          uom_id: line.uom_id,
          order_type_id: line.order_type_id,
        })),
      };

      dispatch(setOrderData(cleanOrder));
      setSelectedProducts(selectedProducts);
      setLeftViews(ALL_CATEGORIES_VIEW);
      setRightViews(ORDER_SUMMARY_VIEW);
      setOpenOrderDetails(false);
      navigate("/");
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error(
        createToast(
          "Error Loading Order",
          "Failed to load the selected order",
          "error"
        )
      );
    }
  }, [
    selectedOrder,
    dispatch,
    navigate,
    setLeftViews,
    setRightViews,
    setSelectedProducts,
    setOpenOrderDetails,
  ]);

  return {
    selectedOrder,
    openOrderDetails,
    setOpenOrderDetails,
    selectedOrderlines,
    setSelectedOrderlines,
    openCancelOrder,
    setOpenCancelOrder,
    openPayments,
    setOpenPayments,
    handleProcessPayment,
    handlePaymentComplete,
    orderAmount: editedAmount ?? selectedOrder?.total_amount ?? 0,
    setEditedAmount,
    handleCancelComplete,
    handleLoadOrder,
  };
};
