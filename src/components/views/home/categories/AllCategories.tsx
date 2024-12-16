import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { setCurrentView } from "@/store/slices/views/categoriesViewSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { categories } from "@/data";
import { motion } from "framer-motion";

export default function AllCategories() {
 
  const selectedOrderType = useSelector(
    (state: RootState) => state.orderSelection.selectedOrderType
  );
  
  const dispatch = useDispatch();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="scrollbar-hide grid grid-cols-3 gap-2 mt-8 overflow-y-auto flex-1 pb-16"
    >
      <Card
        onClick={() => dispatch(setCurrentView("AllProducts"))}
        className="flex !bg-zinc-900 cursor-pointer relative flex-col items-center h-24 !rounded-lg overflow-hidden justify-center"
      >
        <TypographyP className="text-center text-xl font-medium text-white">
          All Products
        </TypographyP>
      </Card>
      {categories.map((category) => (
        <Card
          key={category.id}
          className="flex cursor-pointer relative flex-col items-center h-24 !rounded-lg overflow-hidden justify-center"
        >
          <img
            src={category.image}
            alt={category.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              selectedOrderType !== "tableConfirmation"
                ? "grayscale brightness-[0.18]"
                : "dark:brightness-[0.3] brightness-[0.4]"
            )}
          />
          <TypographyP className="text-center text-xl font-medium absolute text-white">
            {category.name}
          </TypographyP>
        </Card>
      ))}
    </motion.div>
  );
}
