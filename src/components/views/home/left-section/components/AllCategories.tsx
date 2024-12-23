import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { selectCategories } from "@/store/slices/data/generalDataSlice";
import { Category } from "@/types";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { ALL_PRODUCTS_VIEW, PRODUCTS_BY_CATEGORY_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/leftViewContext";
import { Skeleton } from "@/components/ui/skeleton";

function CategoryCardSkeleton() {
  return (
    <Card className="flex relative flex-col items-center h-24 overflow-hidden justify-center">
      <Skeleton className="w-full h-full dark:bg-white/5 bg-primary-black/30" />
    </Card>
  );
}

export default React.memo(function AllCategories() {
  const { setViews, setCategory, category } = useLeftViewContext();
  const { views } = useRightViewContext();

  const categories = useSelector(selectCategories) as Category[];

  const [isLoading, setIsLoading] = useState(() => {
    const hasSeenLoading = localStorage.getItem("hasSeenCategoryLoading");
    return !hasSeenLoading;
  });

  useEffect(() => {
    console.log(category);
  }, [category]);

  useEffect(() => {
    localStorage.removeItem("hasSeenCategoryLoading");
  }, []);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("hasSeenCategoryLoading", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

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
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={
            !localStorage.getItem("hasSeenCategoryLoading")
              ? { delay: Math.floor(index / 3) * 0.15, duration: 0.25 }
              : { duration: 0 }
          }
          className="h-24"
        >
          <Card
            onClick={() => handleCategoryClick(category)}
            className={cn(
              "flex cursor-pointer relative flex-col items-center h-24 overflow-hidden justify-center bg-zinc-900",
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
                  : "dark:brightness-[0.3] brightness-[0.4]"
              )}
            />
            <TypographyP className="text-center group text-xl capitalize font-medium absolute text-white">
              {category.name.toLowerCase()}
            </TypographyP>
          </Card>
        </motion.div>
      )),
    [categories, views]
  );

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="grid grid-cols-3 gap-3.5 mt-8 pb-16 px-2"
      >
        <CategoryCardSkeleton />
        {[...Array(6)].map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </motion.div>
    );
  }

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
