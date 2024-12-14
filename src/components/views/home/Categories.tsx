import { TypographyP } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/data";
import { Card } from "@/components/ui/card";

export default function Categories() {
  return (
    <div className="flex flex-col min-h-0 flex-1 mt-4">
      <div className="flex items-center justify-between relative flex-shrink-0">
        <TypographyP className="absolute pr-4 bg-background font-medium">
          Categories
        </TypographyP>
        <Separator className="dark:bg-zinc-800/60 bg-zinc-50/70" />
      </div>
      <div className="scrollbar-hide grid grid-cols-3 gap-2 mt-8 overflow-y-auto flex-1 pb-16">
        <Card className="flex bg-zinc-900 cursor-pointer relative flex-col items-center h-24 !rounded-lg overflow-hidden justify-center">
          <TypographyP className="text-center text-xl font-medium absolute text-white">
            All Products
          </TypographyP>
        </Card>
        {categories.map((category) => (
          <Card
            key={category.id}
            className="flex cursor-pointer relative flex-col items-center h-24 !rounded-lg overflow-hidden justify-center"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover dark:brightness-[0.3] brightness-[0.4]"
            />
            <TypographyP className="text-center text-xl font-medium absolute text-white">
              {category.name}
            </TypographyP>
          </Card>
        ))}
      </div>
    </div>
  );
}
