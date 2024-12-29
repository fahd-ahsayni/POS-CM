import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, memo, useCallback } from "react";
import Drawer from "../../Drawer";
import {
  CHANGE_COASTER_CALL_VIEW,
  CHANGE_DELIVERY_VIEW,
  CHANGE_NUMBER_OF_TABLE_VIEW,
  CHANGE_OWN_DELIVERY_FORM_VIEW,
  CHANGE_TYPE_OF_ORDER_VIEW,
} from "./constants";
import ChangeNumberOfTable from "./views/ChangeChangeNumberOfTable";
import ChangeDelivery from "./views/ChangeDelivery";
import ChangeOwnDeliveryForm from "./views/ChangeOwnDeliveryForm";
import ChangeTakeAway from "./views/ChangeTakeAway";
import SelectTypeOfOrder from "./views/SelectTypeOfOrder";

const ChangeOrderType = memo(({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void; }) => {
  const [drawerView, setDrawerView] = useState(CHANGE_TYPE_OF_ORDER_VIEW);

  const handleClose = useCallback(() => {
    setOpen(false);
    setDrawerView(CHANGE_TYPE_OF_ORDER_VIEW);
  }, [setOpen]);

  const drawerTabsConfig = [
    {
      value: CHANGE_TYPE_OF_ORDER_VIEW,
      component: <SelectTypeOfOrder setDrawerView={setDrawerView} setOpen={setOpen} />,
    },
    {
      value: CHANGE_COASTER_CALL_VIEW,
      component: <ChangeTakeAway setDrawerView={setDrawerView} setOpen={setOpen} />,
    },
    {
      value: CHANGE_NUMBER_OF_TABLE_VIEW,
      component: <ChangeNumberOfTable setDrawerView={setDrawerView} setOpen={setOpen} />,
    },
    {
      value: CHANGE_DELIVERY_VIEW,
      component: <ChangeDelivery setDrawerView={setDrawerView} setOpen={setOpen} />,
    },
    {
      value: CHANGE_OWN_DELIVERY_FORM_VIEW,
      component: <ChangeOwnDeliveryForm setDrawerView={setDrawerView} setOpen={setOpen} />,
    },
  ];

  return (
    <Drawer open={open} setOpen={handleClose} title="Change Order Type">
      <div className="h-full overflow-hidden">
        <Tabs value={drawerView} className="w-full h-full flex">
          {drawerTabsConfig.map(({ value, component }) => (
            <TabsContent key={value} value={value} className={cn("w-full h-full")}>
              {component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Drawer>
  );
});

export default ChangeOrderType;
