import BlurFade from "@/components/ui/blur-fade";
import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { cn } from "@/lib/utils";
import { Category } from "@/types/product.types";
import { memo } from "react";

interface CategoryCardProps {
  category: Category;
  isDisabled: boolean;
  onClick: () => void;
}

export const CategoryCard = memo(function CategoryCard({
  category,
  isDisabled,
  onClick,
}: CategoryCardProps) {
  return (
    <BlurFade className="h-24">
      <Card
        onClick={onClick}
        className={cn(
          "flex cursor-pointer relative flex-col items-center h-full overflow-hidden justify-center",
          isDisabled && "pointer-events-none"
        )}
      >
        <img
          src={`${window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL}${category.image}`}
          alt={category.name}
          crossOrigin="anonymous"
          className={cn(
            "object-cover transition-all duration-500",
            isDisabled
              ? "grayscale dark:brightness-[0.30] brightness-[0.6]"
              : "dark:brightness-[0.5] brightness-[0.6]"
          )}
        />
        <TypographyP className="text-center group text-lg font-medium absolute text-white px-6 line-clamp-2">
          {toTitleCase(category.name.toLowerCase())}
        </TypographyP>
      </Card>
    </BlurFade>
  );
});
