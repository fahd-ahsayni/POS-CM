import { getCategories } from "@/api/services";
import { updateOrder } from "@/functions/updateOrder";
import { OrderType } from "@/interfaces/order";
import { Category } from "@/interfaces/product";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  COASTER_CALL_VIEW,
  NUMBER_OF_TABLE_VIEW,
  ORDER_SUMMARY_VIEW,
  OWN_DELIVERY_FORM_VIEW,
} from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";
import { useLeftViewContext } from "../../left-section/contexts/LeftViewContext";
import {
  ALL_CATEGORIES_VIEW,
  TABLES_PLAN_VIEW,
} from "../../left-section/constants";

export const useSelectOrderType = () => {
  const dispatch = useDispatch();
  const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
  const [selectedType, setSelectedType] = useState<OrderType | null>(null);
  const [displayedTypes, setDisplayedTypes] = useState<OrderType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setViews } = useRightViewContext();
  const { setViews: setLeftView, setCurrentMenu } = useLeftViewContext();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadOrderTypes = async () => {
      setIsLoading(true);
      try {
        // Add a small delay to ensure localStorage is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const storedGeneralData = localStorage.getItem("generalData");
        if (!storedGeneralData) {
          throw new Error("No general data found");
        }

        const data = JSON.parse(storedGeneralData);
        if (!data.orderTypes || !Array.isArray(data.orderTypes)) {
          throw new Error("Invalid order types data");
        }

        const rootOrderTypes = data.orderTypes.filter(
          (type: OrderType) => !type.parent_id
        );
        
        setOrderTypes(rootOrderTypes);
        setDisplayedTypes(rootOrderTypes);
      } catch (error) {
        console.error("Error loading order types:", error);
        setOrderTypes([]);
        setDisplayedTypes([]);
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

      if (orderType) setCurrentMenu(orderType.menu_id);

      if (orderType.select_table) {
        setLeftView(TABLES_PLAN_VIEW);
      } else {
        setLeftView(ALL_CATEGORIES_VIEW);
      }

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
