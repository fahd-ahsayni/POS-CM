import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Category } from "@/types";
import { motion } from "framer-motion";
import React from "react";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { ALL_PRODUCTS_VIEW, PRODUCTS_BY_CATEGORY_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/leftViewContext";
import { BlurImage } from "@/components/global/BlurImage";

export default React.memo(function AllCategories() {
  const { setViews, setCategory, category } = useLeftViewContext();
  const { views } = useRightViewContext();

  const categories =
    JSON.parse(localStorage.getItem("generalData") || "{}").categories || [];

  const handleCategoryClick = (category: Category) => {
    setCategory(category);
    setViews(PRODUCTS_BY_CATEGORY_VIEW);
  };

  // Memoize the category cards
  const categoryCards = React.useMemo(
    () =>
      categories.map((category: Category, index: number) => (
        <div key={category._id} className="h-24">
          <Card
            onClick={() => handleCategoryClick(category)}
            className={cn(
              "flex cursor-pointer relative flex-col items-center h-24 overflow-hidden justify-center bg-zinc-900",
              views !== ORDER_SUMMARY_VIEW && "pointer-events-none"
            )}
          >
            <BlurImage
              src={`${import.meta.env.VITE_BASE_URL}${category.image}` ?? ""}
              alt={category.name}
              crossOrigin="anonymous"
              className={cn(
                "object-cover transition-all duration-500",
                views !== ORDER_SUMMARY_VIEW
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
      )),
    [categories, views]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-3 gap-3.5 mt-8 pb-16 px-2"
    >
      <Card
        onClick={() => {
          if (views === ORDER_SUMMARY_VIEW) {
            setViews(ALL_PRODUCTS_VIEW);
          }
          setCategory(null);
        }}
        className={cn(
          "flex !bg-zinc-800 cursor-pointer relative flex-col items-center h-24 !rounded-lg overflow-hidden justify-center",
          views !== ORDER_SUMMARY_VIEW && "pointer-events-none"
        )}
      >
        <TypographyP className="text-center text-xl font-medium text-white">
          All Products
        </TypographyP>
      </Card>
      {categoryCards}
    </motion.div>
  );
});
