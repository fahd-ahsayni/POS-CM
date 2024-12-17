import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useLeftViewContext } from "./contexts/leftViewContext";
import AllCategories from "./components/AllCategories";
import Header from "./components/Headre";
import { TypographyP } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import AllProducts from "./components/AllProducts";

export default function RightSection() {
  const { views } = useLeftViewContext();

  return (
    <div className="w-full h-full mt-6">
      <div className="flex items-center justify-between relative flex-shrink-0">
        <TypographyP className="absolute pr-4 bg-background font-medium">
          Categories
        </TypographyP>
        <Separator className="dark:bg-zinc-800/60 bg-zinc-50/70" />
      </div>
      <Tabs value={views} className="w-full h-full flex">
        <TabsContent
          value="AllCategories"
          className="w-full h-full flex-1 overflow-auto"
        >
          <AllCategories />
        </TabsContent>
        <TabsContent
          value="AllProducts"
          className="w-full h-full flex-1"
        >
          <Header />
          <div className="flex items-center justify-between relative flex-shrink-0 mt-5">
            <TypographyP className="pr-4 bg-background font-medium">
              Products
            </TypographyP>
            <Separator className="dark:bg-zinc-800/60 bg-zinc-50/70" />
          </div>
          <div className="w-full h-full overflow-auto relative pb-52">
            <div className="w-full h-8 sticky top-0 left-0 bg-gradient-to-b from-background to-transparent" />
            <AllProducts />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
