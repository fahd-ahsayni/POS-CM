import { Category, Product } from "@/interfaces/product";
import { useCallback, useEffect, useState } from "react";
import { useRightViewContext } from "../../right-section/contexts/RightViewContext";
import { useLeftViewContext } from "../contexts/LeftViewContext";
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
    const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
    const products = generalData.products || [];
    const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");

    return products.filter((product: Product) => {
      // Check if product belongs to the selected category
      const matchesCategory = product.category_id === categoryId;

      // Check if product is available in the selected menu
      const isInMenu = product.menus?.some(
        (menu) =>
          menu.menu_id === orderType.menu_id &&
          menu.is_displayed &&
          !menu.archived
      );

      return matchesCategory && isInMenu;
    });
  }, []);

  const findCategoryWithChildren = useCallback((categoryId: string) => {
    const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
    const allCategories = generalData.categories || [];

    // Find the target category
    const targetCategory = allCategories.find(
      (c: Category) => c._id === categoryId
    );
    if (!targetCategory) return null;

    // Find all immediate children for this category
    const children = allCategories
      .filter((c: Category) => c.parent_id === categoryId)
      .sort(
        (a: Category, b: Category) => (a.sequence || 0) - (b.sequence || 0)
      );

    return {
      ...targetCategory,
      children,
    };
  }, []);

  const getBreadcrumbPath = useCallback((categoryId: string) => {
    const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
    const allCategories = generalData.categories || [];
    const path: Category[] = [];

    let currentCategoryId = categoryId;
    while (currentCategoryId) {
      const category = allCategories.find(
        (c: Category) => c._id === currentCategoryId
      );
      if (!category) break;

      path.unshift(category); // Add to start of array
      currentCategoryId = category.parent_id || "";
    }

    return path;
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
      setSubCategories(newSubCategory.children ?? []);
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

    // Reset breadcrumbs with "Subcategories" as the first item
    const updatedBreadcrumbs = newBreadcrumbs.map((crumb, index) => ({
      ...crumb,
      name: index === 0 ? "Subcategories" : crumb.name,
    }));

    setBreadcrumbs(updatedBreadcrumbs);
    setSubCategory(previousCategory);
    updateSubcategoryState(previousCategory);
  }, [breadcrumbs, setSubCategory, updateSubcategoryState]);

  const handleCategoryClick = useCallback(
    (clickedCategory: Category) => {
      setLoading(true);

      if (breadcrumbs.find((c) => c._id === clickedCategory._id)) {
        // Clicking on breadcrumb - navigate back to that level
        const newBreadcrumbs = breadcrumbs
          .slice(
            0,
            breadcrumbs.findIndex((c) => c._id === clickedCategory._id) + 1
          )
          .map((crumb, index) => ({
            ...crumb,
            name: index === 0 ? "Subcategories" : crumb.name,
          }));
        setBreadcrumbs(newBreadcrumbs);
      } else {
        // Clicking on new category
        const breadcrumbPath = getBreadcrumbPath(clickedCategory._id).map(
          (crumb, index) => ({
            ...crumb,
            name: index === 0 ? "Subcategories" : crumb.name,
          })
        );
        setBreadcrumbs(breadcrumbPath);
      }

      const fullCategory = findCategoryWithChildren(clickedCategory._id);
      if (fullCategory) {
        setSubCategory(fullCategory);
        setSubCategories(fullCategory.children || []);
        const products = getProductsByCategory(clickedCategory._id);
        setProducts(products);
      }

      setLoading(false);
    },
    [
      breadcrumbs,
      findCategoryWithChildren,
      getProductsByCategory,
      getBreadcrumbPath,
    ]
  );

  const handleProductClick = useCallback(
    (product: Product) => {
      if (product.variants.length === 1) {
        const variant = product.variants[0];
        if (variant.is_menu) {
          if (variant.steps.length <= 1 && variant.steps[0]?.is_required) {
            // Auto-select and finish for single required step; do not open drawer
            const orderTypeLS = JSON.parse(localStorage.getItem("orderType") || "{}");
            const menuPrice = variant.menus?.find((menu: any) => menu.menu_id === orderTypeLS.menu_id)?.price_ttc || variant.default_price;
            const uniqueId = `combo_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;
            const comboProduct = {
              _id: uniqueId,
              id: uniqueId,
              name: product.name,
              quantity: 1,
              price: menuPrice,
              variants: [variant],
              product_variant_id: variant._id,
              customer_index: customerIndex,
              order_type_id: orderTypeLS._id || "",
              uom_id: variant.uom_id?._id || "",
              is_combo: true,
              is_ordred: false,
              is_paid: false,
              combo_items: {
                variants: variant.steps[0]?.product_variant_ids?.map((v: any) => ({
                  ...v,
                  combo_id: uniqueId,
                  suite_commande: v.suite_commande || false,
                  quantity: 1, // Add quantity field
                })) || [],
                supplements: []
              },
              notes: [],
              discount: null,
              suite_commande: false,
              high_priority: false,
            };
            setSelectedProducts((prev: any) => [...prev, comboProduct]);
            return;
          } else {
            setSelectedCombo(variant);
            setOpenDrawerCombo(true);
          }
        } else {
          addOrUpdateProduct(product, variant._id);
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
      customerIndex
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
