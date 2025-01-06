import { TypographyP } from "@/components/ui/typography";
import { selectOrder } from "@/store/slices/order/createOrder";
import { useSelector } from "react-redux";

export const OrderInfo = () => {
  const order = useSelector(selectOrder);
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  switch (orderType.type) {
    case "takeaway":
      return (
        <div className="flex items-center justify-center space-x-2 w-[200px]">
          <div className="h-9 flex-1 items-center justify-center rounded-md dark:bg-secondary-white bg-primary-black">
            <TypographyP>
              {order.coaster_call !== null &&
                orderType.select_caoster_call === true &&
                `Coaster Call - N ${order.coaster_call}`}
              {order.coaster_call === null &&
                orderType.select_caoster_call === false &&
                "Takeaway"}
            </TypographyP>
          </div>
        </div>
      );
    case "delivery":
      return (
        <div className="flex items-center justify-center space-x-2 w-[200px]">
          <div className="h-9 w-9 bg-red-500 rounded-md"></div>
          <div className="h-9 flex-1 items-center justify-center rounded-md dark:bg-secondary-white bg-primary-black">
            <TypographyP>
              {order.coaster_call !== null &&
                orderType.select_caoster_call === true &&
                `Coaster Call - N ${order.coaster_call}`}
              {order.coaster_call === null &&
                orderType.select_caoster_call === false &&
                "Takeaway"}
            </TypographyP>
          </div>
        </div>
      );
    case "on_place":
      return <div>On place</div>;
    default:
      return null;
  }
};
