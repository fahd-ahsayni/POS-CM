import { TypographyP } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { motion, Variant } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types";
import { useEffect, useState, useCallback } from "react";
import { unknownProduct } from "@/assets";
import { extractProducts } from "@/store/slices/data/generalDataSlice";
import { useLeftViewContext } from "../contexts/leftViewContext";
import ProductsVariants from "./ProductsVariants";
import { ProductSelected } from "@/types";

export default function AllProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {
    selectedProducts,
    setSelectedProducts,
    setOpenDrawerVariants,
    setSelectedProduct,
  } = useLeftViewContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedGeneralData = localStorage.getItem("generalData");
      if (storedGeneralData) {
        const parsedData = JSON.parse(storedGeneralData);
        const products = extractProducts(parsedData.categories);
        setData(products);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleProductClick = useCallback(
    (product: Product) => {
      if (product.variants.length === 1) {
        const variant = product.variants[0];
        setSelectedProducts((prevSelected: ProductSelected[]) => {
          const existingProduct = prevSelected.find(
            (p) => p._id === product._id && p.variant_id === variant._id
          );
          const updatedProducts = existingProduct
            ? prevSelected.map((p) =>
                p._id === product._id && p.variant_id === variant._id
                  ? { ...p, quantity: p.quantity + 1 }
                  : p
              )
            : [
                ...prevSelected,
                {
                  ...product,
                  variant_id: variant._id,
                  quantity: 1,
                },
              ];

          console.log("All Selected Products:", updatedProducts);
          return updatedProducts;
        });
      } else if (product.variants.length > 1) {
        setSelectedProduct(product);
        setOpenDrawerVariants(true);
      }
    },
    [setSelectedProducts, setOpenDrawerVariants, setSelectedProduct]
  );

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <ProductsVariants />
          <motion.div
            transition={{ duration: 0.35 }}
            className="w-full flex-1 pb-16"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="w-full grid grid-cols-3 gap-3 overflow-auto"
            >
              {data.map((product) => (
                <motion.div
                  key={product._id}
                  className="flex cursor-pointer items-center justify-start h-full w-full"
                >
                  <Card
                    className={`flex items-center justify-start h-full w-full py-2 px-2 !rounded-lg gap-x-4 ${
                      selectedProducts.some(
                        (p) => p._id === product._id && p.variant_id === product.variants[0]._id
                      )
                        ? "border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={
                        product.image
                          ? `${import.meta.env.VITE_BASE_URL}${product.image}`
                          : unknownProduct
                      }
                      alt={product.name}
                      crossOrigin="anonymous"
                      className="size-20 object-cover rounded-lg"
                    />
                    <div className="flex flex-col items-start justify-between flex-1 h-full w-full">
                      <TypographyP className="font-medium">
                        {product.name}
                      </TypographyP>
                      <div className="flex items-center justify-between w-full">
                        <TypographyP className="text-sm font-medium text-zinc-300">
                          {product.price} Dhs
                        </TypographyP>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
}
