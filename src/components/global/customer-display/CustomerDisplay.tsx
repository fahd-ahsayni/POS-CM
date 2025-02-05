import { DishIcon } from "@/assets/figma-icons";
import Logo from "@/components/Layout/components/Logo";
import { TextShimmer } from "@/components/ui/text-shimmer";
import {
  TypographyH4,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { calculateProductPrice } from "@/functions/priceCalculations";
import { currency } from "@/preferences";
import { ProductSelected } from "@/interfaces/product";
import { useEffect, useState } from "react";

interface Product {
  customer_index: number;
  variants: Array<{ 
    name: string; 
    price_ttc: number;
    menus?: Array<{ menu_id: string; price_ttc: number }>;
    default_price?: number;
    is_menu?: boolean;
  }>;
  name: string;
  quantity: number;
  price: number;
  is_combo?: boolean;
  combo_items?: {
    variants: Array<any>;
    supplements: Array<any>;
  };
  discount?: {
    discount_id: string;
    reason: string;
    confirmed_by: string;
  };
  product_variant_id?: string;
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
      (total, customerProducts) => total + calculateCustomerTotal(customerProducts),
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
      <TypographyH4 className="text-center mb-4">Order Details</TypographyH4>
      <div className="max-w-2xl mx-auto relative z-10">
        {Object.keys(groupedProducts).length === 0 ? (
          <TypographySmall className="text-center text-muted-foreground">
            <TextShimmer>Waiting for products...</TextShimmer>
          </TypographySmall>
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
                        {getDisplayPrice(product).toFixed(2)} {currency.currency}
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
