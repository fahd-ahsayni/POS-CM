import Combo from "@/components/global/drawers/combo/Combo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { Category, Product, ProductSelected } from "@/types/product.types";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useProductsByCategory } from "../hooks/useProductsByCategory";
import { CustomBreadcrumb } from "../ui/Bredcrump";
import { ProductCard } from "../ui/ProductCard";
import { ProductsLoadingSkeleton } from "../ui/ProductsLoadingSkeleton";
import Header from "./Header";
import ProductsVariants from "./ProductsVariants";

interface LoadingConfig {
  threshold: number;
  delay: number;
}

const LOADING_CONFIG: LoadingConfig = {
  threshold: 18,
  delay: 500,
};

const ProductGrid = memo(function ProductGrid({
  products,
  selectedProducts,
  handleProductClick,
}: {
  products: Product[];
  selectedProducts: ProductSelected[];
  handleProductClick: (product: Product) => void;
}) {
  const productsWithVariants = useMemo(
    () => products.filter((p) => p.variants.length > 0),
    [products]
  );

  return (
    <motion.div
      className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 px-2 pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {productsWithVariants.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          selectedProducts={selectedProducts}
          onProductClick={handleProductClick}
        />
      ))}
    </motion.div>
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

  // Sort subcategories by sequence
  const sortedSubCategories = useMemo(() => {
    return [...subCategories].sort(
      (a, b) => (a.sequence || 0) - (b.sequence || 0)
    );
  }, [subCategories]);

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
                <div className="flex gap-3 overflow-x-auto w-full scrollbar-hide">
                  {sortedSubCategories.length > 0 ? (
                    sortedSubCategories.map((subCategory, index) => (
                      <motion.div
                        key={`${subCategory._id}-${index}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className="flex-shrink-0"
                      >
                        <Card
                          onClick={() => setSubCategory(subCategory)}
                          className="text-center h-16 flex items-center justify-center px-4 py-2 rounded-lg cursor-pointer min-w-[150px]"
                        >
                          <TypographyP className="text-sm font-medium">
                            {toTitleCase(subCategory.name.toLowerCase())}
                          </TypographyP>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="h-16 w-[230px] flex-shrink-0"
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {products.length > 0 && (
          <>
            <div className="flex items-center justify-between relative flex-shrink-0 mt-4 w-full">
              <TypographyP className="pr-4 bg-background font-medium text-sm">
                Products
              </TypographyP>
              <Separator className="h-[0.5px]" />
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="pt-6">
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
          </>
        )}
      </div>
    </div>
  );
});
