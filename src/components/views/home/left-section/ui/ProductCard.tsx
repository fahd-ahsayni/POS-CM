import { unknownProduct } from "@/assets";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { currency } from "@/preferences";
import { Product, ProductSelected } from "@/types/product.types";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { BsInfoCircleFill } from "react-icons/bs";

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
  // Get the current orderType from localStorage
  const currentMenu = useMemo(() => {
    try {
      const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
      return orderType.menu_id || null;
    } catch (error) {
      console.error("Error parsing orderType:", error);
      return null;
    }
  }, []);

  // Get price based on menu
  const price = useMemo(() => {
    const variant = product.variants[0];
    if (!variant) return 0;

    // Find menu-specific price in the variant's menus array
    if (currentMenu && variant.menus?.length > 0) {
      const menuPrice = variant.menus.find(
        (menu) => menu.menu_id === currentMenu
      )?.price_ttc;

      if (menuPrice !== undefined) {
        return menuPrice;
      }
    }

    // If no menu-specific price found, use default_price
    return variant.default_price || 0;
  }, [product.variants, currentMenu]);

  // Get all variants of this product across all customers
  const selectedProductVariants = useMemo(() => {
    return selectedProducts.filter((p) => {
      // For regular products, check if variant belongs to this product
      const isRegularProduct = product.variants.some(
        (variant) => variant._id === p.product_variant_id && !variant.is_menu
      );

      // For combos, check if any variant of this product is a combo and matches the selected product
      const isComboProduct = product.variants.some(
        (variant) => 
          variant.is_menu && 
          p.is_combo && 
          p.product_variant_id === variant._id
      );

      return isRegularProduct || isComboProduct;
    });
  }, [product.variants, selectedProducts]);

  // Calculate total quantity across all variants and customers
  const totalQuantity = useMemo(() => 
    selectedProductVariants.reduce((sum, p) => sum + (p.quantity || 0), 0),
    [selectedProductVariants]
  );

  return (
    <motion.div className="flex cursor-pointer items-center justify-start h-24 w-full">
      <Card
        className={`flex items-center justify-center h-full w-full py-2 px-3 gap-x-4 ${
          totalQuantity > 0 ? "!ring-2 !ring-primary-red" : ""
        }`}
        onClick={() => onProductClick(product)}
      >
        <div className="relative h-full flex items-center justify-center">
          <div className="flex items-center justify-center h-full">
            <img
              src={
                product.image
                  ? `${window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL}${product.image}`
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
          </div>
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
        <div className="flex flex-col items-start justify-between flex-1 h-full w-full pr-2 py-2">
          <TypographySmall className="font-medium text-sm line-clamp-2">
            {toTitleCase(product.name.toLowerCase())}
          </TypographySmall>
          <div className="flex items-center justify-between w-full">
            <TypographySmall className="font-medium text-neutral-dark-grey">
              {price?.toFixed(2)} {currency.symbol}
            </TypographySmall>
            <BsInfoCircleFill className="text-info-color/90 w-4 h-4" />
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
