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

const ProductsGrid = memo(function ProductsGrid({
  products,
  selectedProducts,
  onProductClick,
}: ProductsGridProps) {
  const productsWithVariants = useMemo(
    () => products.filter((p) => p.variants.length > 0),
    [products]
  );

  return (
    <motion.div
      className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pl-1.5"
      {...animationConfig}
    >
      {productsWithVariants.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          selectedProducts={selectedProducts}
          onProductClick={onProductClick}
        />
      ))}
    </motion.div>
  );
});

export const ProductsLoadingSkeleton = memo(function ProductsLoadingSkeleton() {
  return (
    <motion.div
      className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-2"
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
