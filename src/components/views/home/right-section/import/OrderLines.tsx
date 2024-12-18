import { useEffect, useState } from "react";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import OrderLineIndex from "./OrderLineIndex";
import { useRightViewContext } from "../contexts/rightViewContext";

export default function OrderLines() {
  const { selectedProducts, setSelectedProducts } = useLeftViewContext();
  const [groupedProducts, setGroupedProducts] = useState<Record<number, any[]>>({});

  const { customerIndex } = useRightViewContext();

  // Function to increment product quantity
  const incrementQuantity = (productId: string) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
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
          product._id === productId
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
        .filter((product) => product.quantity > 0)
    );
  };

  useEffect(() => {
    // Group products by customer_index
    const grouped = selectedProducts.reduce((acc: Record<number, any[]>, product) => {
      const index = product.customer_index || 1; // Default to 1 if not specified
      if (!acc[index]) {
        acc[index] = [];
      }
      acc[index].push(product);
      return acc;
    }, {});
    setGroupedProducts(grouped);
  }, [selectedProducts]);

  return (
    <div className="z-10 h-full w-full">
      <div className="space-y-4">
        {Array.from({ length: customerIndex }).map((_, index) => (
          <div key={index}>
            <OrderLineIndex 
              customerIndex={index + 1} 
              products={groupedProducts[index + 1] || []}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
