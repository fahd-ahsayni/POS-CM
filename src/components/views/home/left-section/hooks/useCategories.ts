import { Category } from "@/interfaces/product";
import { useCallback, useEffect, useState } from "react";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/RightViewContext";
import { ALL_PRODUCTS_VIEW, PRODUCTS_BY_CATEGORY_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/LeftViewContext";
import { getCategories } from "@/api/services";
import { toast } from "react-toastify";
import { createToast } from "@/components/global/Toasters";

interface MenuResponse {
  menu: {
    _id: string;
    name: string;
    category_ids: string[];
    default: boolean;
  };
  categories: Category[];
}

export const useCategories = () => {
  const { setViews, setCategory, setCurrentMenu, setBreadcrumbs } =
    useLeftViewContext();
  const { views } = useRightViewContext();
  const [orderTypeChanged, setOrderTypeChanged] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildCategoryTree = useCallback((categories: Category[]) => {
    const categoryMap = new Map<string, Category>();
    const rootCategories: Category[] = [];

    // First pass: Create category map
    categories.forEach((category) => {
      categoryMap.set(category._id, { ...category, children: [] });
    });

    // Second pass: Build tree structure
    categories.forEach((category) => {
      const currentCategory = categoryMap.get(category._id);
      if (currentCategory) {
        if (category.parent_id) {
          const parentCategory = categoryMap.get(category.parent_id);
          if (parentCategory) {
            parentCategory.children.push(currentCategory);
          }
        } else {
          rootCategories.push(currentCategory);
        }
      }
    });

    // Sort function for categories
    const sortCategories = (a: Category, b: Category) => {
      return (a.sequence || 0) - (b.sequence || 0);
    };

    // Sort root categories and their children
    rootCategories.sort(sortCategories);
    rootCategories.forEach((category) => {
      if (category.children?.length > 0) {
        category.children.sort(sortCategories);
      }
    });

    return rootCategories;
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const orderType = JSON.parse(
          localStorage.getItem("orderType") || "null"
        );

        // Try to get categories from defaultMenu first
        const defaultMenuData = localStorage.getItem("defaultMenu");
        let categoriesData: Category[] = [];

        if (orderType?.menu_id) {
          // If we have an orderType with menu_id, use generalData
          const generalData = JSON.parse(
            localStorage.getItem("generalData") || "{}"
          );
          if (generalData.categories) {
            categoriesData = generalData.categories.filter(
              (category: Category) =>
                category.menu_ids?.includes(orderType.menu_id)
            );
          }
        }

        // If no categories found or no orderType, try to use defaultMenu or fetch new data
        if (categoriesData.length === 0) {
          if (defaultMenuData) {
            const defaultMenu = JSON.parse(defaultMenuData);
            categoriesData = defaultMenu.categories;
          } else {
            // Fetch default menu data
            const response = await getCategories();
            const data = response.data as MenuResponse;

            if (!data.categories) {
              throw new Error("No categories found");
            }

            // Store default menu data separately
            localStorage.setItem(
              "defaultMenu",
              JSON.stringify({
                menu: data.menu,
                categories: data.categories,
              })
            );

            categoriesData = data.categories;
          }
        }

        const categoriesTree = buildCategoryTree(categoriesData);
        setCategories(categoriesTree);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load categories";
        setError(errorMessage);
        toast.error(
          createToast("Error Loading Categories", errorMessage, "error")
        );
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [orderTypeChanged, buildCategoryTree]);

  // Storage event listeners
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "orderType") {
        setOrderTypeChanged((prev) => prev + 1);
      }
    };

    const handleLocalStorageChange = () => {
      setOrderTypeChanged((prev) => prev + 1);
    };

    window.addEventListener("localStorageChange", handleLocalStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "localStorageChange",
        handleLocalStorageChange
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCategoryClick = useCallback(
    (category: Category) => {
      setBreadcrumbs([{ ...category, name: "Subcategories" }]);
      setCategory(category);
      setViews(PRODUCTS_BY_CATEGORY_VIEW);
    },
    [setCategory, setViews, setBreadcrumbs]
  );

  const handleAllProductsClick = useCallback(() => {
    setCategory(null);
    setCurrentMenu(
      JSON.parse(localStorage.getItem("orderType") || "null")?.menu_id || null
    );
    setViews(ALL_PRODUCTS_VIEW);
  }, [setCategory, setCurrentMenu, setViews]);

  return {
    categories,
    isLoading,
    error,
    views,
    handleCategoryClick,
    handleAllProductsClick,
    isInteractionDisabled: views !== ORDER_SUMMARY_VIEW,
  };
};
