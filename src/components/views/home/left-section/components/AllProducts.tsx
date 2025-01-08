import { motion } from "framer-motion";
import { useEffect, memo, useMemo } from "react";
import { ProductCard, ProductCardSkeleton } from "../ui/ProductCard";
import ProductsVariants from "./ProductsVariants";
import Combo from "@/components/global/drawers/combo/Combo";
import { useProducts } from "../hooks/useProducts";
import { ProductSelected, Product } from "@/types";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { Grid, Mousewheel, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
        className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3"
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
    <Swiper
      direction="vertical"
      slidesPerView={1}
      grid={{
        rows: ROWS_PER_SLIDE,
        fill: "row",
      }}
      mousewheel={true}
      spaceBetween={24}
      pagination={{
        clickable: true,
        renderBullet: function (_, className) {
          return `<span class="${className} !w-2 !h-2"></span>`;
        },
      }}
      modules={[Grid, Mousewheel, Pagination]}
      className="h-[calc(100vh-250px)] products-swiper px-2"
    >
      {chunkedProducts.map((chunk, slideIndex) => (
        <SwiperSlide key={slideIndex}>
          <div className="grid grid-cols-3 gap-3 h-full pl-4 pr-1 py-2">
            {chunk.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                selectedProducts={selectedProducts}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
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
    const timer = setTimeout(loadProducts, LOADING_DELAY);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  if (loading) {
    return <ProductsLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
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
