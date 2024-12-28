import Delivery from "../components/Delivery";
import OrderSummary from "../components/OrderSummary";
import OwnDeliveryForm from "../components/OwnDeliveryForm";
import SelectTypeOfOrder from "../components/SelectTypeOfOrder";
import CoasterCall from "../components/CoasterCall";
import NumberOfTable from "../components/NumberOfTable";

export const TYPE_OF_ORDER_VIEW = "type-of-order";
export const NUMBER_OF_TABLE_VIEW = "number-of-table";
export const COASTER_CALL_VIEW = "coaster-call";
export const DELIVERY_VIEW = "delivery";
export const OWN_DELIVERY_FORM_VIEW = "own-delivery-form";
export const ORDER_SUMMARY_VIEW = "order-summary";

export const tabsConfig = [
  { value: TYPE_OF_ORDER_VIEW, component: <SelectTypeOfOrder /> },
  { value: COASTER_CALL_VIEW, component: <CoasterCall /> },
  { value: NUMBER_OF_TABLE_VIEW, component: <NumberOfTable /> },
  { value: DELIVERY_VIEW, component: <Delivery /> },
  {
    value: OWN_DELIVERY_FORM_VIEW,
    component: <OwnDeliveryForm />,
    className: "pb-8",
  },
  { value: ORDER_SUMMARY_VIEW, component: <OrderSummary />, className: "pb-8" },
];
