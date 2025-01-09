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
    className: "flex-1 overflow-auto",
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
          <Separator className="dark:bg-zinc-800/60 bg-zinc-50/70" />
        </div>
        <div className="w-full h-full scrollbar-hide relative px-2 pt-4">
          <AllProducts />
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
