import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { OrderType } from "@/types";
import { updateOrder } from "@/functions/updateOrder";
import { useRightViewContext } from "../contexts/RightViewContext";
import {
  COASTER_CALL_VIEW,
  NUMBER_OF_TABLE_VIEW,
  ORDER_SUMMARY_VIEW,
  OWN_DELIVERY_FORM_VIEW,
} from "../constants";

export const useSelectOrderType = () => {
  const dispatch = useDispatch();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [selectedType, setSelectedType] = useState<OrderType | null>(null);
  const [displayedTypes, setDisplayedTypes] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setViews } = useRightViewContext();

  useEffect(() => {
    const loadOrderTypes = () => {
      setIsLoading(true);
      try {
        const storedGeneralData = localStorage.getItem("generalData");
        if (storedGeneralData) {
          const parsedData = JSON.parse(storedGeneralData);
          const rootOrderTypes = parsedData.orderTypes.filter(
            (type: OrderType) => !type.parent_id
          );
          setOrderTypes(rootOrderTypes);
          setDisplayedTypes(rootOrderTypes);
        }
      } catch (error) {
        console.error("Error loading order types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderTypes();
  }, []);

  const handleOrderTypeSelect = useCallback(
    (orderType: OrderType) => {
      setSelectedType(orderType);

      if (orderType.children.length > 0) {
        setDisplayedTypes(orderType.children);
        return;
      }

      // Update order type in store and localStorage
      dispatch(updateOrder({ order_type_id: orderType._id }));
      localStorage.setItem("orderType", JSON.stringify(orderType));

      // Navigate to appropriate view
      const viewMap = {
        select_table: NUMBER_OF_TABLE_VIEW,
        select_client: OWN_DELIVERY_FORM_VIEW,
        select_coaster_call: COASTER_CALL_VIEW,
      };

      const nextView =
        Object.entries(viewMap).find(
          ([key]) => orderType[key as keyof OrderType]
        )?.[1] || ORDER_SUMMARY_VIEW;

      setViews(nextView);
    },
    [dispatch, setViews]
  );

  const handleBack = useCallback(() => {
    setSelectedType(null);
    setDisplayedTypes(orderTypes);
  }, [orderTypes]);

  return {
    state: {
      orderTypes,
      selectedType,
      displayedTypes,
      isLoading,
    },
    actions: {
      handleOrderTypeSelect,
      handleBack,
    },
  };
};
