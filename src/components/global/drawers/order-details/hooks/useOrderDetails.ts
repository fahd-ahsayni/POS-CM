import { createToast } from "@/components/global/Toasters";
import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { ORDER_SUMMARY_VIEW } from "@/components/views/home/right-section/constants";
import { Product, ProductVariant } from "@/interfaces/product";
import { refreshOrders } from "@/store/slices/data/orders.slice";
import {
  setDeliveryGuyId,
  setOrderData,
  setWaiterId,
} from "@/store/slices/order/create-order.slice";
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

  const calculateSelectedOrdersTotal = useCallback(() => {
    if (!selectedOrder || !selectedOrderlines.length) return 0;
    return selectedOrder.orderline_ids
      .filter((line: any) => selectedOrderlines.includes(line._id))
      .reduce((total: number, line: any) => total + line.price, 0);
  }, [selectedOrder, selectedOrderlines]);

  const handleProcessPayment = () => {
    if (!selectedOrder || selectedOrder.status === "canceled") return;

    // Get all valid orderlines (not canceled and not paid)
    const validOrderLineIds = selectedOrder.orderline_ids
      .filter(
        (line: any) => !line.is_paid && line.cancelled_qty < line.quantity
      )
      .map((line: any) => line._id);

    // If user has manually selected products, respect their selection
    if (selectedOrderlines.length > 0) {
      // Keep their selection, but filter out any invalid selections
      const validSelectedOrderlines = selectedOrderlines.filter((id) =>
        validOrderLineIds.includes(id)
      );
      setSelectedOrderlines(validSelectedOrderlines);
    } 
    // No need to show warning as we'll pay the full order if no products selected
    
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
    if (!selectedOrder || selectedOrder.status === "canceled") return;

    try {
      // Get generalData directly from localStorage to prevent the invalid hook call
      const generalDataStr = localStorage.getItem("generalData") || "{}";
      const generalData = JSON.parse(generalDataStr);
      const products = generalData.products || [];

      // Use all orderlines without filtering paid or cancelled ones
      const filteredOrderlines = selectedOrder.orderline_ids;

      // Create a filtered version of the order to save to localStorage
      const filteredOrder = {
        ...selectedOrder,
        orderline_ids: filteredOrderlines,
      };

      // Save the filtered order to localStorage
      localStorage.setItem("loadedOrder", JSON.stringify(filteredOrder));

      // Update order type in localStorage
      if (selectedOrder.order_type_id) {
        localStorage.setItem(
          "orderType",
          JSON.stringify({
            ...selectedOrder.order_type_id,
            select_delivery_boy:
              selectedOrder.order_type_id.type === "delivery",
            select_waiter: selectedOrder.order_type_id.type !== "delivery",
          })
        );
      }

      // Handle table selection
      if (selectedOrder.table_id) {
        const tableName =
          typeof selectedOrder.table_id === "object"
            ? (selectedOrder.table_id as { name: string }).name
            : selectedOrder.table_id;
        localStorage.setItem("tableNumber", tableName.toString());
      } else {
        localStorage.removeItem("tableNumber");
      }

      // Update staff selection based on order type
      if (selectedOrder.order_type_id?.type === "delivery") {
        dispatch(setWaiterId(null));
        dispatch(setDeliveryGuyId(selectedOrder.delivery_guy_id || null));
      } else {
        dispatch(setDeliveryGuyId(null));
        dispatch(setWaiterId(selectedOrder.waiter_id || null));
      }

      const selectedProducts = filteredOrderlines
        .map((line: any) => {
          if (!line.product_variant_id?._id) {
            return null;
          }

          const product = products.find((p: Product) =>
            p.variants.some(
              (v: ProductVariant) => v._id === line.product_variant_id._id
            )
          );

          // Instead of using the first variant, find the exact variant from the order
          const selectedVariant = product?.variants.find(
            (v: ProductVariant) => v._id === line.product_variant_id._id
          );

          if (!product || !selectedVariant) {
            console.warn("Product or variant not found:", line);
            return null;
          }

          // Find and add names for combo products
          const comboProducts =
            line.combo_prod_ids?.map((combo: any) => ({
              _id: combo._id,
              quantity: combo.quantity,
              name: combo.product_variant_id.name,
              notes: combo.notes || [],
              suite_commande: combo.suite_commande,
              suite_ordred: combo.suite_ordred,
              order_type_id: combo.order_type_id,
              price: combo.product_variant_id.default_price,
              menus: combo.product_variant_id.menus,
            })) || [];

          // Find and add names for supplements
          const comboSupplements =
            line.combo_supp_ids?.map((supp: any) => ({
              _id: supp._id,
              quantity: supp.quantity,
              name: supp.product_variant_id.name,
              notes: supp.notes || [],
              suite_ordred: supp.suite_ordred,
              suite_commande: supp.suite_commande,
              order_type_id: supp.order_type_id,
              price: supp.product_variant_id.default_price,
              menus: supp.product_variant_id.menus,
            })) || [];

          return {
            ...product,
            id: line._id,
            product_variant_id: selectedVariant._id,
            variants: [selectedVariant], // Set variants array to only contain the selected variant
            quantity: line.quantity,
            suite_ordred: line.suite_ordred,
            price: line.price,
            customer_index: line.customer_index,
            order_type_id: line.order_type_id?._id || null,
            uom_id: selectedVariant.uom_id?._id || "",
            notes: line.notes || [],
            discount: null,
            is_paid: line.is_paid,
            is_ordred: line.is_ordred,
            cancelled_qty: line.cancelled_qty,
            suite_commande: line.suite_commande,
            high_priority: line.high_priority,
            is_combo: comboProducts.length > 0 || comboSupplements.length > 0,
            combo_prod_ids: comboProducts,
            combo_supp_ids: comboSupplements,
            combo_items: {
              variants: comboProducts,
              supplements: comboSupplements,
            },
          };
        })
        .filter(Boolean);

      const cleanOrder = {
        _id: selectedOrder._id,
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
        delivery_guy_id: selectedOrder.delivery_guy_id
          ? typeof selectedOrder.delivery_guy_id === "object"
            ? (selectedOrder.delivery_guy_id as { _id: string })._id
            : selectedOrder.delivery_guy_id
          : null,
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

      // Trigger window refresh instead of page reload
      window.dispatchEvent(new Event("storage"));
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
    calculateSelectedOrdersTotal,
  };
};
