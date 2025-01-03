import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyH4, TypographyP } from "@/components/ui/typography";
import { updateOrder } from "@/functions/updateOrder";
import { OrderType } from "@/types";
import { ChevronRightIcon } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TypeOfOrderDescription, TypeOfOrderIcon } from "../ui/TypeOfOrderIcon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRightViewContext } from "../contexts/RightViewContext";
import { ORDER_SUMMARY_VIEW } from "../constants";

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
    orderType,
    onSelect,
    isSelected,
  }: {
    orderType: OrderType;
    onSelect: (orderType: OrderType) => void;
    isSelected?: boolean;
  }) => {
    const iconType = orderType.type.toLowerCase();
    const isDeliveryChild = orderType.parent_id && iconType === "delivery";
    const showDescription = !orderType.parent_id; // Only show description for root items

    return (
      <Card
        className={cn(
          "w-full rounded-md h-24 px-8 py-6 flex space-x-4 items-center justify-between cursor-pointer dark:bg-secondary-black bg-white",
          isSelected && "ring-2 ring-primary-red"
        )}
        onClick={() => onSelect(orderType)}
      >
        <div className="flex items-center gap-x-4">
          {orderType.image || isDeliveryChild ? (
            <img
              src={orderType.image || "/path/to/delivery-image.png"} // Add your delivery image path
              alt={orderType.name}
              className="w-7 h-7"
            />
          ) : (
            <TypeOfOrderIcon type={iconType} />
          )}
          <div>
            <TypographyH4 className="font-medium">
              {orderType.name}
            </TypographyH4>
            {showDescription && (
              <TypographyP className="text-xs text-neutral-dark-grey">
                {TypeOfOrderDescription({ type: iconType })}
              </TypographyP>
            )}
          </div>
        </div>
        {orderType.children.length > 0 && (
          <ChevronRightIcon className="w-6 h-6 text-primary-black dark:text-white" />
        )}
      </Card>
    );
  }
);

OrderCard.displayName = "OrderCard";

function SelectTypeOfOrder() {
  const dispatch = useDispatch();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [selectedType, setSelectedType] = useState<OrderType | null>(null);
  const [displayedTypes, setDisplayedTypes] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrderTypes = () => {
      setIsLoading(true);
      const storedGeneralData = localStorage.getItem("generalData");
      if (storedGeneralData) {
        const parsedData = JSON.parse(storedGeneralData);
        const rootOrderTypes = parsedData.orderTypes.filter(
          (type: OrderType) => !type.parent_id
        );
        setOrderTypes(rootOrderTypes);
        setDisplayedTypes(rootOrderTypes);
      }
      setIsLoading(false);
    };

    loadOrderTypes();
  }, []);

  const { setViews } = useRightViewContext();

  const handleOrderTypeSelect = useCallback(
    (orderType: OrderType) => {
      setSelectedType(orderType);

      if (orderType.children.length > 0) {
        setDisplayedTypes(orderType.children);
      } else {
        dispatch(updateOrder({ order_type_id: orderType._id }));
        localStorage.setItem("orderType", JSON.stringify(orderType));
        setViews(ORDER_SUMMARY_VIEW);
      }
    },
    [dispatch, setViews]
  );

  const handleBack = useCallback(() => {
    setSelectedType(null);
    setDisplayedTypes(orderTypes);
  }, [orderTypes]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-x-2">
        {selectedType && (
          <Button variant="secondary" size="icon" onClick={handleBack}>
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
        )}
        <TypographyH4 className="font-medium">
          {selectedType
            ? selectedType.name
            : "What type of order would you like to process?"}
        </TypographyH4>
      </div>
      <div className="flex-1 flex h-full items-center justify-center">
        <div className="w-full space-y-10 -mt-20">
          {isLoading ? (
            <OrderCardSkeleton />
          ) : (
            displayedTypes.map((type) => (
              <OrderCard
                key={type._id}
                orderType={type}
                onSelect={handleOrderTypeSelect}
                isSelected={selectedType?._id === type._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SelectTypeOfOrder);
