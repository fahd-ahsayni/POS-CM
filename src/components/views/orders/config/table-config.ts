type Header = {
  key: string;
  label: string;
  isTextMuted: boolean;
  isPrice?: boolean;
  hasPrintButton?: boolean;
  defaultValue?: string;
};

export const TABLE_HEADERS: Header[] = [
  { key: "ref", label: "Order ID", isTextMuted: true },
  { key: "createdAt", label: "Date & Time", isTextMuted: true },
  { key: "created_by.name", label: "Ordered by", isTextMuted: false },
  { key: "order_type_id.type", label: "Order Type", isTextMuted: false },
  {
    key: "delivery_guy_id.name",
    label: "Delivery Person",
    isTextMuted: true,
    defaultValue: "Not Assigned",
  },
  { key: "status", label: "Status", isTextMuted: true },
  {
    key: "total_amount",
    label: "Order Total (Dhs)",
    isTextMuted: false,
    isPrice: true,
    hasPrintButton: true,
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
      new: "text-primary-blue",
      default: "text-primary-black dark:text-white",
    },
  },
} as const;

export const TABLE_MESSAGES = {
  noData: "Data not found",
  loading: "Loading orders...",
  error: "Error loading orders",
} as const;
