import { setOrderType } from "@/store/slices/pages/orderSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyH4 } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";

import { glovo, kaalix, yassir, ownDelivery } from "@/assets";

const deliveryApps = [
  {
    name: "Glovo",
    image: glovo,
  },
  {
    name: "Kaalix",
    image: kaalix,
  },
  {
    name: "Yassir",
    image: yassir,
  },
  {
    name: "Own Delivery",
    image: ownDelivery,
  },
];

export default function SelectDeliveryType() {
  const dispatch = useDispatch();

  const handleSelect = (
    orderType: "dine-in" | "take-away" | "delivery" | "own-delivery" | null
  ) => {
    dispatch(setOrderType(orderType));
  };

  return (
    <div className="flex flex-col justify-evenly h-full">
      <TypographyH3 className="font-medium max-w-xs">
        Enter the table number to start the order:
      </TypographyH3>
      <div className="space-y-3 px-4 sm:px-6">
        {deliveryApps.map((app) => (
          <Card
            key={app.name}
            className="flex justify-start items-center px-6 py-3 transition-all hover:ring-2 hover:ring-primary cursor-pointer"
            onClick={() => {
              if (app.name === "Own Delivery") {
                handleSelect("own-delivery");
              }
            }}
          >
            <img
              src={app.image}
              alt={app.name}
              className="h-14 w-14 rounded-lg mr-4"
            />
            <TypographyH4 className="font-medium max-w-xs">
              {app.name}
            </TypographyH4>
          </Card>
        ))}
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 bg-gray-200 hover:bg-gray-300/70 dark:bg-zinc-800"
            onClick={() => dispatch(setOrderType(null))}
          >
            Cancel
          </Button>
          <Button className="flex-1">Confirm</Button>
        </div>
      </div>
    </div>
  );
}
