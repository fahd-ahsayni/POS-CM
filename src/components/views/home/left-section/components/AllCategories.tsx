import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { selectCategories } from "@/store/slices/data/generalDataSlice";
import { Category } from "@/types";
import { motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { ALL_PRODUCTS_VIEW, PRODUCTS_BY_CATEGORY_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/leftViewContext";

export default React.memo(function AllCategories() {
  const { setViews, setCategory, category } = useLeftViewContext();
  const { views } = useRightViewContext();

  const categories = useSelector(selectCategories) as Category[];

  useEffect(() => {
    console.log(category);
  }, [category]);

  const handleCategoryClick = (category: Category) => {
    setCategory(category);
    setViews(PRODUCTS_BY_CATEGORY_VIEW);
  };

  // Memoize the category cards to avoid re-rendering if categories or selectedOrderType doesn't change
  const categoryCards = useMemo(
    () =>
      categories.map((category, index) => (
        <motion.div
          key={category._id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.095, duration: 0.25 }}
          className="h-24"
        >
          <Card
            onClick={() => handleCategoryClick(category)}
            className={cn(
              "flex cursor-pointer relative flex-col items-center h-24 !rounded-lg overflow-hidden justify-center bg-zinc-900",
              views !== ORDER_SUMMARY_VIEW && "pointer-events-none"
            )}
          >
            <img
              src={`${import.meta.env.VITE_BASE_URL}${category.image}` ?? ""}
              alt={category.name}
              crossOrigin="anonymous"
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                views !== ORDER_SUMMARY_VIEW
                  ? "grayscale dark:brightness-[0.30] brightness-[0.6]"
                  : "dark:brightness-[0.4] brightness-[0.6]"
              )}
            />
            <TypographyP className="text-center group text-xl font-medium absolute text-white">
              {category.name}
            </TypographyP>
          </Card>
        </motion.div>
      )),
    [categories, views]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
