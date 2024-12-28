import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { updateOrder } from "@/functions/updateOrder";
import { cn } from "@/lib/utils";
import { OrderType } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { DELIVERY_VIEW, NUMBER_OF_TABLE_VIEW, ORDER_SUMMARY_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/rightViewContext";
import { TypeOfOrderDescription, TypeOfOrderIcon } from "../ui/TypeOfOrderIcon";

export const OrderCardSkeleton = () => (
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

// Memoized OrderCard component
export const OrderCard = memo(
  ({
    type,
    onSelect,
    isFixedLightDark = false,
  }: {
    type: OrderType;
    onSelect: (orderType: OrderType) => void;
    isFixedLightDark?: boolean;
  }) => (
    <Card
      className={cn(
        "w-full rounded-md h-20 px-8 py-4 flex space-x-4 items-center justify-between cursor-pointer",
        isFixedLightDark
          ? "dark:!bg-primary-black bg-neutral-bright-grey"
          : "dark:bg-secondary-black bg-white"
      )}
      onClick={() => onSelect(type)}
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
  )
);

OrderCard.displayName = "OrderCard";

function SelectTypeOfOrder() {
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setViews, setOrderType } = useRightViewContext();
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
      const orderTypeLC = orderType.type.toLowerCase();
      
      if (orderTypeLC === "takeaway") {
        setViews(ORDER_SUMMARY_VIEW);
      } else if (orderTypeLC === "delivery") {
        setViews(DELIVERY_VIEW);
      } else {
        setViews(NUMBER_OF_TABLE_VIEW);
      }
      
      setOrderType(orderType._id);
      dispatch(updateOrder({ order_type_id: orderType._id }));
      localStorage.setItem("orderType", JSON.stringify(orderType));
    },
    [dispatch, setViews, setOrderType]
  );

  return (
    <div className="flex flex-col h-full p-4">
      <TypographyH4 className="font-medium mb-6">
        What type of order would you like to process?
      </TypographyH4>
      <div className="flex-1 flex flex-col gap-y-8 pt-10">
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
            />
          ))
        )}
      </div>
    </div>
  );
}

export default memo(SelectTypeOfOrder);
