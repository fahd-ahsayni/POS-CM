import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { selectOrder } from "@/store/slices/order/createOrder";
import { useSelector } from "react-redux";

interface OrderType {
  type: "takeAway" | "delivery" | "onPlace";
  name?: string;
  select_coaster_call?: boolean;
  select_table?: boolean;
  select_delivery_boy?: boolean;
  image?: string;
}

const OrderBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="h-8 flex-1 flex items-center justify-center rounded-md bg-white shadow px-5">
    <TypographySmall className="text-primary-black font-medium">
      {children}
    </TypographySmall>
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
  const getDeliveryText = () => {
    if (order.delivery_guy_id === null && orderType.select_delivery_boy) {
      return `${orderType.name} - N° ${order.delivery_guy_id}`;
    }
    if (order.delivery_guy_id === null && !orderType.select_delivery_boy) {
      return "Delivery";
    }
    return "";
  };

  return (
    <OrderContainer>
      {orderType.image && (
        <div className="h-8 w-9 rounded-md relative overflow-hidden">
          <img
            src={orderType.image}
            alt="order-type-image"
            loading="lazy"
            crossOrigin="anonymous"
            className="absolute w-full h-full object-cover top-0 left-0"
          />
        </div>
      )}
      <OrderBadge>{getDeliveryText()}</OrderBadge>
    </OrderContainer>
  );
};

const OrderInfo = () => {
  const order = useSelector(selectOrder);
  const orderType: OrderType = JSON.parse(
    localStorage.getItem("orderType") || "{}"
  );

  const orderComponents = {
    takeAway: () => <TakeawayOrder order={order} orderType={orderType} />,
    delivery: () => <DeliveryOrder order={order} orderType={orderType} />,
    onPlace: () => <div>On place</div>,
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
