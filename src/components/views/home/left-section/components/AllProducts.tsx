import { motion } from "framer-motion";
import { useEffect, memo } from "react";
import { ProductCard, ProductCardSkeleton } from "../ui/ProductCard";
import ProductsVariants from "./ProductsVariants";
import Combo from "@/components/global/drawers/combo/Combo";
import { useProducts } from "../hooks/useProducts";
import { ProductSelected, Product } from "@/types";

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

const ProductsGrid = memo(function ProductsGrid({
  products,
  selectedProducts,
  onProductClick,
}: ProductsGridProps) {
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
