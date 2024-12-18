import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRightViewContext } from "./contexts/rightViewContext";
import { cn } from "@/lib/utils";
import { tabsConfig } from "./constants";

export default function RightSection() {
  const { views } = useRightViewContext();

  return (
    <div className="w-full h-full mt-3 px-2 sm:px-3">
      <Tabs value={views} className="w-full h-full flex">
        {tabsConfig.map(({ value, component, className = "" }) => (
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
