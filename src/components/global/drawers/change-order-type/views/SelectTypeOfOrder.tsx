import { TypographyH4 } from "@/components/ui/typography";
import {
  OrderCard,
  OrderCardSkeleton,
} from "@/components/views/home/right-section/components/SelectTypeOfOrder";
import { updateOrder } from "@/functions/updateOrder";
import { OrderType } from "@/types";
import { memo, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CHANGE_DELIVERY_VIEW,
  CHANGE_NUMBER_OF_TABLE_VIEW,
  CHANGE_COASTER_CALL_VIEW,
} from "../constants";

interface SelectTypeOfOrderProps {
  setDrawerView: (view: string) => void;
  setOpen: (open: boolean) => void;
}

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
          setDrawerView(CHANGE_COASTER_CALL_VIEW);
          break;
        case "onplace":
          setDrawerView(CHANGE_NUMBER_OF_TABLE_VIEW);
          break;
        case "delivery":
          setDrawerView(CHANGE_DELIVERY_VIEW);
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
