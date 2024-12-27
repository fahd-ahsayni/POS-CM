import { updateOrder } from "@/functions/updateOrder";
import { ProductSelected } from "./../../../../types/index";
import { format } from "date-fns";
import { useDispatch } from "react-redux";

type Header = {
  key: string;
  label: string;
  width: string;
  isTextMuted: boolean;
  isPrice?: boolean;
};

export const WAITING_TABLE_HEADERS: Header[] = [
  { key: "dateTime", label: "Date & Time", width: "20%", isTextMuted: true },
  { key: "orderedBy", label: "Created by", width: "20%", isTextMuted: false },
  { key: "orderType", label: "Order Type", width: "40%", isTextMuted: false },
  {
    key: "orderTotal",
    label: "Order Total (Dhs)",
    width: "20%",
    isTextMuted: false,
    isPrice: true,
  },
] as const;

export const WAITING_TABLE_CONFIG = {
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20],
  },
  sorting: {
    defaultKey: "dateTime",
    defaultDirection: "descending" as const,
  },
} as const;

export const WAITING_TABLE_MESSAGES = {
  noData: "No waiting orders found",
  loading: "Loading waiting orders...",
  error: "Error loading waiting orders",
} as const;

export const formatData = (order: any, pos: any) => {
  const posData = pos?.data.pos;
  const formattedDate = format(
    new Date(order.createdAt || new Date()),
    "dd.MM.yyyy - hh:mm a"
  );

  const posId = localStorage.getItem("posId");
  const findPos = posData.find((pos: any) => pos._id === posId);
  const user = findPos?.shift.user_id;

  const dispatch = useDispatch();

  dispatch(updateOrder({ order_type_id: order.order_type_id }));

  const generalData = localStorage.getItem("generalData");
  const orderTypes = generalData ? JSON.parse(generalData).orderTypes : [];
  const orderType = orderTypes.find(
    (type: any) => type._id === order.order_type_id
  );

  return {
    dateTime: formattedDate,
    orderedBy: user?.name,
    orderType: orderType?.name,
    orderTotal: order.total_amount || 0,
    orderLines: order.orderlines,
    orderId: order._id,
    _id: order._id,
    id: order._id,
    deliveryPerson: order.delivery_person || "",
    paymentStatus: order.payment_status || "",
  };
};

export const handleRowClick = (
  orderData: any,
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>,
  setCustomerIndex: (index: number) => void,
  setSelectedCustomer: (index: number) => void
) => {
  if (!orderData?.orderLines) {
    console.error("No orderlines found in order data");
    return;
  }

  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const variants = JSON.parse(localStorage.getItem("variants") || "[]");

  const mappedOrder = {
    ...orderData,
    orderLines: orderData.orderLines.map((orderline: any) => {
      const variant = variants.find(
        (v: any) => v._id === orderline.product_variant_id
      );
      const product = products.find((p: any) => p._id === variant?.product_id);

      return {
        ...product,
        variants: variant ? [variant] : [],
        product_variant_id: orderline.product_variant_id,
        quantity: orderline.quantity,
        price: orderline.price,
        customer_index: orderline.customer_index,
        order_type_id: orderData.order_type_id,
        uom_id: variant?.uom_id,
        notes: orderline.notes || [],
        is_paid: orderline.is_paid || false,
        is_ordred: orderline.is_ordred || false,
        suite_commande: orderline.suite_commande || false,
      };
    }),
  };

  const maxCustomerIndex = Math.max(
    ...mappedOrder.orderLines.map((orderline: any) => orderline.customer_index)
  );

  setCustomerIndex(maxCustomerIndex);
  setSelectedCustomer(maxCustomerIndex);

  setSelectedProducts(mappedOrder.orderLines);
  const holdOrders = JSON.parse(localStorage.getItem("holdOrders") || "[]");
  localStorage.setItem(
    "holdOrders",
    JSON.stringify(
      holdOrders.filter((order: any) => order._id !== orderData._id)
    )
  );
};
