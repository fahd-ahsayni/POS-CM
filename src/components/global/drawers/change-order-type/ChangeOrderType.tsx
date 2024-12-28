import { useState } from "react";
import Drawer from "../../Drawer";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  TYPE_OF_ORDER_VIEW,
  TAKE_AWAY_VIEW,
  ON_PLACE_VIEW,
  DELIVERY_VIEW,
  OWN_DELIVERY_FORM_VIEW,
} from "./constants";
import SelectTypeOfOrder from "./views/SelectTypeOfOrder";
import ChangeTakeAway from "./views/ChangeTakeAway";
import ChangeOnPlace from "./views/ChangeOnPlace";
import ChangeDelivery from "./views/ChangeDelivery";
import ChangeOwnDeliveryForm from "./views/ChangeOwnDeliveryForm";

export default function ChangeOrderType() {
  const [open, setOpen] = useState(true);
  const [drawerView, setDrawerView] = useState(TYPE_OF_ORDER_VIEW);

  const handleClose = () => {
    setOpen(false);
    setDrawerView(TYPE_OF_ORDER_VIEW);
  };

  const drawerTabsConfig = [
    {
      value: TYPE_OF_ORDER_VIEW,
      component: (
        <SelectTypeOfOrder setDrawerView={setDrawerView} setOpen={setOpen} />
      ),
    },
    {
      value: TAKE_AWAY_VIEW,
      component: (
        <ChangeTakeAway setDrawerView={setDrawerView} setOpen={setOpen} />
      ),
    },
    {
      value: ON_PLACE_VIEW,
      component: (
        <ChangeOnPlace setDrawerView={setDrawerView} setOpen={setOpen} />
      ),
    },
    {
      value: DELIVERY_VIEW,
      component: (
        <ChangeDelivery setDrawerView={setDrawerView} setOpen={setOpen} />
      ),
    },
    {
      value: OWN_DELIVERY_FORM_VIEW,
      component: (
        <ChangeOwnDeliveryForm
          setDrawerView={setDrawerView}
          setOpen={setOpen}
        />
      ),
    },
  ];

  return (
    <Drawer open={open} setOpen={handleClose} title="Change Order Type">
      <div className="h-full overflow-hidden">
        <Tabs value={drawerView} className="w-full h-full flex">
          {drawerTabsConfig.map(({ value, component }) => (
            <TabsContent
              key={value}
              value={value}
              className={cn("w-full h-full")}
            >
              {component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Drawer>
  );
}
