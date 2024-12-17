import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLeftViewContext } from "../contexts/leftViewContext";

export default function Header() {
  const { setViews, setSelectedProducts } = useLeftViewContext();

  const handelBack = () => {
    setSelectedProducts([]);
    setViews("AllCategories");
  };
  return (
    <div className="flex items-start relative justify-start w-full py-4 mt-2 gap-x-2">
      <div
        onClick={handelBack}
        className="flex items-center justify-center w-12 h-14 bg-primary-color rounded-lg cursor-pointer"
      >
        <ArrowLeft className="text-white" />
      </div>
      <motion.div
        initial={{ x: -50, height: "6rem" }}
        animate={{ x: 0, height: "3.54rem" }}
        transition={{ duration: 0.25 }}
        className="h-14 w-[30%]"
      >
        <Card className="flex !bg-zinc-900 cursor-pointer flex-col items-center h-full w-full !rounded-lg justify-center ring-2 ring-red-600 ring-offset-0">
          <TypographyP className="text-center text-xl font-medium text-white">
            All Products
          </TypographyP>
        </Card>
      </motion.div>
    </div>
  );
}
