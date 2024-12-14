import { TypographyH2, TypographySmall } from "@/components/ui/typography";
import DataTable from "@/components/global/DataTable";
import SelectNumberOfOrderPerPage from "@/components/views/orders/components/SelectNumberOfOrderPerPage";
import { TablePagination } from "@/components/views/orders/components/TablePagination";
import { orders } from "@/data";
import { OrdersProvider } from "@/components/views/orders/context/orderContext";

const headers = [
  { key: "orderId", label: "Order ID", width: "14%", isTextMuted: true },
  { key: "dateTime", label: "Date & Time", width: "17%", isTextMuted: true },
  { key: "orderedBy", label: "Ordered by", width: "12%", isTextMuted: false },
  { key: "orderType", label: "Order Type", width: "16%", isTextMuted: false },
  {
    key: "deliveryPerson",
    label: "Delivery Person",
    width: "14%",
    isTextMuted: true,
  },
  {
    key: "paymentStatus",
    label: "Payment Status",
    width: "15%",
    isTextMuted: true,
  },
  {
    key: "orderTotal",
    label: "Order Total",
    width: "12%",
    isTextMuted: false,
    isPrice: true,
  },
];

export default function OrdersPage() {
  return (
    <OrdersProvider>
      <div className="px-4 sm:px-6 pt-8 w-full flex flex-col h-full overflow-hidden">
        <TypographyH2>Orders</TypographyH2>

        <div className="flex-1 overflow-hidden mt-6">
          <DataTable
            headers={headers}
            data={orders}
            caption="A list of your recent orders."
          />
        </div>

        <div className="w-full h-14 bg-background flex justify-between items-center px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <SelectNumberOfOrderPerPage itemsLength={orders.length} />
          </div>
          <div>
            <TablePagination itemsLength={orders.length} />
          </div>
        </div>
      </div>
    </OrdersProvider>
  );
}
