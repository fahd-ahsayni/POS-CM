import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { TABLES_PLAN_VIEW, tabsConfig } from "./constants";
import { useLeftViewContext } from "./contexts/LeftViewContext";

export default function LeftSection() {
  const { views } = useLeftViewContext();

  return (
    <div className="w-full h-full mt-4 pt-2.5">
      {views !== TABLES_PLAN_VIEW && (
        <div className="flex items-center justify-between relative flex-shrink-0">
          <TypographyP className="absolute pr-4 bg-zinc-900 text-white font-medium text-sm">
            Categories
          </TypographyP>
          <Separator className="bg-white/5" />
        </div>
      )}
      <Tabs value={views} className="w-full h-full flex">
        {tabsConfig.map(({ value, component, className }) => (
          <TabsContent
            key={value}
            value={value}
            className={cn(
              "w-full h-[calc(100%-35px)] overflow-hidden relative",
              className
            )}
          >
            {component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
