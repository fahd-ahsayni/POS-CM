import { TypographyP } from "@/components/ui/typography";
import { useEffect } from "react";
import { useLeftViewContext } from "../contexts/leftViewContext";
import Header from "./Headre";

export default function ProductsByCategory() {
  const { category } = useLeftViewContext();

  useEffect(() => {
    console.log(category?.children);
  }, [category]);
  return (
    <div className="w-full h-full">
      <Header />
      {(category?.children?.length ?? 0) > 0 && (
        <div>
          <div className="flex items-center justify-between relative flex-shrink-0 mt-4 w-full">
            <TypographyP className="absolute pr-4 bg-background font-medium">
              Sub Categories
            </TypographyP>
            <div className="w-full h-px dark:bg-zinc-800/60 bg-zinc-50/70" />
          </div>
          <div className="mt-4">
            {category?.children.map((subCategory) => (
              <div key={subCategory._id}>{subCategory.name}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
