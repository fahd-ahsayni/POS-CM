import { useVirtualizer } from "@tanstack/react-virtual";
import { Product, ProductSelected } from "@/types";
import { memo, useRef } from "react";
import { ProductCard } from "../ui/ProductCard";

interface ProductGridProps {
  products: Product[];
  selectedProducts: ProductSelected[];
  onProductClick: (product: Product) => void;
}

export const VirtualizedProductGrid = memo(function VirtualizedProductGrid({
  products,
  selectedProducts,
  onProductClick,
}: ProductGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const ROW_HEIGHT = 200; // Adjust based on your card height
  const COLS_COUNT = window.innerWidth < 1024 ? 2 : 3;

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(products.length / COLS_COUNT),
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * COLS_COUNT;
          return (
            <div
              key={virtualRow.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${ROW_HEIGHT}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 px-2"
            >
              {products
                .slice(startIndex, startIndex + COLS_COUNT)
                .map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    selectedProducts={selectedProducts}
                    onProductClick={onProductClick}
                  />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});
