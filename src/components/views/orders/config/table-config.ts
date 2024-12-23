type Header = {
  key: string;
  label: string;
  width: string;
  isTextMuted: boolean;
  isPrice?: boolean;
};

export const TABLE_HEADERS: Header[] = [
  { key: "orderId", label: "Order ID", width: "12%", isTextMuted: true },
  { key: "dateTime", label: "Date & Time", width: "17%", isTextMuted: true },
  { key: "orderedBy", label: "Ordered by", width: "12%", isTextMuted: false },
  { key: "orderType", label: "Order Type", width: "16%", isTextMuted: false },
  {
    key: "deliveryPerson",
    label: "Delivery Person",
    width: "15%",
    isTextMuted: true,
  },
  {
    key: "paymentStatus",
    label: "Status",
    width: "13%",
    isTextMuted: true,
  },
  {
    key: "orderTotal",
    label: "Order Total (Dhs)",
    width: "16%",
    isTextMuted: false,
    isPrice: true,
  },
] as const;

export const TABLE_CONFIG = {
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },
  sorting: {
    defaultKey: "dateTime",
    defaultDirection: "descending" as const,
  },
  status: {
    colors: {
      paid: "!text-green-500",
      canceled: "text-primary-red",
      default: "text-primary-black dark:text-white",
    },
  },
} as const;

export const TABLE_MESSAGES = {
  noData: "Data not found",
  loading: "Loading orders...",
  error: "Error loading orders",
} as const;
