import { TypographyP } from "@/components/ui/typography";
import { Separator } from "@radix-ui/react-separator";
import AllCategories from "../components/AllCategories";
import AllProducts from "../components/AllProducts";
import Header from "../components/Header";
import ProductsByCategory from "../components/ProductsByCategory";

// Define constants for tab values
export const ALL_CATEGORIES_VIEW = "AllCategories";
export const ALL_PRODUCTS_VIEW = "AllProducts";
export const PRODUCTS_BY_CATEGORY_VIEW = "ProductsByCategory";

// Create a configuration array for tabs
export const tabsConfig = [
  {
    value: ALL_CATEGORIES_VIEW,
    component: <AllCategories />,
    className: "flex-1 overflow-auto scrollbar-hide",
  },
  {
    value: ALL_PRODUCTS_VIEW,
    component: (
      <>
        <Header />
        <div className="flex items-center justify-between relative flex-shrink-0 mt-2">
          <TypographyP className="pr-4 bg-background text-sm font-medium">
            Products
          </TypographyP>
          <Separator />
        </div>
        <div className="w-full h-[90%] relative">
          <div className="h-6 bg-gradient-to-b from-background to-transparent w-[calc(100%-0.5rem)] absolute top-0 left-0" />
          <div className="h-full overflow-auto pt-3 pr-3 pb-52">
            <AllProducts />
          </div>
        </div>
      </>
    ),
    className: "flex-1",
  },
  {
    value: PRODUCTS_BY_CATEGORY_VIEW,
    component: <ProductsByCategory />,
    className: "flex-1",
  },
];
