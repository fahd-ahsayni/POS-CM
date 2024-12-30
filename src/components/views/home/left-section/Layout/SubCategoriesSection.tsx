import { Category } from "@/types";
import { memo } from "react";
import { CategoryCard } from "../Layout/CategoryCard";

interface SubCategoriesSectionProps {
  subCategories: Category[];
  breadcrumbs: Category[];
  handleBack: () => void;
  handleCategoryClick: (category: Category) => void;
  setSubCategory: (category: Category | null) => void;
}

export const SubCategoriesSection = memo(function SubCategoriesSection({
  subCategories,
  breadcrumbs,
  handleBack,
  handleCategoryClick,
  setSubCategory,
}: SubCategoriesSectionProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-4">
      {subCategories.map((category) => (
        <CategoryCard
          key={category._id}
          category={category}
          isDisabled={false}
          onClick={() => handleCategoryClick(category)}
        />
      ))}
    </div>
  );
});
