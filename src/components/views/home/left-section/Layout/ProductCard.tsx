import { unknownProduct } from "@/assets";
import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { Product, ProductSelected } from "@/types";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { currency } from "@/preferences";

interface ProductCardProps {
  product: Product;
  selectedProducts: ProductSelected[];
  onProductClick: (product: Product) => void;
}

export function ProductCard({
  product,
  selectedProducts,
  onProductClick,
}: ProductCardProps) {
  const selectedProductVariants = selectedProducts.filter(
    (p) => p._id === product._id
  );

  const totalQuantity = selectedProductVariants.reduce(
    (sum, p) => sum + p.quantity,
    0
  );

  return (
    <motion.div className="flex cursor-pointer items-center justify-start h-full w-full">
      <Card
        className={`flex items-center justify-start h-full w-full py-2 px-2 gap-x-4 ${
          totalQuantity > 0 ? "!ring-2 !ring-red-600" : ""
        }`}
        onClick={() => onProductClick(product)}
      >
        <div className="relative flex items-center justify-center">
          <img
            src={
              product.image
                ? `${import.meta.env.VITE_BASE_URL}${product.image}`
                : unknownProduct
            }
            alt={product.name}
            crossOrigin="anonymous"
            className={`size-16 object-cover !rounded-[0.375rem] ${
              totalQuantity > 0
                ? "brightness-50 transition-all duration-500"
                : ""
            }`}
          />
          {totalQuantity > 0 && (
            <div className="absolute w-full h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="bg-primary-red rounded-full w-7 h-7 flex items-center justify-center shadow-lg shadow-primary-red/50"
              >
                <TypographyP className="text-white text-[.8rem] font-semibold">
                  {totalQuantity}
                </TypographyP>
              </motion.div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start justify-between flex-1 h-full w-full pr-2">
          <TypographyP className="font-medium text-sm capitalize">
            {product.name.toLowerCase()}
          </TypographyP>
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm font-medium text-neutral-dark-grey">
              {product.price ? product.price : product.variants[0].price_ttc}{" "}
              {currency.symbol}
            </TypographyP>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex items-center justify-start h-full w-full">
      <Card className="flex items-center justify-start h-full w-full py-2 px-2 gap-x-4">
        <Skeleton className="size-16 rounded-lg dark:bg-white/5 bg-primary-black/5" />
        <div className="flex flex-col items-start justify-between flex-1 h-full w-full pr-2 gap-y-2">
          <Skeleton className="h-4 w-3/4 dark:bg-white/5 bg-primary-black/5" />
          <Skeleton className="h-4 w-1/4 dark:bg-white/5 bg-primary-black/5" />
        </div>
      </Card>
    </div>
  );
}
