import { memo, useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { OrderType } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import {
  TypeOfOrderDescription,
  TypeOfOrderIcon,
} from "@/components/views/home/right-section/ui/TypeOfOrderIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { updateOrder } from "@/functions/updateOrder";
import { useDispatch } from "react-redux";
import { DELIVERY_VIEW, ON_PLACE_VIEW, TAKE_AWAY_VIEW } from "../constants";
import { OrderCard } from "@/components/views/home/right-section/components/SelectTypeOfOrder";

interface SelectTypeOfOrderProps {
  setDrawerView: (view: string) => void;
  setOpen: (open: boolean) => void;
}

const OrderCardSkeleton = () => (
  <Card className="w-full rounded-md h-24 px-8 py-4 dark:!bg-secondary-black bg-white flex space-x-4 items-center justify-between">
    <div className="flex items-center gap-x-4 w-full">
      <Skeleton className="h-7 w-7 rounded-full bg-neutral-dark-grey/30" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-24 bg-neutral-dark-grey/30" />
        <Skeleton className="h-4 w-40 bg-neutral-dark-grey/30" />
      </div>
    </div>
  </Card>
);

function SelectTypeOfOrder({ setDrawerView, setOpen }: SelectTypeOfOrderProps) {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadOrderTypes = () => {
      setIsLoading(true);
      const storedGeneralData = localStorage.getItem("generalData");
      if (storedGeneralData) {
        const parsedData = JSON.parse(storedGeneralData);
        const sortedOrderTypes = parsedData.orderTypes.sort(
          (a: OrderType, b: OrderType) => a.sequence - b.sequence
        );
        setOrderTypes(sortedOrderTypes);
      }
      setIsLoading(false);
    };

    loadOrderTypes();
  }, []);

  const handleOrderTypeSelect = useCallback(
    (orderType: OrderType) => {
      const type = orderType.type.toLowerCase();
      switch (type) {
        case "takeaway":
          setDrawerView(TAKE_AWAY_VIEW);
          break;
        case "onplace":
          setDrawerView(ON_PLACE_VIEW);
          break;
        case "delivery":
          setDrawerView(DELIVERY_VIEW);
          break;
        default:
          setOpen(false);
      }
      dispatch(updateOrder({ order_type_id: orderType._id }));
      localStorage.setItem("orderType", JSON.stringify(orderType));
    },
    [dispatch, setDrawerView, setOpen]
  );

  return (
    <div className="flex flex-col h-full p-4">
      <TypographyH4 className="font-medium mb-6">
        Select new order type:
      </TypographyH4>
      <div className="flex-1 flex flex-col gap-4 pt-10">
        {isLoading ? (
          <>
            <OrderCardSkeleton />
            <OrderCardSkeleton />
            <OrderCardSkeleton />
          </>
        ) : (
          orderTypes.map((type) => (
            <OrderCard
              key={type._id}
              type={type}
              onSelect={handleOrderTypeSelect}
              isFixedLightDark
            />
          ))
        )}
      </div>
    </div>
  );
}

export default memo(SelectTypeOfOrder);
