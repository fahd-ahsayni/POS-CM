import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography";
import { Category } from "@/interfaces/product";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useCategories } from "../hooks/useCategories";
import { CategoryCard } from "../ui/CategoryCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export default memo(function AllCategories() {
  const {
    categories,
    handleCategoryClick,
    handleAllProductsClick,
    isInteractionDisabled,
  } = useCategories();

  return (
    <div className="h-full w-full">
      <ScrollArea className="h-full w-full pr-2.5">
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 p-1 pb-4")}>
          <Card
            onClick={handleAllProductsClick}
            className={cn(
              "flex cursor-pointer h-24 relative flex-col items-center !rounded-lg overflow-hidden justify-center bg-secondary-black border border-white/15",
              isInteractionDisabled && "pointer-events-none"
            )}
          >
            <TypographyH4 className="text-center text-white">
              All Items
            </TypographyH4>
          </Card>

          {categories.map((category: Category) => (
            <CategoryCard
              key={category._id}
              category={category}
              isDisabled={isInteractionDisabled}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
});
