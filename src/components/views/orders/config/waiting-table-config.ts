import { OrderType, ProductSelected } from "@/types";
import { WaitingOrder } from "@/types/waitingOrders";

interface WaitingTableHeader {
  key: keyof WaitingTableData;
  label: string;
  isTextMuted: boolean;
  isPrice?: boolean;
  defaultValue: string;
}

export interface WaitingTableData
  extends Pick<WaitingOrder, "_id" | "total_amount"> {
  createdAt: string;
  "created_by.name": string;
  "order_type_id.type": OrderType["type"];
  [key: string]: string | number;
}

export const WAITING_TABLE_HEADERS: WaitingTableHeader[] = [
  {
    key: "createdAt",
    label: "Date & Time",
    isTextMuted: true,
    defaultValue: "-",
  },
  {
    key: "created_by.name",
    label: "Created by",
    isTextMuted: false,
    defaultValue: "Unknown",
  },
  {
    key: "order_type_id.type",
    label: "Order Type",
    isTextMuted: false,
    defaultValue: "-",
  },
  {
    key: "total_amount",
    label: "Order Total (Dhs)",
    isTextMuted: false,
    isPrice: true,
    defaultValue: "0.00",
  },
] as const;

export const WAITING_TABLE_CONFIG = {
  dateFormat: {
    options: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    } as Intl.DateTimeFormatOptions,
  },
} as const;

export const formatTableData = (order: WaitingOrder): WaitingTableData => ({
  _id: order._id,
  createdAt: order.createdAt
    ? new Date(order.createdAt).toLocaleString(
        "en-US",
        WAITING_TABLE_CONFIG.dateFormat.options
      )
    : WAITING_TABLE_HEADERS[0].defaultValue,
  "created_by.name":
    order.created_by?.name || WAITING_TABLE_HEADERS[1].defaultValue,
  "order_type_id.type":
    order.order_type_id?.type || WAITING_TABLE_HEADERS[2].defaultValue,
  total_amount: order.total_amount || 0,
});

export const handleRowClick = (
  orderData: WaitingOrder,
  setSelectedProducts: React.Dispatch<React.SetStateAction<ProductSelected[]>>,
  setCustomerIndex: (index: number) => void,
  setSelectedCustomer: (index: number) => void
) => {
  if (!orderData?.orderLines) return;

  const products = JSON.parse(localStorage.getItem("products") || "[]");
  const variants = JSON.parse(localStorage.getItem("variants") || "[]");

  const normalizedOrderLines = orderData.orderLines
    .map((line): ProductSelected | null => {
      const variant = variants.find(
        (v: any) => v._id === line.product_variant_id
      );
      const product = products.find((p: any) => p._id === variant?.product_id);

      if (!product || !variant) return null;

      const selectedOrder = {
        _id: product._id,
        name: product.name,
        image: product.image,
        sequence: product.sequence || 0,
        variants: [variant],
        product_variant_id: variant._id,
        quantity: line.quantity || 1,
        price: variant.price_ttc,
        customer_index: 1,
        notes: line.notes || [],
        is_paid: line.is_paid || false,
        is_ordred: line.is_ordred || false,
        suite_commande: line.suite_commande || false,
        order_type_id: "",
        uom_id: "",
        id: product._id,
        category: product.category || "",
        description: product.description || null,
        active: product.active || false,
        high_priority: false,
      };

      return selectedOrder;
    })
    .filter((line): line is ProductSelected => line !== null);

  setCustomerIndex(1);
  setSelectedCustomer(1);
  setSelectedProducts(normalizedOrderLines);

  const holdOrders = JSON.parse(localStorage.getItem("holdOrders") || "[]");
  localStorage.setItem(
    "holdOrders",
    JSON.stringify(
      holdOrders.filter((order: any) => order._id !== orderData._id)
    )
  );
};
