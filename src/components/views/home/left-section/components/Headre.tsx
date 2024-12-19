import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { ALL_CATEGORIES_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/leftViewContext";

export default function Header() {
  const { setViews, setSelectedProducts, setQuantityPerVariant, category } =
    useLeftViewContext();
  const { setSelectedCustomer, setCustomerIndex } = useRightViewContext();

  const handelBack = () => {
    setSelectedProducts([]);
    setQuantityPerVariant(0);
    setViews(ALL_CATEGORIES_VIEW);
    setSelectedCustomer(1);
    setCustomerIndex(1);
  };
  return (
    <div className="flex items-start relative justify-start w-full py-2 mt-2 gap-x-2">
      <div
        onClick={handelBack}
        className="flex items-center justify-center w-12 h-14 bg-red-600 rounded-lg cursor-pointer"
      >
        <ArrowLeft className="text-white" />
      </div>
      <motion.div
        initial={{ x: -50, height: "6rem" }}
        animate={{ x: 0, height: "3.54rem" }}
        transition={{ duration: 0.25 }}
        className="h-14 w-[230px]"
      >
        <Card className="flex overflow-hidden relative !bg-zinc-900 cursor-pointer flex-col items-center h-full w-full !rounded-lg justify-center border-2 border-red-600 ring-offset-0">
          {category && (
            <img
              src={`${import.meta.env.VITE_BASE_URL}${category.image}` ?? ""}
              className="absolute w-full h-full object-cover brightness-[0.5]"
              alt={category.name}
              crossOrigin="anonymous"
            />
          )}
          <TypographyP className="text-center relative text-xl font-medium text-white">
            {category ? category.name : "All Products"}
          </TypographyP>
        </Card>
      </motion.div>
    </div>
  );
}
