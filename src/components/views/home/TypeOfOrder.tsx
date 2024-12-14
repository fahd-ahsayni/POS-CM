import { Card } from "@/components/ui/card";
import {
  TypographyH3,
  TypographyH4,
  TypographyP,
} from "@/components/ui/typography";
import { Users, UtensilsCrossed, Bike } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import NumberOfTable from "./type-of-order/NumberOfTabel";
import NumberOfPeer from "./type-of-order/NumberOfPeeper";
import SelectDeliveryType from "./type-of-order/SelectDeliveryType";
import { setOrderType } from "@/store/slices/pages/orderSlice";
import { RootState } from "@/store";
import OwnDeliveryForm from "./type-of-order/OwnDeliveryForm";

const orderTypes = [
  {
    id: "dine-in",
    title: "Dine-In",
    description: "5 out of 20 tables are available.",
    icon: Users,
  },
  {
    id: "take-away",
    title: "Take Away",
    description: "10-15 minutes preparation time",
    icon: UtensilsCrossed,
  },
  {
    id: "delivery",
    title: "Delivery",
    description: "30-45 minutes delivery time",
    icon: Bike,
  },
];

export default function TypeOfOrder() {
  const dispatch = useDispatch();
  const selectedOrderType = useSelector(
    (state: RootState) => state.order.selectedOrderType
  );

  const handleOrderTypeSelect = (type: string) => {
    dispatch(setOrderType(type as "dine-in" | "take-away" | "delivery" | null));
  };

  const renderComponent = () => {
    switch (selectedOrderType) {
      case "dine-in":
        return <NumberOfTable />;
      case "take-away":
        return <NumberOfPeer />;
      case "delivery":
        return <SelectDeliveryType />;
      case "own-delivery":
        return <OwnDeliveryForm />;
      default:
        return (
          <div className="h-full flex flex-col justify-evenly">
            <TypographyH3 className="font-medium max-w-xs">
              What type of order would you like to process?
            </TypographyH3>
            <div className="flex flex-col gap-4">
              {orderTypes.map((type) => (
                <Card
                  key={type.id}
                  className="w-full rounded-md px-8 py-4 flex space-x-4 items-center cursor-pointer hover:bg-accent"
                  onClick={() => handleOrderTypeSelect(type.id)}
                >
                  <type.icon className="w-6 h-auto text-primary" />
                  <div>
                    <TypographyH4 className="font-medium">
                      {type.title}
                    </TypographyH4>
                    <TypographyP className="text-xs dark:text-zinc-300 text-zinc-400">
                      {type.description}
                    </TypographyP>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="px-4 sm:px-6 h-full flex flex-col">
      <div className="overflow-y-auto h-full">
        {renderComponent()}
      </div>
    </div>
  );
}
