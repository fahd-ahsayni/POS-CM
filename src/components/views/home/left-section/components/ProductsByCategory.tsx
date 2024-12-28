import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/ui/typography";
import { Category, Product } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { CustomBreadcrumb } from "../Layout/Bredcrump";
import { ProductCard } from "../Layout/ProductCard";
import { useLeftViewContext } from "../contexts/leftViewContext";
import { useProductSelection } from "../hooks/useProductSelection";
import Header from "./Headre";
import ProductsVariants from "./ProductsVariants";
import { BeatLoader } from "react-spinners";

export default memo(function ProductsByCategory() {
  const {
    category,
    selectedProducts,
    setSelectedProducts,
    setOpenDrawerVariants,
    setSelectedProduct,
    subCategory,
    setSubCategory,
  } = useLeftViewContext();

  const rightViewContext = useRightViewContext();
  if (!rightViewContext) return null;
  const { orderType, selectedCustomer } = rightViewContext;

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(category?.products ?? []);
  const [subCategories, setSubCategories] = useState<Category[]>(
    category?.children ?? []
  );
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>(
    [category].filter(Boolean) as Category[]
  );

  const { addOrUpdateProduct } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    selectedCustomer,
    orderType,
  });

  const handleProductClick = useCallback(
    (product: Product) => {
      if (product.variants.length === 1) {
        addOrUpdateProduct(product, product.variants[0]._id);
      } else if (product.variants.length > 1) {
        setSelectedProduct(product);
        setOpenDrawerVariants(true);
      }
    },
    [addOrUpdateProduct, setOpenDrawerVariants, setSelectedProduct]
  );

  const updateSubcategoryState = useCallback((newSubCategory: Category) => {
    setProducts(newSubCategory.products);
    setSubCategories(newSubCategory.children);
  }, []);

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

  useEffect(() => {
    handleSubCategoryChange();
  }, [handleSubCategoryChange]);

  useEffect(() => {
    if (category) {
      setProducts(category.products ?? []);
      setSubCategories(category.children ?? []);
      setBreadcrumbs([category]);
      setSubCategory(null);
    }
  }, [category, setSubCategory]);

  const SubCategoriesSection = useMemo(() => {
    if (!(category?.children?.length ?? 0)) return null;

    const breadcrumbItems = breadcrumbs.map((crumb, index) => ({
      _id: crumb._id,
      name: crumb.name,
      isLast: index === breadcrumbs.length - 1,
      onClick: () => handleCategoryClick(crumb),
    }));

    return (
      <div className="max-w-full">
        <div className="flex items-center overflow-hidden relative mt-4">
          <CustomBreadcrumb items={breadcrumbItems} />
          <Separator className="dark:bg-white/5 h-[0.5px] bg-primary-black/5 absolute left-0" />
        </div>
        <div className="mt-4 max-w-full relative">
          <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
            <Button
              onClick={handleBack}
              disabled={breadcrumbs.length === 1}
              className="flex items-center justify-center w-12 h-16 bg-red-600 rounded-lg cursor-pointer flex-shrink-0 disabled:bg-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="text-white" />
            </Button>
            <div className="w-full flex-1 scrollbar-hide overflow-x-auto relative">
              {subCategories.length > 0 ? (
                <Swiper
                  modules={[Navigation]}
                  spaceBetween={12}
                  slidesPerView={4}
                  className="w-full"
                >
                  {subCategories.map((subCategory, index) => (
                    <SwiperSlide key={`${subCategory._id}-${index}`}>
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                      >
                        <Card
                          onClick={() => setSubCategory(subCategory)}
                          className="text-center h-16 flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer"
                        >
                          <TypographyP className="capitalize leading-5 font-light">
                            {subCategory.name}
                          </TypographyP>
                        </Card>
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="h-16 w-[230px]"
                >
                  <Card className="flex overflow-hidden relative cursor-pointer flex-col items-center h-full w-full justify-center !border-2 !border-red-600">
                    <TypographyP className="text-center relative font-medium text-white">
                      {subCategory?.name}
                    </TypographyP>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }, [
    category?.children,
    subCategories,
    breadcrumbs.length,
    handleBack,
    setSubCategory,
  ]);

  const ProductsGrid = useMemo(() => {
    if (loading) {
      return (
        <div className="h-96 w-full flex items-center justify-center">
          <BeatLoader color="#fb0000" size={10} />
        </div>
      );
    }

    return (
      <>
        <ProductsVariants />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="w-full flex-1 pb-16"
        >
          <div className="w-full grid grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                selectedProducts={selectedProducts}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </motion.div>
      </>
    );
  }, [loading, products, selectedProducts, handleProductClick]);

  return (
    <div className="w-full h-full overflow-hidden">
      <Header />
      {SubCategoriesSection}
      <div>
        <div className="flex items-center justify-between relative flex-shrink-0 mt-4">
          <TypographyP className="pr-4 bg-background font-medium">
            Products
          </TypographyP>
          <Separator className="dark:bg-zinc-800/60 bg-zinc-50/70" />
        </div>
        <div className="w-full h-full overflow-auto scrollbar-hide relative pb-52 px-2">
          <div className="w-full h-8 sticky top-0 left-0 bg-gradient-to-b from-background to-transparent" />
          {ProductsGrid}
        </div>
      </div>
    </div>
  );
});
