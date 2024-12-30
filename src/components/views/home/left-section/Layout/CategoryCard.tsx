import { BlurImage } from "@/components/global/BlurImage";
import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
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
          "flex cursor-pointer relative flex-col items-center h-24 overflow-hidden justify-center",
          isDisabled && "pointer-events-none"
        )}
      >
        <BlurImage
          src={`${import.meta.env.VITE_BASE_URL}${category.image}` ?? ""}
          alt={category.name}
          crossOrigin="anonymous"
          className={cn(
            "object-cover transition-all duration-500",
            isDisabled
              ? "grayscale dark:brightness-[0.30] brightness-[0.6]"
              : "dark:brightness-[0.5] brightness-[0.6]"
          )}
          loadingClassName="dark:bg-white/5 bg-primary-black/30"
        />
        <TypographyP className="text-center group text-xl capitalize font-medium absolute text-white">
          {category.name.toLowerCase()}
        </TypographyP>
      </Card>
    </div>
  );
});
