import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { tabsConfig } from "./constants";
import { useLeftViewContext } from "./contexts/leftViewContext";

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
        {tabsConfig.map(({ value, component, className }) => (
          <TabsContent
            key={value}
            value={value}
            className={cn("w-full h-full", className)}
          >
            {component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
