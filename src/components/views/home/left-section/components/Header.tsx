import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { toTitleCase } from "@/functions/string-transforms";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useCallback } from "react";
import { ALL_CATEGORIES_VIEW } from "../constants";
import { useLeftViewContext } from "../contexts/LeftViewContext";

export default function Header() {
  const baseUrl = localStorage.getItem("ipAddress") || window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;

  const { setViews, category, setCategory, setSubCategory, setBreadcrumbs } =
    useLeftViewContext();

  const handleBack = useCallback(() => {
    setViews(ALL_CATEGORIES_VIEW);
    setCategory(null);
    setSubCategory(null);
    setBreadcrumbs([]);
  }, [setViews, setCategory, setSubCategory, setBreadcrumbs]);

  return (
    <div className="flex items-start relative justify-start w-full py-2 mt-2 gap-x-2">
      <div
        onClick={handleBack}
        className="flex items-center justify-center w-12 h-14 bg-primary-red rounded-lg cursor-pointer"
      >
        <ArrowLeft className="text-white" />
      </div>
      <div className="h-14 w-[230px]">
        <Card className="flex overflow-hidden relative cursor-pointer flex-col items-center h-full w-full justify-center border-2 !border-primary-red bg-secondary-black">
          {category && (
            <img
              src={`${baseUrl}${category.image}`}
              className="absolute w-full h-full object-cover brightness-[0.5]"
              alt={category.name}
              crossOrigin="anonymous"
            />
          )}
          <TypographyP
            className={cn(
              "text-center relative font-semibold line-clamp-2 text-white",
              category && "text-white"
            )}
          >
            {category ? toTitleCase(category.name.toLowerCase()) : "All Items"}
          </TypographyP>
        </Card>
      </div>
    </div>
  );
}
