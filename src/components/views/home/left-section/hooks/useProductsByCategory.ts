import { Category, Product } from "@/types/product.types";
import { useState, useCallback, useEffect } from "react";
import { useLeftViewContext } from "../contexts/LeftViewContext";
import { useRightViewContext } from "../../right-section/contexts/RightViewContext";
import { useProductSelection } from "./useProductSelection";

export const useProductsByCategory = () => {
  const {
    category,
    selectedProducts,
    setSelectedProducts,
    setOpenDrawerVariants,
    setSelectedProduct,
    subCategory,
    setSubCategory,
    setOpenDrawerCombo,
    setSelectedCombo,
  } = useLeftViewContext();

  const { orderType, customerIndex } = useRightViewContext();

  const [products, setProducts] = useState<Product[]>(category?.products ?? []);
  const [subCategories, setSubCategories] = useState<Category[]>(
    category?.children ?? []
  );
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>(
    [category].filter(Boolean) as Category[]
  );
  const [loading, setLoading] = useState(true);

  const { addOrUpdateProduct } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    customerIndex,
    orderType,
  });

  const getProductsByCategory = useCallback((categoryId: string) => {
    try {
      const generalData = JSON.parse(
        localStorage.getItem("generalData") || "{}"
      );
      return (
        generalData.products?.filter(
          (product: Product) => product.category_id === categoryId
        ) || []
      );
    } catch (error) {
      console.error("Error filtering products by category:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (category) {
      setLoading(true);
      try {
        const categoryProducts = getProductsByCategory(category._id);
        setProducts(categoryProducts);
        setSubCategories(category.children ?? []);
        setBreadcrumbs([category]);
        setSubCategory(null);
      } catch (error) {
        console.error("Error loading category data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [category, setSubCategory, getProductsByCategory]);

  const updateSubcategoryState = useCallback(
    (newSubCategory: Category) => {
      const categoryProducts = getProductsByCategory(newSubCategory._id);
      setProducts(categoryProducts);
      setSubCategories(newSubCategory.children);
    },
    [getProductsByCategory]
  );

  const handleSubCategoryChange = useCallback(() => {
    if (
      subCategory &&
      subCategory._id !== breadcrumbs[breadcrumbs.length - 1]._id
    ) {
      updateSubcategoryState(subCategory);
      setBreadcrumbs((prev) => [...prev, subCategory]);
    }
  }, [subCategory, breadcrumbs, updateSubcategoryState]);

  const handleBack = useCallback(() => {
    if (breadcrumbs.length <= 1) return;
    const newBreadcrumbs = breadcrumbs.slice(0, -1);
    const previousCategory = newBreadcrumbs[newBreadcrumbs.length - 1];
    setBreadcrumbs(newBreadcrumbs);
    setSubCategory(previousCategory);
    updateSubcategoryState(previousCategory);
  }, [breadcrumbs, setSubCategory, updateSubcategoryState]);

  const handleCategoryClick = useCallback(
    (category: Category) => {
      setSubCategory(category);
      updateSubcategoryState(category);
      setBreadcrumbs((prev) =>
        prev.slice(0, prev.findIndex((c) => c._id === category._id) + 1)
      );
    },
    [setSubCategory, updateSubcategoryState]
  );

  const handleProductClick = useCallback(
    (product: Product) => {
      if (product.variants.length === 1) {
        if (product.variants[0].is_menu) {
          setSelectedCombo(product.variants[0]);
          setOpenDrawerCombo(true);
        } else {
          addOrUpdateProduct(product, product.variants[0]._id);
        }
      } else if (product.variants.length > 1) {
        setSelectedProduct(product);
        setOpenDrawerVariants(true);
      }
    },
    [
      addOrUpdateProduct,
      setOpenDrawerVariants,
      setSelectedProduct,
      setOpenDrawerCombo,
      setSelectedCombo,
    ]
  );

  useEffect(() => {
    handleSubCategoryChange();
  }, [handleSubCategoryChange]);

  return {
    products,
    subCategories,
    breadcrumbs,
    selectedProducts,
    category,
    subCategory,
    setSubCategory,
    handleBack,
    handleCategoryClick,
    handleProductClick,
    setProducts,
    setSubCategories,
    setBreadcrumbs,
    loading,
  };
};
