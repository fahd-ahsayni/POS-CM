import { memo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { tabsConfig } from "./constants";
import { useRightViewContext } from "./contexts/RightViewContext";

const RightSection = () => {
  const { views } = useRightViewContext();

  return (
    <div className="w-full h-full mt-3 pr-2 sm:pr-3">
      <Tabs value={views} className="w-full h-full flex">
        {tabsConfig.map(({ value, component, className = "" }) => (
          <TabsContent
            key={value}
            value={value}
            className={cn("w-full h-[calc(100%-35px)]", className)}
          >
            {component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default memo(RightSection);
