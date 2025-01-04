import { useCallback, useEffect } from "react";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { getMaxCustomerIndex } from "@/functions/getMaxCustomerIndex";

export const useCustomerManagement = () => {
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const { customerIndex, setCustomerIndex } = useRightViewContext();

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setCustomerIndex(1);
    }
  }, [selectedProducts, setCustomerIndex]);

  const deleteCustomer = useCallback(
    (customerIndexToDelete: number) => {
      setSelectedProducts((prevProducts) => {
        const newProducts = prevProducts
          .filter((product) => product.customer_index !== customerIndexToDelete)
          .map((product) => ({
            ...product,
            customer_index:
              product.customer_index > customerIndexToDelete
                ? product.customer_index - 1
                : product.customer_index,
          }));

        if (newProducts.length === 0) {
          setCustomerIndex(1);
        } else if (customerIndex > 1) {
          setCustomerIndex(customerIndex - 1);
        }

        return newProducts;
      });
    },
    [customerIndex, setCustomerIndex, setSelectedProducts]
  );

  const addCustomer = useCallback(() => {
    const lastCustomerHasProducts = selectedProducts.some(
      (product) => product.customer_index === customerIndex
    );

    if (selectedProducts.length > 0 && lastCustomerHasProducts) {
      setCustomerIndex(getMaxCustomerIndex(selectedProducts) + 1);
    }
  }, [customerIndex, selectedProducts, setCustomerIndex]);

  const resetCustomerIndex = useCallback(() => {
    setCustomerIndex(1);
  }, [setCustomerIndex]);

  const handlePaymentComplete = useCallback(() => {
    setSelectedProducts([]);
    resetCustomerIndex();
  }, [setSelectedProducts, resetCustomerIndex]);

  return {
    deleteCustomer,
    addCustomer,
    handlePaymentComplete,
    resetCustomerIndex
  };
};
