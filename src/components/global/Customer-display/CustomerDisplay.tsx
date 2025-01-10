import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { currency } from "@/preferences";
import { useEffect, useState } from "react";

interface Product {
  customer_index: number;
  variants: Array<{ name: string; price_ttc: number }>;
  name: string;
  quantity: number;
  price: number;
}

interface GroupedProducts {
  [key: string]: Product[];
}

export default function CustomerDisplay() {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "UPDATE_PRODUCTS") {
        // Group products by customer index
        const grouped = event.data.products.reduce((acc: GroupedProducts, product: Product) => {
          const customerIndex = product.customer_index || 1;
          if (!acc[customerIndex]) {
            acc[customerIndex] = [];
          }
          acc[customerIndex].push(product);
          return acc;
        }, {});
        
        setGroupedProducts(grouped);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const calculateCustomerTotal = (products: Product[]) => {
    return products.reduce((sum, product) => {
      const unitPrice = product.variants[0]?.price_ttc || product.price / product.quantity;
      return sum + unitPrice * product.quantity;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return Object.values(groupedProducts).reduce((total, customerProducts) => {
      return total + customerProducts.reduce((sum, product) => sum + product.price, 0);
    }, 0);
  };

  return (
    <div className="h-screen bg-background p-8">
      <TypographyH2 className="text-center mb-8">Order Details</TypographyH2>
      <div className="max-w-2xl mx-auto">
        {Object.keys(groupedProducts).length === 0 ? (
          <TypographyP className="text-center text-muted-foreground">
            Waiting for products...
          </TypographyP>
        ) : (
          <>
            {Object.entries(groupedProducts).map(([customerIndex, customerProducts]) => (
              <div key={customerIndex} className="mb-8 border rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                  Customer {customerIndex}
                </h3>
                {customerProducts.map((product, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-lg">
                        {product.variants[0]?.name || product.name}
                      </p>
                      <p className="text-base">x{product.quantity}</p>
                    </div>
                    <p className="text-lg">
                      {product.price.toFixed(2)} {currency.currency}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4 pt-2 border-t">
                  <p className="text-lg font-semibold">Subtotal</p>
                  <p className="text-lg font-semibold">
                    {calculateCustomerTotal(customerProducts).toFixed(2)} {currency.currency}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center p-4 bg-primary-red/10 mt-4 rounded-lg">
              <p className="text-2xl font-bold">Total</p>
              <p className="text-2xl font-bold">
                {calculateGrandTotal().toFixed(2)} {currency.currency}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
