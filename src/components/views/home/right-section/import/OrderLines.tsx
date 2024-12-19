import { TypographySmall } from "@/components/ui/typography";
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import { useRightViewContext } from "../contexts/rightViewContext";
import OrderLineIndex from "./OrderLineIndex";

export default function OrderLines() {
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const [groupedProducts, setGroupedProducts] = useState<Record<number, any[]>>(
    {}
  );

  const { customerIndex, setCustomerIndex } = useRightViewContext();

  // Function to increment product quantity
  const incrementQuantity = (productId: string) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + 1 }
          : product
      )
    );
  };

  // Function to decrement product quantity and remove if zero
  const decrementQuantity = (productId: string) => {
    setSelectedProducts((prevProducts) =>
      prevProducts
        .map((product) =>
          product.id === productId
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
        .filter((product) => product.quantity > 0)
    );
  };

  // Add this new function
  const deleteCustomer = (customerIndexToDelete: number) => {
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
  };

  useEffect(() => {
    // Group products by customer_index
    const grouped = selectedProducts.reduce(
      (acc: Record<number, any[]>, product) => {
        const index = product.customer_index || 1; // Default to 1 if not specified
        if (!acc[index]) {
          acc[index] = [];
        }
        acc[index].push(product);
        return acc;
      },
      {}
    );
    setGroupedProducts(grouped);
  }, [selectedProducts]);

  return (
    <div className="z-10 h-full w-full">
      <div className="space-y-4">
        {selectedProducts.length < 1 ? (
          <div className="flex items-center justify-between w-full pl-3 pr-1.5 rounded-md mb-2.5">
            <div className="flex items-center justify-center gap-x-2 flex-1 bg-zinc-800 rounded-md px-2 py-2">
              <div className="flex items-center justify-center gap-x-2">
                <User className="w-4 h-4" />
                <TypographySmall className="text-sm">
                  Customer {customerIndex}
                </TypographySmall>
              </div>
            </div>
          </div>
        ) : (
          Array.from({ length: customerIndex }).map((_, index) => (
            <div key={index}>
              <OrderLineIndex
                customerIndex={index + 1}
                products={groupedProducts[index + 1] || []}
                incrementQuantity={incrementQuantity}
                decrementQuantity={decrementQuantity}
                deleteCustomer={deleteCustomer}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
