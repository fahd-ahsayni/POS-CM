import { motion } from "framer-motion";
import { useEffect } from "react";
import { ProductCard, ProductCardSkeleton } from "../ui/ProductCard";
import ProductsVariants from "./ProductsVariants";
import Combo from "@/components/global/drawers/combo/Combo";
import { useProducts } from "../hooks/useProducts";
import { memo } from "react";
import { ProductSelected } from "@/types";
import { Product } from "@/types";

interface ProductsGridProps {
  products: Product[];
  selectedProducts: ProductSelected[];
  onProductClick: (product: Product) => void;
}

export const ProductsGrid = memo(({ products, selectedProducts, onProductClick }: ProductsGridProps) => (
  <motion.div 
    className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.35 }}
  >
    {products.map((product) =>
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
));

const AllProducts = memo(function AllProducts() {
  const {
    products,
    loading,
    selectedProducts,
    handleProductClick,
    loadProducts,
  } = useProducts();

  useEffect(() => {
    const timer = setTimeout(loadProducts, 1000);
    return () => clearTimeout(timer);
  }, [loadProducts]);

  if (loading) {
    return <ProductsLoadingSkeleton />;
  }

  return (
    <>
      <Combo />
      <ProductsVariants />
      <ProductsGrid
        products={products}
        selectedProducts={selectedProducts}
        onProductClick={handleProductClick}
      />
    </>
  );
});

// Separate components for better organization
const ProductsLoadingSkeleton = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.35 }}
    className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4"
  >
    {[...Array(9)].map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </motion.div>
));

export default AllProducts;
