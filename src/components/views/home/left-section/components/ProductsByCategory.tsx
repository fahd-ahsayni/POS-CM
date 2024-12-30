import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/ui/typography";
import { Category } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { memo } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { CustomBreadcrumb } from "../Layout/Bredcrump";
import { useProductsByCategory } from "../hooks/useProductsByCategory";
import Combo from "@/components/global/drawers/combo/Combo";
import ProductsVariants from "./ProductsVariants";
import { ProductCard } from "../Layout/ProductCard";
import Header from "./Header";

export default memo(function ProductsByCategory() {
  const {
    products,
    loading,
    subCategories,
    breadcrumbs,
    selectedProducts,
    handleBack,
    handleCategoryClick,
    handleProductClick,
    setSubCategory,
    category,
  } = useProductsByCategory();

  return (
    <div className="w-full h-full overflow-hidden">
      <Header />
      <div className="max-w-full">
        {(category?.children?.length ?? 0) > 0 && (
          <>
            <div className="flex items-center overflow-hidden relative mt-4">
              <CustomBreadcrumb
                items={breadcrumbs.map((crumb: Category, index) => ({
                  _id: crumb._id,
                  name: crumb.name,
                  isLast: index === breadcrumbs.length - 1,
                  onClick: () => handleCategoryClick(crumb),
                }))}
              />
              <Separator />
            </div>
            <div className="mt-4 max-w-full relative">
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                <Button
                  onClick={handleBack}
                  disabled={breadcrumbs.length === 1}
                  className="flex items-center justify-center w-12 h-16 bg-primary-red text-white rounded-lg cursor-pointer flex-shrink-0 disabled:bg-neutral-dark-grey disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <SwiperSlide
                          key={`${subCategory._id}-${index}`}
                          className="w-full pb-1"
                        >
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.05 }}
                          >
                            <Card
                              onClick={() => setSubCategory(subCategory)}
                              className="text-center h-16 flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer"
                            >
                              <TypographyP className="capitalize text-sm font-medium">
                                {subCategory.name.toLowerCase()}
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
                          {breadcrumbs[breadcrumbs.length - 1]?.name}
                        </TypographyP>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between relative flex-shrink-0 mt-4">
          <TypographyP className="pr-4 bg-background font-medium">
            Products
          </TypographyP>
          <Separator />
        </div>
        <div className="w-full h-full overflow-auto scrollbar-hide relative pb-52 px-2">
          <div className="w-full h-8 sticky top-0 left-0 bg-gradient-to-b from-background to-transparent" />
          <>
            <Combo />
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
        </div>
      </div>
    </div>
  );
});
