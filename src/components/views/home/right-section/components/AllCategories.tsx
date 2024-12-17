import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { selectCategories } from "@/store/slices/data/generalDataSlice";
import { Category } from "@/types";
import { useRightViewContext } from "../contexts/rightViewContext";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";


export default React.memo(function AllCategories() {
  const { setViews } = useLeftViewContext();
  const { views } = useRightViewContext();

  const categories = useSelector(selectCategories) as Category[];

  // Memoize the category cards to avoid re-rendering if categories or selectedOrderType doesn't change
  const categoryCards = useMemo(
    () =>
      categories.map((category) => (
        <Card
          key={category._id}
          className={cn(
            "flex cursor-pointer relative flex-col items-center h-24 !rounded-lg overflow-hidden justify-center",
            views !== "OrderSumary" && "pointer-events-none"
          )}
        >
          <img
            src={`${import.meta.env.VITE_BASE_URL}${category.image}` ?? ""}
            alt={category.name}
            crossOrigin="anonymous"
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              views !== "OrderSumary"
                ? "grayscale brightness-[0.18]"
                : "brightness-[0.4]"
            )}
          />
          <TypographyP className="text-center text-xl font-medium absolute text-white">
            {category.name}
          </TypographyP>
        </Card>
      )),
    [categories, views]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="grid grid-cols-3 gap-3.5 mt-8 pb-16"
    >
      <Card
        onClick={() => views === "OrderSumary" && setViews("AllProducts")}
        className={cn(
          "flex !bg-zinc-800 cursor-pointer relative flex-col items-center h-24 !rounded-lg overflow-hidden justify-center",
          views !== "OrderSumary" && "pointer-events-none"
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
