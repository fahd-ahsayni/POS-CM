import { getCategories } from "@/api/services";
// import { setOrderTypeId } from "@/store/slices/order/create-order.slice";
import { OrderType } from "@/types/order.types";
import { Category } from "@/types/product.types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  COASTER_CALL_VIEW,
  NUMBER_OF_TABLE_VIEW,
  ORDER_SUMMARY_VIEW,
  OWN_DELIVERY_FORM_VIEW,
} from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { updateOrder } from "@/functions/updateOrder";

export const useSelectOrderType = () => {
  const dispatch = useDispatch();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [selectedType, setSelectedType] = useState<OrderType | null>(null);
  const [displayedTypes, setDisplayedTypes] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setViews } = useRightViewContext();
  const [categories, setCategories] = useState<Category[]>([]);

  const generalData = useAppSelector(
    (state: RootState) => state.generalData.data
  );

  useEffect(() => {
    const loadOrderTypes = () => {
      setIsLoading(true);
      try {
        const storedGeneralData = generalData
          ? generalData
          : JSON.parse(localStorage.getItem("generalData") || "{}");
        const rootOrderTypes = storedGeneralData.orderTypes.filter(
          (type: OrderType) => !type.parent_id
        );
        setOrderTypes(rootOrderTypes);
        setDisplayedTypes(rootOrderTypes);
      } catch (error) {
        console.error("Error loading order types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderTypes();
  }, []);

  const loadDefaultCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading default categories:", error);
    }
  }, []);

  const filterCategoriesByMenu = useCallback((menuId: string) => {
    const storedGeneralData = localStorage.getItem("generalData");
    if (!storedGeneralData) {
      return [];
    }

    const { categories } = JSON.parse(storedGeneralData);

    const filtered = categories.filter((category: Category) =>
      category.menu_ids.includes(menuId)
    );
    return filtered;
  }, []);

  const handleOrderTypeSelect = useCallback(
    async (orderType: OrderType) => {
      setSelectedType(orderType);
      if (orderType.children.length > 0) {
        setDisplayedTypes(orderType.children);
        return;
      }

      dispatch(updateOrder({ order_type_id: orderType._id }));

      localStorage.setItem("orderType", JSON.stringify(orderType));
      window.dispatchEvent(new Event("localStorageChange"));

      if (orderType.menu_id) {
        const filteredCategories = filterCategoriesByMenu(orderType.menu_id);
        setCategories(filteredCategories);
      } else {
        await loadDefaultCategories();
      }

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
    [dispatch, setViews, filterCategoriesByMenu, loadDefaultCategories]
  );

  const handleBack = useCallback(() => {
    setSelectedType(null);
    setDisplayedTypes(orderTypes);
  }, [orderTypes]);

  useEffect(() => {
    if (!selectedType) {
      loadDefaultCategories();
    }
  }, [loadDefaultCategories, selectedType]);

  return {
    state: {
      orderTypes,
      selectedType,
      displayedTypes,
      isLoading,
      categories,
    },
    actions: {
      handleOrderTypeSelect,
      handleBack,
    },
  };
};
