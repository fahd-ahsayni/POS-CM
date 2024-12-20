import { unknownProduct } from "@/assets";
import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { Product, ProductSelected } from "@/types";
import { motion } from "framer-motion";

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

  console.log(product);
  return (
    <motion.div className="flex cursor-pointer items-center justify-start h-full w-full">
      <Card
        className={`flex items-center justify-start h-full w-full py-2 px-2 gap-x-4 ${
          totalQuantity > 0 ? "!border-2 !border-red-600" : ""
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
            className={`size-20 object-cover rounded-lg ${
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
                className="bg-primary rounded-full w-8 h-8 flex items-center justify-center"
              >
                <TypographyP className="text-white text-sm font-medium">
                  {totalQuantity}
                </TypographyP>
              </motion.div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-start justify-between flex-1 h-full w-full pr-2">
          <TypographyP className="font-medium text-sm">{product.name}</TypographyP>
          <div className="flex items-center justify-between w-full">
            <TypographyP className="text-sm font-semibold text-[#AAAAAA]">
              {product.price ? product.price : product.variants[0].price_ttc} Dhs
            </TypographyP>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
