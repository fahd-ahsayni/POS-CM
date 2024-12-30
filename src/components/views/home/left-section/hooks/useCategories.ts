import { Category } from "@/types";
import { useCallback, useMemo } from "react";
import { useLeftViewContext } from "../contexts/leftViewContext";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { ALL_PRODUCTS_VIEW, PRODUCTS_BY_CATEGORY_VIEW } from "../constants";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";

export const useCategories = () => {
  const { setViews, setCategory } = useLeftViewContext();
  const { views } = useRightViewContext();

  const categories = useMemo(() => {
    return (
      JSON.parse(localStorage.getItem("generalData") || "{}").categories || []
    );
  }, []);

  const handleCategoryClick = useCallback(
    (category: Category) => {
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
