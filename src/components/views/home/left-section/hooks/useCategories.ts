import { Category } from "@/types/product.types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/RightViewContext";
import { ALL_PRODUCTS_VIEW, PRODUCTS_BY_CATEGORY_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/LeftViewContext";

export const useCategories = () => {
  const { setViews, setCategory, setCurrentMenu, setBreadcrumbs } =
    useLeftViewContext();
  const { views } = useRightViewContext();
  const [orderTypeChanged, setOrderTypeChanged] = useState(0);

  // Retrieve orderType from local storage
  const orderType = useMemo(() => {
    return JSON.parse(localStorage.getItem("orderType") || "null");
  }, [orderTypeChanged]);

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

  const buildCategoryTree = useCallback((categories: Category[]) => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: create map of all categories with empty children arrays
    categories.forEach((category) => {
      categoryMap.set(category._id, { ...category, children: [] });
    });

    // Second pass: build the tree structure
    categories.forEach((category) => {
      const currentCategory = categoryMap.get(category._id);
      if (currentCategory) {
        if (category.parent_id) {
          // This is a child category - add it to its parent's children array
          const parentCategory = categoryMap.get(category.parent_id);
          if (parentCategory) {
            parentCategory.children.push(currentCategory);
          }
        } else {
          // This is a root category
          rootCategories.push(currentCategory);
        }
      }
    });

    // Sort all categories (root and children) by sequence
    const sortBySequence = (cats: Category[]) => {
      cats.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
      cats.forEach((cat) => {
        if (cat.children?.length > 0) {
          sortBySequence(cat.children);
        }
      });
    };

    sortBySequence(rootCategories);
    return rootCategories;
  }, []);

  const categories = useMemo(() => {
    const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
    const orderType = JSON.parse(localStorage.getItem("orderType") || "null");

    if (orderType?.menu_id) {
      const filteredCategories =
        generalData.categories?.filter((category: Category) =>
          category.menu_ids.includes(orderType.menu_id)
        ) || [];

      return buildCategoryTree(filteredCategories);
    }

    return [];
  }, [orderTypeChanged, buildCategoryTree]);

  const handleCategoryClick = useCallback(
    (category: Category) => {
      console.log("🎯 Selected category:", category);
      setBreadcrumbs([{ ...category, name: "Subcategories" }]);
      setCategory(category);
      setViews(PRODUCTS_BY_CATEGORY_VIEW);
    },
    [setCategory, setViews, setBreadcrumbs]
  );

  const handleAllProductsClick = useCallback(() => {
    setCategory(null);
    setCurrentMenu(orderType?.menu_id || null);
    setViews(ALL_PRODUCTS_VIEW);
  }, [setCategory, setCurrentMenu, setViews, orderType]);

  const isInteractionDisabled = views !== ORDER_SUMMARY_VIEW;

  return {
    categories,
    views,
    handleCategoryClick,
    handleAllProductsClick,
    isInteractionDisabled,
  };
};
