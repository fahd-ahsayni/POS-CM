import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { selectOrder } from "@/store/slices/order/createOrder";
import { useSelector } from "react-redux";

interface OrderType {
  type: "takeaway" | "delivery" | "onPlace";
  name?: string;
  select_caoster_call?: boolean;
  select_table?: boolean;
  select_delivery_boy?: boolean;
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
    if (order.coaster_call !== null && orderType.select_caoster_call) {
      return `Coaster Call - N ${order.coaster_call}`;
    }
    if (order.coaster_call === null && !orderType.select_caoster_call) {
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
      <div className="h-8 w-9 bg-red-500 rounded-md" />
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
    takeaway: () => <TakeawayOrder order={order} orderType={orderType} />,
    delivery: () => <DeliveryOrder order={order} orderType={orderType} />,
    onPlace: () => <div>On place</div>,
  };

  return orderComponents[orderType.type]?.() || null;
};

export const OrderBannerOnSummary = () => {
  const order = useSelector(selectOrder);

  return (
    <OrderContainer>
      <OrderInfo />
      {order.one_time && (
        <div
          className={cn(
            "h-8 bg-blue-600 text-white flex items-center justify-center px-2 rounded-md"
          )}
        >
          <TypographySmall className="font-medium">One Time</TypographySmall>
        </div>
      )}
    </OrderContainer>
  );
};

export default OrderInfo;
