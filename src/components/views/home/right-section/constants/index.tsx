import SelectTypeOfOrder from "../components/SelectTypeOfOrder";
import TakeAway from "../components/TakeAway";
import OnPlace from "../components/OnPlace";
import Delivery from "../components/Delivery";
import OwnDeliveryForm from "../components/OwnDeliveryForm";
import OrderSummary from "../components/OrderSummary";

export const TYPE_OF_ORDER_VIEW = "TypeOfOrder";
export const TAKE_AWAY_VIEW = "takeAway";
export const ON_PLACE_VIEW = "onPlace";
export const DELIVERY_VIEW = "delivery";
export const OWN_DELIVERY_FORM_VIEW = "OwnDeliveryForm";
export const ORDER_SUMMARY_VIEW = "OrderSummary";

export const tabsConfig = [
  { value: TYPE_OF_ORDER_VIEW, component: <SelectTypeOfOrder /> },
  { value: TAKE_AWAY_VIEW, component: <TakeAway /> },
  { value: ON_PLACE_VIEW, component: <OnPlace /> },
  { value: DELIVERY_VIEW, component: <Delivery /> },
  {
    value: OWN_DELIVERY_FORM_VIEW,
    component: <OwnDeliveryForm />,
    className: "pb-8",
  },
  { value: ORDER_SUMMARY_VIEW, component: <OrderSummary />, className: "pb-8" },
];
