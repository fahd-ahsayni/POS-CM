import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { cn } from "@/lib/utils";
import { Category } from "@/interfaces/product";
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
  // Compute baseUrl dynamically
  const baseUrl = localStorage.getItem("ipAddress") || window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;

  return (
    <div className="h-24">
      <Card
        onClick={onClick}
        className={cn(
          "flex cursor-pointer relative flex-col items-center h-full overflow-hidden justify-center border-zinc-500 dark:border-border border",
          isDisabled && "pointer-events-none"
        )}
      >
        <Image
          src={`${baseUrl}${category.image}`}
          alt={category.name}
          layout="fullWidth"
          crossOrigin="anonymous"
          className={cn(
            "object-cover grayscale brightness-[0.4] transition-all duration-150 size-full",
            isDisabled ? "grayscale brightness-[0.3]" : "grayscale-0"
          )}
        />
        <TypographyH4 className="text-center absolute text-white px-4 line-clamp-2">
          {toTitleCase(category.name.toLowerCase())}
        </TypographyH4>
      </Card>
    </div>
  );
});
