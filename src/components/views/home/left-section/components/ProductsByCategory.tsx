import CustomSwiper from "@/components/global/CustomSwiper";
import Combo from "@/components/global/drawers/combo/Combo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/ui/typography";
import { Category, Product, ProductSelected } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useProducts } from "../hooks/useProducts";
import { useProductsByCategory } from "../hooks/useProductsByCategory";
import { CustomBreadcrumb } from "../ui/Bredcrump";
import { ProductCard } from "../ui/ProductCard";
import Header from "./Header";
import ProductsVariants from "./ProductsVariants";
import { ProductsLoadingSkeleton } from "../ui/ProductsLoadingSkeleton";

interface LoadingConfig {
  threshold: number;
  delay: number;
}

const LOADING_CONFIG: LoadingConfig = {
  threshold: 18,
  delay: 1000,
};

const PRODUCTS_PER_ROW = 3;
const ROWS_PER_SLIDE = 5;

const ProductGrid = memo(function ProductGrid({
  products,
  selectedProducts,
  handleProductClick,
}: {
  products: Product[];
  selectedProducts: ProductSelected[];
  handleProductClick: (product: Product) => void;
}) {
  const chunkedProducts = useMemo(() => {
    const productsWithVariants = products.filter((p) => p.variants.length > 0);
    const chunks: Product[][] = [];
    const productsPerSlide = PRODUCTS_PER_ROW * ROWS_PER_SLIDE;

    for (let i = 0; i < productsWithVariants.length; i += productsPerSlide) {
      chunks.push(productsWithVariants.slice(i, i + productsPerSlide));
    }
    return chunks;
  }, [products]);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (products.length < 15 || isSmallScreen) {
    return (
      <motion.div
        className="w-full grid grid-cols-2 pl-2 pr-2 py-1 lg:grid-cols-3 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {products.map(
          (product) =>
            product.variants.length > 0 && (
              <ProductCard
                key={product._id}
                product={product}
                selectedProducts={selectedProducts}
                onProductClick={handleProductClick}
              />
            )
        )}
      </motion.div>
    );
  }

  return (
    <CustomSwiper
      direction="vertical"
      grid={{
        rows: 5,
        fill: "row",
      }}
      mousewheel={true}
      showPagination={true}
      className="px-2 products-swiper h-[600px]"
      onInit={(swiper) => {
        swiper.el.classList.add("initialized");
        const bullets = document.querySelectorAll(".swiper-pagination-bullet");
        bullets.forEach((bullet, index) => {
          if (index < 0 || index > 2) {
            bullet.classList.add("hidden");
          }
        });
      }}
      onSlideChange={(swiper) => {
        const bullets = document.querySelectorAll(".swiper-pagination-bullet");
        const activeIndex = swiper.activeIndex;
        const startIndex = Math.max(0, activeIndex - 2);
        const endIndex = Math.min(startIndex + 3, bullets.length - 1);

        bullets.forEach((bullet) => bullet.classList.add("hidden"));
        for (let i = startIndex; i <= endIndex; i++) {
          bullets[i]?.classList.remove("hidden");
        }
      }}
    >
      {chunkedProducts.map((chunk, slideIndex) => (
        <div
          key={slideIndex}
          className="grid grid-cols-3 gap-3 pl-2 pr-1 py-1 h-[500px]"
        >
          {chunk.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              selectedProducts={selectedProducts}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
      ))}
    </CustomSwiper>
  );
});

export default memo(function ProductsByCategory() {
  const {
    products,
    subCategories,
    breadcrumbs,
    selectedProducts,
    handleBack,
    handleCategoryClick,
    handleProductClick,
    setSubCategory,
    category,
  } = useProductsByCategory();

  const { loadProducts } = useProducts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleLoading = async () => {
      if (products.length > LOADING_CONFIG.threshold) {
        setLoading(true);
        timer = setTimeout(() => {
          loadProducts().finally(() => setLoading(false));
        }, LOADING_CONFIG.delay);
      } else {
        setLoading(false);
      }
    };

    handleLoading();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [products.length, loadProducts]);

  return (
    <div className="h-full flex flex-col">
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
                        <TypographyP className="text-center relative font-medium">
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
      <div className="flex-1 overflow-y-auto">
        <div className="flex-none">
          <div className="flex items-center justify-between relative flex-shrink-0 mt-4 w-full overflow-hidden">
            <TypographyP className="pr-4 bg-background font-medium text-sm">
              Products
            </TypographyP>
            <Separator className="h-[0.5px]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="w-full relative pt-6">
            <Combo />
            <ProductsVariants />
            {loading ? (
              <ProductsLoadingSkeleton />
            ) : (
              <ProductGrid
                products={products}
                selectedProducts={selectedProducts}
                handleProductClick={handleProductClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
