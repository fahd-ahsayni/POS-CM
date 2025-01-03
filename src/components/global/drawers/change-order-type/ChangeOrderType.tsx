import { OrderCard } from "@/components/views/home/right-section/components/SelectTypeOfOrder";
import Drawer from "../../Drawer";

export default function ChangeOrderType({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const orderTypes = JSON.parse(
    localStorage.getItem("generalData") || "[]"
  ).orderTypes;

  return (
    <Drawer open={open} setOpen={setOpen} title="Change Order Type">
      <div className="h-full overflow-hidden">
        <div className="flex flex-col gap-y-4">
          {orderTypes.map((orderType: any) => (
            <OrderCard
              key={orderType._id}
              orderType={orderType}
              onSelect={() => {}}
            />
          ))}
        </div>
      </div>
    </Drawer>
  );
}
