import { TypographyP } from "@/components/ui/typography";
import { Separator } from "@radix-ui/react-separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import AllCategories from "../components/AllCategories";
import AllProducts from "../components/AllProducts";
import Header from "../components/Header";
import ProductsByCategory from "../components/ProductsByCategory";
import TablesPlan from "../components/TablesPlan";

// Define constants for tab values
export const ALL_CATEGORIES_VIEW = "AllCategories";
export const TABLES_PLAN_VIEW = "TablesPlan";
export const ALL_PRODUCTS_VIEW = "AllProducts";
export const PRODUCTS_BY_CATEGORY_VIEW = "ProductsByCategory";

// Create a configuration array for tabs
export const tabsConfig = [
  {
    value: ALL_CATEGORIES_VIEW,
    component: <AllCategories />,
    className: "flex-1",
  },
  {
    value: ALL_PRODUCTS_VIEW,
    component: (
      <>
        <Header />
        <div className="flex items-center justify-between relative flex-shrink-0 mt-2">
          <TypographyP className="pr-4 bg-zinc-900 text-white text-sm font-medium ">
            Products
          </TypographyP>
          <Separator />
        </div>
        <div className="w-full h-[80%] relative">
          <ScrollArea className="h-full">
            <AllProducts />
          </ScrollArea>
        </div>
      </>
    ),
    className: "flex-1",
  },
  {
    value: TABLES_PLAN_VIEW,
    component: <TablesPlan />,
    className: "flex-1",
  },
  {
    value: PRODUCTS_BY_CATEGORY_VIEW,
    component: <ProductsByCategory />,
    className: "flex-1",
  },
];
