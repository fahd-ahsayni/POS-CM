import {
  Table2Seats,
  Table4Seats,
  Table6Seats,
  Table8Seats,
} from "@/assets/tables-icons";
import { TypographySmall } from "@/components/ui/typography";
import { getTableById } from "@/functions/getTableById";
import { selectOrder } from "@/store/slices/order/create-order.slice";
import { ProductVariant } from "@/interfaces/product";
import { useSelector } from "react-redux";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface OrderType {
  type: "takeAway" | "delivery" | "onPlace";
  name?: string;
  delivery_companies_name?: string;
  select_coaster_call?: boolean;
  select_table?: boolean;
  select_delivery_boy?: boolean;
  image?: string;
  delivery_product_variant_id?: ProductVariant;
}

const OrderBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-8 flex-1 flex items-center justify-center">
    <span className="font-medium text-[0.8rem] lg:text-sm">{children}</span>
  </div>
);

const OrderContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex items-center justify-center space-x-1.5">{children}</div>
);

const TakeawayOrder: React.FC<{ order: any; orderType: OrderType }> = ({
  order,
  orderType,
}) => {
  const getOrderText = () => {
    if (order.coaster_call !== null && orderType.select_coaster_call) {
      return `Coaster Call - N° ${order.coaster_call}`;
    }
    if (order.coaster_call === null && !orderType.select_coaster_call) {
      return "Takeaway";
    }
    if (order.coaster_call === null && orderType.select_table) {
      return `Table ${localStorage.getItem("tableNumber")} - Takeaway`;
    }
    return "";
  };

  return (
    <OrderContainer>
      <OrderBadge>{getOrderText()}</OrderBadge>
    </OrderContainer>
  );
};

const DeliveryOrder: React.FC<{ order: any; orderType: OrderType }> = ({
  order,
  orderType,
}) => {
  // Compute baseUrl dynamically
  const baseUrl =
    localStorage.getItem("ipAddress") ||
    window.ENV?.VITE_BASE_URL ||
    import.meta.env.VITE_BASE_URL;

  const getDeliveryText = () => {
    if (order.delivery_guy_id === null && orderType.select_delivery_boy) {
      return orderType.name;
    }
    if (order.delivery_guy_id === null && !orderType.select_delivery_boy) {
      if (orderType.delivery_companies_name === "Glovo") {
        return `Glovo`;
      } else {
        return orderType.name;
      }
    }
    if (order.delivery_guy_id !== null && orderType.select_delivery_boy) {
      return `${orderType.name}`;
    }
    return orderType.name;
  };

  return (
    <OrderContainer>
      {orderType.image && (
        <div className="h-6 w-6 rounded-md relative overflow-hidden">
          <img
            src={`${baseUrl}${orderType.image}`}
            alt="order-type-image"
            loading="lazy"
            crossOrigin="anonymous"
            className="absolute w-full h-full object-cover top-0 left-0 size-4"
          />
        </div>
      )}
      <OrderBadge>{getDeliveryText()}</OrderBadge>
    </OrderContainer>
  );
};

const OnPlaceOrder: React.FC<{ order: any; orderType: OrderType }> = ({
  orderType,
}) => {
  const [tableNumber] = useLocalStorage<any>("tableNumber", null);
  const tableSeats = getTableById(tableNumber || "")?.seats;

  const TableIcon =
    tableSeats && tableSeats > 7
      ? Table8Seats
      : tableSeats && tableSeats > 5
      ? Table6Seats
      : tableSeats && tableSeats > 3
      ? Table4Seats
      : Table2Seats;

  if (orderType.type === "onPlace") {
    return (
      <OrderContainer>
        <OrderBadge>
          <div className="flex items-center justify-center space-x-1.5">
            {tableNumber && (
              <TableIcon className="w-auto h-8 text-primary-black dark:text-white/80" />
            )}
            {tableNumber ? (
              <TypographySmall className="font-medium">
                Table N° {tableNumber}
              </TypographySmall>
            ) : (
              <TypographySmall className="font-medium">
                {orderType.name}
              </TypographySmall>
            )}
          </div>
        </OrderBadge>
      </OrderContainer>
    );
  }
  return null;
};

const OrderInfo = () => {
  const order = useSelector(selectOrder);
  const orderType: OrderType = JSON.parse(
    localStorage.getItem("orderType") || "{}"
  );

  const orderComponents = {
    takeAway: () => <TakeawayOrder order={order} orderType={orderType} />,
    delivery: () => <DeliveryOrder order={order} orderType={orderType} />,
    onPlace: () => <OnPlaceOrder order={order} orderType={orderType} />,
  };

  return orderComponents[orderType.type]?.() || null;
};

export const OrderBannerOnSummary = () => {
  return (
    <OrderContainer>
      <OrderInfo />
    </OrderContainer>
  );
};

export default OrderInfo;
