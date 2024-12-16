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
import { setSelectedOrderType } from "@/store/slices/views/typeOfOrderViewsSlice";
import { RootState } from "@/store";
import OwnDeliveryForm from "./type-of-order/OwnDeliveryForm";
import ProceedOrder from "./type-of-order/ProceedOrder";
import { motion } from "framer-motion";

const orderTypes = [
  {
    id: "dineIn",
    title: "Dine-In",
    description: "5 out of 20 tables are available.",
    icon: Users,
  },
  {
    id: "takeAway",
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
    (state: RootState) => state.orderSelection.selectedOrderType
  );

  const handleOrderTypeSelect = (type: string) => {
    dispatch(setSelectedOrderType(type as "dineIn" | "takeAway" | "delivery" | "ownDelivery" | "tableConfirmation" | null));
  };

  const renderComponent = () => {
    switch (selectedOrderType) {
      case "dineIn":
        return <NumberOfTable />;
      case "takeAway":
        return <NumberOfPeer />;
      case "delivery":
        return <SelectDeliveryType />;
      case "ownDelivery":
        return <OwnDeliveryForm />;
      case "tableConfirmation":
        return <ProceedOrder />;
      default:
        return (
          <div className="h-full flex flex-col justify-evenly">
            <TypographyH3 className="font-medium max-w-xs">
              What type of order would you like to process?
            </TypographyH3>
            <div className="flex flex-col gap-4">
              {orderTypes.map((type, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.1 }}
                  key={type.id}
                >
                  <Card
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
                </motion.div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="px-4 sm:px-6 h-full flex flex-col">
      <div className="overflow-y-auto h-full">{renderComponent()}</div>
    </div>
  );
}
