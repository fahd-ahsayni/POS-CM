import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRightViewContext } from "./contexts/rightViewContext";
import SelectTypeOfOrder from "./components/SelectTypeOfOrder";
import TakeAway from "./components/TakeAway";
import OnPlace from "./components/OnPlace";
import OrderSumary from "./components/OrderSumary";
import Delivery from "./components/Delivery";
import OwnDeliveryForm from "./components/OwnDeliveryForm";

export default function LeftSection() {
  const { views } = useRightViewContext();

  return (
    <div className="w-full h-full mt-3 px-4 sm:px-6">
      <Tabs value={views} className="w-full h-full flex">
        <TabsContent
          value="TypeOfOrder"
          className="w-full h-full flex-1 overflow-auto"
        >
          <SelectTypeOfOrder />
        </TabsContent>
        <TabsContent value="takeAway" className="w-full h-full">
          <TakeAway />
        </TabsContent>
        <TabsContent value="onPlace" className="w-full h-full">
          <OnPlace />
        </TabsContent>
        <TabsContent value="delivery" className="w-full h-full">
          <Delivery />
        </TabsContent>
        <TabsContent value="OwnDeliveryForm" className="w-full h-full pb-8">
          <OwnDeliveryForm />
        </TabsContent>
        <TabsContent value="OrderSumary" className="w-full h-full pb-8">
          <OrderSumary />
        </TabsContent>
      </Tabs>
    </div>
  );
}
