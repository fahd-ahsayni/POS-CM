import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { memo } from "react";
import { useCategories } from "../hooks/useCategories";
import { CategoryCard } from "../ui/CategoryCard";
import { Category } from "@/types/product.types";

export default memo(function AllCategories() {
  const {
    categories,
    handleCategoryClick,
    handleAllProductsClick,
    isInteractionDisabled,
  } = useCategories();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4 pb-16 scrollbar-hide"
    >
      <Card
        onClick={handleAllProductsClick}
        className={cn(
          "flex cursor-pointer relative flex-col items-center h-full !rounded-lg overflow-hidden justify-center",
          isInteractionDisabled && "pointer-events-none"
        )}
      >
        <TypographyP className="text-center text-xl font-medium">
          All Items
        </TypographyP>
      </Card>

      {categories.map((category: Category) => (
        <CategoryCard
          key={category._id}
          category={category}
          isDisabled={isInteractionDisabled}
          onClick={() => handleCategoryClick(category)}
        />
      ))}
    </motion.div>
  );
});
