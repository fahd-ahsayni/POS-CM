import { Loading } from "@/components/global/loading";
import { extractProducts } from "@/store/slices/data/generalDataSlice";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { useLeftViewContext } from "../contexts/leftViewContext";
import { useProductSelection } from "../hooks/useProductSelection";
import { ProductCard } from "../Layout/ProductCard";
import ProductsVariants from "./ProductsVariants";

export default function AllProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {
    selectedProducts,
    setSelectedProducts,
    setOpenDrawerVariants,
    setSelectedProduct,
  } = useLeftViewContext();
  const { orderType, selectedCustomer } = useRightViewContext();

  const { addOrUpdateProduct } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    selectedCustomer,
    orderType,
  });

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
        addOrUpdateProduct(product, product.variants[0]._id);
      } else if (product.variants.length > 1) {
        setSelectedProduct(product);
        setOpenDrawerVariants(true);
      }
    },
    [addOrUpdateProduct, setOpenDrawerVariants, setSelectedProduct]
  );

  return (
    <>
      {loading ? (
        <div className="h-96 w-full flex items-center justify-center">
          <Loading />
        </div>
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
              className="w-full grid grid-cols-3 gap-3"
            >
              {data.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  selectedProducts={selectedProducts}
                  onProductClick={handleProductClick}
                />
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
}
