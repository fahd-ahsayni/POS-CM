import Combo from "@/components/global/drawers/combo/Combo";
import { Product, ProductSelected } from "@/interfaces/product";
import { memo, useEffect, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductCard, ProductCardSkeleton } from "../ui/ProductCard";
import ProductsVariants from "./ProductsVariants";

interface ProductsGridProps {
  products: Product[];
  selectedProducts: ProductSelected[];
  onProductClick: (product: Product) => void;
}

const SKELETON_COUNT = 9;

const ProductsGrid = memo(function ProductsGrid({
  products,
  selectedProducts,
  onProductClick,
}: ProductsGridProps) {
  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pl-1.5">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          selectedProducts={selectedProducts}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
});

export const ProductsLoadingSkeleton = memo(function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 p-2">
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
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

  const productsWithVariants = useMemo(
    () => products.filter((p) => p.variants.length > 0),
    [products]
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="space-y-2 dark bg-zinc-900 text-white">
      {loading ? (
        <ProductsLoadingSkeleton />
      ) : (
        <>
          <Combo />
          <ProductsVariants />
          <ProductsGrid
            products={productsWithVariants}
            selectedProducts={selectedProducts}
            onProductClick={handleProductClick}
          />
        </>
      )}
    </div>
  );
});

export default AllProducts;
