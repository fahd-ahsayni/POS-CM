import { useCallback } from "react";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/leftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/rightViewContext";
import { getMaxCustomerIndex } from "@/functions/getMaxCustomerIndex";

export const useCustomerManagement = () => {
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const { customerIndex, setCustomerIndex } = useRightViewContext();

  const deleteCustomer = useCallback(
    (customerIndexToDelete: number) => {
      setSelectedProducts((prevProducts) =>
        prevProducts
          .filter((product) => product.customer_index !== customerIndexToDelete)
          .map((product) => ({
            ...product,
            customer_index:
              product.customer_index > customerIndexToDelete
                ? product.customer_index - 1
                : product.customer_index,
          }))
      );

      if (customerIndex > 1) {
        setCustomerIndex(customerIndex - 1);
      }
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
