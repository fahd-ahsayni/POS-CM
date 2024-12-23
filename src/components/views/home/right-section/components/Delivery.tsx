import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyH3, TypographyH4 } from "@/components/ui/typography";

import { glovo, kaalix, ownDelivery, yassir } from "@/assets";
import { motion } from "framer-motion";
import { ORDER_SUMMARY_VIEW, OWN_DELIVERY_FORM_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/rightViewContext";

const deliveryApps = [
  {
    id: "glovo",
    name: "Glovo",
    image: glovo,
  },
  {
    id: "kaalix",
    name: "Kaalix",
    image: kaalix,
  },
  {
    id: "yassir",
    name: "Yassir",
    image: yassir,
  },
  {
    id: "ownDelivery",
    name: "Own Delivery",
    image: ownDelivery,
  },
];

export default function SelectDeliveryType() {
  const { setViews, setSelectedOrderType, selectedOrderType } =
    useRightViewContext();

  console.log(selectedOrderType);

  const handleSelect = (type: string) => {
    setSelectedOrderType(type);
  };

  const handleConfirm = () => {
    if (selectedOrderType === "ownDelivery") {
      setViews(OWN_DELIVERY_FORM_VIEW);
      return;
    }
    setViews(ORDER_SUMMARY_VIEW);
  };

  return (
    <div className="flex flex-col justify-evenly -mt-6 h-full">
      <TypographyH4 className="font-medium max-w-xs">
        Enter the table number to start the order:
      </TypographyH4>
      <div className="space-y-3">
        {deliveryApps.map((app, index) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card
              className={`flex justify-start items-center px-6 py-3 transition-all cursor-pointer ${
                selectedOrderType === app.id ? "ring-2 ring-primary-red" : ""
              }`}
              onClick={() => {
                handleSelect(app.id);
              }}
            >
              <img
                src={app.image}
                alt={app.name}
                className="h-14 w-16 rounded-lg mr-4 object-cover"
              />
              <TypographyH4 className="font-medium max-w-xs">
                {app.name}
              </TypographyH4>
            </Card>
          </motion.div>
        ))}
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex gap-4 w-full">
          <Button
            variant="secondary"
            onClick={() => {
              setViews("TypeOfOrder");
              setSelectedOrderType(null);
            }}
          >
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
