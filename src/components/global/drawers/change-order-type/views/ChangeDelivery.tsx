import { glovo, kaalix, ownDelivery, yassir } from "@/assets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { CHANGE_OWN_DELIVERY_FORM_VIEW, CHANGE_TYPE_OF_ORDER_VIEW } from "../constants";

interface DeliveryProps {
  setDrawerView: (view: string) => void;
  setOpen: (open: boolean) => void;
}

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

export default function ChangeDelivery({
  setDrawerView,
  setOpen,
}: DeliveryProps) {
  const handleDeliverySelect = (deliveryType: string) => {
    if (deliveryType === "ownDelivery") {
      setDrawerView(CHANGE_OWN_DELIVERY_FORM_VIEW);
    } else {
      // Handle third-party delivery selection
      // Add any necessary state updates here
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <TypographyH4 className="font-medium mb-6">
        Select delivery service:
      </TypographyH4>
      <div className="space-y-3 flex-1">
        {deliveryApps.map((app, index) => (
          <motion.div
            key={app.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card
              className="flex justify-start items-center px-6 py-3 transition-all cursor-pointer hover:bg-accent"
              onClick={() => handleDeliverySelect(app.id)}
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
      <div className="mt-4">
        <Button
          className="w-full"
          variant="secondary"
          onClick={() => setDrawerView(CHANGE_TYPE_OF_ORDER_VIEW)}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
