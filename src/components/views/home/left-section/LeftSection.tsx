import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { TABLES_PLAN_VIEW, tabsConfig } from "./constants";
import { useLeftViewContext } from "./contexts/LeftViewContext";
import { memo } from "react";

const LeftSection = memo(function LeftSection() {
  const { views } = useLeftViewContext();

  return (
    <div className="flex flex-col h-full w-full pt-2.5">
      {views !== TABLES_PLAN_VIEW && (
        <div className="flex items-center justify-between relative flex-shrink-0 mb-4">
          <TypographyP className="absolute pr-4 bg-zinc-900 text-white font-medium text-sm">
            Categories
          </TypographyP>
          <Separator className="bg-white/5" />
        </div>
      )}
      <Tabs value={views} className="flex-1 flex flex-col overflow-hidden">
        {tabsConfig.map(({ value, component, className }) => (
          <TabsContent
            key={value}
            value={value}
            className={cn(
              "flex-1 overflow-hidden",
              className
            )}
          >
            {component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
});

export default LeftSection;
