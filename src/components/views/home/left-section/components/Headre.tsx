import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ALL_CATEGORIES_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/leftViewContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const { setViews, category } = useLeftViewContext();

  const handelBack = () => {
    setViews(ALL_CATEGORIES_VIEW);
  };
  
  return (
    <div className="flex items-start relative justify-start w-full py-2 mt-2 gap-x-2">
      <div
        onClick={handelBack}
        className="flex items-center justify-center w-12 h-14 bg-primary-red rounded-lg cursor-pointer"
      >
        <ArrowLeft className="text-white" />
      </div>
      <motion.div
        initial={{ x: -50, height: "6rem" }}
        animate={{ x: 0, height: "3.54rem" }}
        transition={{ duration: 0.25 }}
        className="h-14 w-[230px]"
      >
        <Card className="flex overflow-hidden relative cursor-pointer flex-col items-center h-full w-full justify-center border-2 !border-primary-red">
          {category && (
            <img
              src={`${import.meta.env.VITE_BASE_URL}${category.image}` ?? ""}
              className="absolute w-full h-full object-cover brightness-[0.5]"
              alt={category.name}
              crossOrigin="anonymous"
            />
          )}
          <TypographyP
            className={cn(
              "text-center relative font-semibold capitalize",
              category && "text-white"
            )}
          >
            {category ? category.name.toLowerCase() : "All Products"}
          </TypographyP>
        </Card>
      </motion.div>
    </div>
  );
}
