import { TypographyP } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { products } from "@/data";
import ProductInfo from "../components/ProductInfo";

interface AllProductsProps {
  onBack: () => void;
}

export default function AllProducts({ onBack }: AllProductsProps) {
  return (
    <>
      <div className="flex items-start relative justify-start w-full py-4 mt-2 gap-x-2">
        <div
          onClick={onBack}
          className="flex items-center justify-center w-12 h-14 bg-primary-color rounded-lg cursor-pointer"
        >
          <ArrowLeft className="text-white" />
        </div>
        <motion.div
          initial={{ x: -50, height: "6rem" }}
          animate={{ x: 0, height: "3.54rem" }}
          transition={{ duration: 0.35 }}
          className="h-14 w-[30%]"
        >
          <Card className="flex !bg-zinc-900 cursor-pointer flex-col items-center h-full w-full !rounded-lg justify-center ring-2 ring-red-600 ring-offset-0">
            <TypographyP className="text-center text-xl font-medium text-white">
              All Products
            </TypographyP>
          </Card>
        </motion.div>
      </div>
      <div className="flex items-center justify-between relative flex-shrink-0 mt-10">
        <TypographyP className="absolute pr-4 bg-background font-medium">
          Products
        </TypographyP>
        <Separator className="dark:bg-zinc-800/60 bg-zinc-50/70" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="scrollbar-hide w-full overflow-y-auto flex-1 pb-16 mt-6"
      >
        <div className="w-full grid grid-cols-3 gap-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex items-center justify-start h-24 py-2 px-2 !rounded-lg gap-x-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="size-20 object-cover rounded-lg"
              />
              <div className="flex flex-col items-start justify-between flex-1 h-full w-full">
                <TypographyP className="font-medium">
                  {product.name}
                </TypographyP>
                <div className="flex items-center justify-between w-full">
                  <TypographyP className="text-sm font-medium text-zinc-500">
                    {product.price} Dhs
                  </TypographyP>
                  <ProductInfo />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
    </>
  );
}
