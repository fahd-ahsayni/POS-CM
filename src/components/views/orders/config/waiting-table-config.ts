import { ProductSelected } from "@/types";
import { Order } from "@/types/getDataByDay";
import { format } from "date-fns";

type Header = {
  key: string;
  label: string;
  width: string;
  isTextMuted: boolean;
  isPrice?: boolean;
};

export const WAITING_TABLE_HEADERS: Header[] = [
  { key: "createdAt", label: "Date & Time", width: "20%", isTextMuted: true },
  {
    key: "created_by.name",
    label: "Created by",
    width: "20%",
    isTextMuted: false,
  },
  {
    key: "order_type_id.type",
    label: "Order Type",
    width: "40%",
    isTextMuted: false,
  },
  {
    key: "total_amount",
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

export const handleRowClick = (
  orderData: any,
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>,
  setCustomerIndex: (index: number) => void,
  setSelectedCustomer: (index: number) => void
) => {
  console.log("Clicked order data:", orderData);

  if (!orderData?.orderLines) {
    console.error("No orderlines found in order data");
    return;
  }

  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const variants = JSON.parse(localStorage.getItem("variants") || "[]");
  
  console.log("Available products:", products);
  console.log("Available variants:", variants);

  const mappedOrder = {
    ...orderData,
    orderLines: orderData.orderLines.map((orderline: any) => {
      console.log("Processing orderline:", orderline);

      const variant = variants.find(
        (v: any) => v._id === orderline.product_variant_id
      );
      const product = products.find((p: any) => p._id === variant?.product_id);

      console.log("Found variant:", variant);
      console.log("Found product:", product);

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

  console.log("Mapped order:", mappedOrder);

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

export const formatData = (order: any) => {
  return {
    _id: order._id,
    createdAt: format(new Date(order.createdAt || new Date()), "dd.MM.yyyy - hh:mm a"),
    created_by: order.created_by || { name: '-' },
    order_type_id: order.order_type_id || { type: '-' },
    total_amount: order.total_amount || 0,
    orderLines: order.orderlines || [],
  };
};
