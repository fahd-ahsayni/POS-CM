import CustomSwiper from "@/components/global/CustomSwiper";
import Combo from "@/components/global/drawers/combo/Combo";
import { Product, ProductSelected } from "@/types/product.types";
import { motion } from "framer-motion";
import { memo, useEffect, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "../ui/ProductCard";
import ProductsVariants from "./ProductsVariants";

interface ProductsGridProps {
  products: Product[];
  selectedProducts: ProductSelected[];
  onProductClick: (product: Product) => void;
}

const LOADING_DELAY = 1000;
const SKELETON_COUNT = 9;

const animationConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.35 },
};

const PRODUCTS_PER_ROW = 3;
const ROWS_PER_SLIDE = 5;

const ProductsGrid = memo(function ProductsGrid({
  products,
  selectedProducts,
  onProductClick,
}: ProductsGridProps) {
  const chunkedProducts = useMemo(() => {
    const productsWithVariants = products.filter((p) => p.variants.length > 0);
    const chunks: Product[][] = [];
    const productsPerSlide = PRODUCTS_PER_ROW * ROWS_PER_SLIDE;

    for (let i = 0; i < productsWithVariants.length; i += productsPerSlide) {
      chunks.push(productsWithVariants.slice(i, i + productsPerSlide));
    }
    return chunks;
  }, [products]);

  if (products.length < 15) {
    return (
      <motion.div
        className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 scrollbar-hide"
        {...animationConfig}
      >
        {products.map(
          (product) =>
            product.variants.length > 0 && (
              <ProductCard
                key={product._id}
                product={product}
                selectedProducts={selectedProducts}
                onProductClick={onProductClick}
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
          className="grid grid-cols-3 gap-3 pl-2 pr-2 py-2 h-[500px]"
        >
          {chunk.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              selectedProducts={selectedProducts}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      ))}
    </CustomSwiper>
  );
});

export const ProductsLoadingSkeleton = memo(function ProductsLoadingSkeleton() {
  return (
    <motion.div
      className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4"
      {...animationConfig}
    >
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </motion.div>
  );
});

const AllProducts = memo(function AllProducts() {
  const {
    products,
    loading,
    selectedProducts,
    handleProductClick,
    loadProducts,
  } = useProducts();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return <ProductsLoadingSkeleton />;
  }

  return (
    <div className="space-y-2">
      <Combo />
      <ProductsVariants />
      <ProductsGrid
        products={products}
        selectedProducts={selectedProducts}
        onProductClick={handleProductClick}
      />
    </div>
  );
});

export default AllProducts;
