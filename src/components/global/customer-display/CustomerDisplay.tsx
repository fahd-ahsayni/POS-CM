import { DishIcon } from "@/assets/figma-icons";
import Logo from "@/components/Layout/components/Logo";
import {
  TypographyH2,
  TypographyH4,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { GroupedProducts, Product } from "@/interfaces/customer-display";
import { ProductSelected } from "@/interfaces/product";
import { currency } from "@/preferences";
import { useEffect, useState } from "react";

const BRAND_NAME = import.meta.env.VITE_BRAND_NAME;
export default function CustomerDisplay() {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts>({});

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "UPDATE_PRODUCTS") {
        // Group products by customer index
        const grouped = event.data.products.reduce(
          (acc: GroupedProducts, product: Product) => {
            const customerIndex = product.customer_index || 1;
            if (!acc[customerIndex]) {
              acc[customerIndex] = [];
            }
            acc[customerIndex].push(product);
            return acc;
          },
          {}
        );

        setGroupedProducts(grouped);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const calculateCustomerTotal = (products: Product[]) => {
    return products.reduce((sum, product) => {
      // Use the same price calculation logic as the main app
      const priceCalc = calculateProductPrice(
        product as ProductSelected,
        JSON.parse(localStorage.getItem("orderType") || "{}")?.menu_id || null,
        product.quantity
      );
      return sum + priceCalc.totalPrice;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return Object.values(groupedProducts).reduce(
      (total, customerProducts) =>
        total + calculateCustomerTotal(customerProducts),
      0
    );
  };

  const getDisplayPrice = (product: Product) => {
    const priceCalc = calculateProductPrice(
      product as ProductSelected,
      JSON.parse(localStorage.getItem("orderType") || "{}")?.menu_id || null,
      product.quantity
    );
    return priceCalc.totalPrice;
  };

  return (
    <div className="h-screen bg-background p-8 relative overflow-hidden">
      <div className="absolute top-4 left-6">
        <Logo />
      </div>
      <div
        className="absolute rounded-full -top-48 -right-48 w-[320px] h-[320px] bg-primary-red/50 blur-3xl"
        aria-hidden="true"
      />
      <div className="max-w-md px-8 text-center mx-auto relative z-10 w-full h-full flex items-center justify-center flex-col">
        {Object.keys(groupedProducts).length === 0 ? (
          <>
            <TypographyH2 className="tracking-wide">
              Welcome to {BRAND_NAME}!<br /> We’re glad you’re here.
            </TypographyH2>
            <TypographyP className="mt-4 text-foreground/60">
              Whenever you’re ready, our menu is waiting. Just let us know what
              you’d like!
            </TypographyP>
          </>
        ) : (
          <>
            {Object.entries(groupedProducts).map(
              ([customerIndex, customerProducts]) => (
                <div
                  key={customerIndex}
                  className="mb-4 border rounded-lg overflow-hidden bg-secondary-white dark:bg-primary-black"
                >
                  <TypographyP className="font-medium border-b p-3 dark:bg-secondary-black bg-white">
                    Customer {customerIndex}
                  </TypographyP>
                  {customerProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b p-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <TypographySmall className="text-muted-foreground">
                            {product.variants[0]?.name || product.name}
                          </TypographySmall>
                          <TypographySmall className="font-semibold flex items-center gap-x-0.5">
                            <span>
                              <DishIcon className="w-4 h-4 dark:fill-white fill-primary-black" />
                            </span>
                            <span>{product.quantity}</span>
                          </TypographySmall>
                        </div>
                        {product.discount && (
                          <TypographySmall className="text-primary-red">
                            Discount Applied
                          </TypographySmall>
                        )}
                      </div>
                      <TypographySmall className="font-semibold">
                        {getDisplayPrice(product).toFixed(2)}{" "}
                        {currency.currency}
                      </TypographySmall>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 dark:bg-primary-black bg-white">
                    <TypographyP className="font-semibold">Total</TypographyP>
                    <TypographyP className="font-semibold">
                      {calculateCustomerTotal(customerProducts).toFixed(2)}{" "}
                      {currency.currency}
                    </TypographyP>
                  </div>
                </div>
              )
            )}
            <div className="flex justify-between items-center p-4 mt-4 rounded-lg border-t border-dashed">
              <TypographyH4>Total</TypographyH4>
              <TypographyH4>
                {calculateGrandTotal().toFixed(2)} {currency.currency}
              </TypographyH4>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
