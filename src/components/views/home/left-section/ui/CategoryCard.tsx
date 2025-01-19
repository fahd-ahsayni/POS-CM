import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { cn } from "@/lib/utils";
import { Category } from "@/types/product.types";
import { Image } from "@unpic/react";
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
    <div className="h-24">
      <Card
        onClick={onClick}
        className={cn(
          "flex cursor-pointer relative flex-col items-center h-full overflow-hidden justify-center",
          isDisabled && "pointer-events-none"
        )}
      >
        <Image
          src={`${window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL}${
            category.image
          }`}
          alt={category.name}
          layout="fullWidth"
          loading="lazy"
          crossOrigin="anonymous"
          className={cn(
            "object-cover transition-all duration-500",
            isDisabled
              ? "grayscale dark:brightness-[0.30] brightness-[0.6]"
              : "dark:brightness-[0.5] brightness-[0.6]"
          )}
        />
        <TypographyH4 className="text-center absolute text-white px-4 line-clamp-2">
          {toTitleCase(category.name.toLowerCase())}
        </TypographyH4>
      </Card>
    </div>
  );
});
