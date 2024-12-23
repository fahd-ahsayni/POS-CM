import { Card } from "@/components/ui/card";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { updateOrder } from "@/functions/updateOrder";
import { OrderType } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRightViewContext } from "../contexts/rightViewContext";
import { TypeOfOrderDescription, TypeOfOrderIcon } from "../ui/TypeOfOrderIcon";
import { ORDER_SUMMARY_VIEW } from "../constants";

export default function SelectTypeOfOrder() {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const { setViews, setOrderType } = useRightViewContext();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedGeneralData = localStorage.getItem("generalData");
    if (storedGeneralData) {
      const parsedData = JSON.parse(storedGeneralData);
      const sortedOrderTypes = parsedData.orderTypes.sort(
        (a: OrderType, b: OrderType) => a.sequence - b.sequence
      );

      setOrderTypes(sortedOrderTypes);
    }
  }, []);

  const handleOrderTypeSelect = (id: string, type: string) => {
    if (type.toLowerCase() === "takeaway") {
      setViews(ORDER_SUMMARY_VIEW);
    } else {
      setViews(type);
    }
    setOrderType(id);
    dispatch(updateOrder({ order_type_id: id }));
  };

  return (
    <div className="h-full flex flex-col justify-start mt-2">
      <TypographyH4 className="font-medium max-w-xs">
        What type of order would you like to process?
      </TypographyH4>
      <div className="flex flex-col h-[60%] justify-center gap-4 mt-10">
        {orderTypes.map((type) => (
          <div key={type._id}>
            <Card
              className="w-full rounded-md h-24 px-8 py-4 dark:!bg-zinc-800 bg-white flex space-x-4 items-center justify-between cursor-pointer hover:bg-accent"
              onClick={() => handleOrderTypeSelect(type._id, type.type)}
            >
              <div className="flex items-center gap-x-4">
                <TypeOfOrderIcon type={type.type.toLowerCase()} />
                <div>
                  <TypographyH4 className="font-medium first-letter:capitalize">
                    {type.type}
                  </TypographyH4>
                  <TypographyP className="text-xs text-neutral-dark-grey">
                    {TypeOfOrderDescription({ type: type.type.toLowerCase() })}
                  </TypographyP>
                </div>
              </div>
              <ChevronRightIcon className="w-6 h-auto text-neutral-dark-grey" />
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
