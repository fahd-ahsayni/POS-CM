import { Category } from "@/types/product.types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/RightViewContext";
import { ALL_PRODUCTS_VIEW, PRODUCTS_BY_CATEGORY_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/LeftViewContext";

export const useCategories = () => {
  const { setViews, setCategory } = useLeftViewContext();
  const { views } = useRightViewContext();
  const [orderTypeChanged, setOrderTypeChanged] = useState(0);

  // Listen for changes to orderType in localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "orderType") {
        setOrderTypeChanged((prev) => prev + 1);
      }
    };

    // Create a custom event for local changes
    const handleLocalStorageChange = () => {
      setOrderTypeChanged((prev) => prev + 1);
    };

    // Subscribe to the custom event
    window.addEventListener("localStorageChange", handleLocalStorageChange);
    // Listen for changes from other tabs/windows
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "localStorageChange",
        handleLocalStorageChange
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const categories = useMemo(() => {
    const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
    const orderType = JSON.parse(localStorage.getItem("orderType") || "null");

    console.log("🔍 Current orderType:", orderType);

    if (orderType?.menu_id) {
      console.log("📋 Filtering categories for menu:", orderType.menu_id);
      return (
        generalData.categories?.filter((category: Category) =>
          category.menu_ids.includes(orderType.menu_id)
        ) || []
      );
    }

    console.log("📚 Using all categories (no menu filter)");
    return generalData.categories || [];
  }, [orderTypeChanged]);

  const handleCategoryClick = useCallback(
    (category: Category) => {
      console.log("🎯 Selected category:", category);
      setCategory(category);
      setViews(PRODUCTS_BY_CATEGORY_VIEW);
    },
    [setCategory, setViews]
  );

  const handleAllProductsClick = useCallback(() => {
    if (views === ORDER_SUMMARY_VIEW) {
      setViews(ALL_PRODUCTS_VIEW);
    }
    setCategory(null);
  }, [views, setViews, setCategory]);

  const isInteractionDisabled = views !== ORDER_SUMMARY_VIEW;

  return {
    categories,
    views,
    handleCategoryClick,
    handleAllProductsClick,
    isInteractionDisabled,
  };
};
