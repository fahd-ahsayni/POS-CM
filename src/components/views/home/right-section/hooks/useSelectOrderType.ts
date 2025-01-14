import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { OrderType } from "@/types/order.types";
import { updateOrder } from "@/functions/updateOrder";
import { useRightViewContext } from "../contexts/RightViewContext";
import { getCategories } from "@/api/services";
import { Category } from "@/types/product.types";
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
  const [categories, setCategories] = useState<Category[]>([]);

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

  const loadDefaultCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error loading default categories:", error);
    }
  }, []);

  const filterCategoriesByMenu = useCallback((menuId: string) => {
    console.log("🔍 Filtering categories for menuId:", menuId);

    const storedGeneralData = localStorage.getItem("generalData");
    if (!storedGeneralData) {
      console.warn("❌ No generalData found in localStorage");
      return [];
    }

    const { categories } = JSON.parse(storedGeneralData);
    console.log("📋 Available categories:", categories);

    const filtered = categories.filter((category: Category) =>
      category.menu_ids.includes(menuId)
    );
    console.log("✅ Filtered categories:", filtered);
    return filtered;
  }, []);

  const handleOrderTypeSelect = useCallback(
    async (orderType: OrderType) => {
      console.log("🎯 Selected order type:", orderType);
      setSelectedType(orderType);

      if (orderType.children.length > 0) {
        console.log("👨‍👧‍👦 Showing children types:", orderType.children);
        setDisplayedTypes(orderType.children);
        return;
      }

      dispatch(updateOrder({ order_type_id: orderType._id }));
      localStorage.setItem("orderType", JSON.stringify(orderType));
      window.dispatchEvent(new Event("localStorageChange"));

      if (orderType.menu_id) {
        console.log("🍽️ Order type has menu_id:", orderType.menu_id);
        const filteredCategories = filterCategoriesByMenu(orderType.menu_id);
        setCategories(filteredCategories);
      } else {
        console.log("📚 Loading default categories (no menu_id found)");
        await loadDefaultCategories();
      }

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
