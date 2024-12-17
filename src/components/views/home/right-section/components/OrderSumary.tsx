import { logoWithoutText } from "@/assets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TypographyP } from "@/components/ui/typography";
import { LucideMaximize, User } from "lucide-react";

export default function ProceedOrder() {
  return (
    <div className="flex flex-col h-full gap-y-2 py-4">
      <div className="flex items-center justify-between">
        <div>
          <TypographyP className="text-sm">
            <span className="font-medium">Table 18</span>{" "}
            <span className="text-muted-foreground">{"(dining Area)"}</span>
          </TypographyP>
        </div>
        <TypographyP className="text-sm">
          <span>Order ref</span>{" "}
          <span className="text-muted-foreground">01-1423-26</span>
        </TypographyP>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <TypographyP className="text-sm font-medium">
            Order at once
          </TypographyP>
          <Switch
            id="switch-02"
            className="h-5 w-8 [&_span]:size-4 [&_span]:data-[state=checked]:translate-x-3 rtl:[&_span]:data-[state=checked]:-translate-x-3"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon">
            <LucideMaximize size={16} />
            <span className="sr-only">Full screen</span>
          </Button>
          <Button size="icon">
            <LucideMaximize size={16} />
            <span className="sr-only">Full screen</span>
          </Button>
          <Button size="icon">
            <LucideMaximize size={16} />
            <span className="sr-only">Full screen</span>
          </Button>
          <Button size="icon">
            <LucideMaximize size={16} />
            <span className="sr-only">Full screen</span>
          </Button>
        </div>
      </div>
      <div className="pt-2">
        <Card className="py-2 rounded-md flex items-center gap-2 justify-center">
          <User size={16} />
          <TypographyP className="text-sm font-medium">Customer</TypographyP>
        </Card>
      </div>
      <div className="flex-1 border border-dashed flex-grow relative flex items-center justify-center">
        <img
          src={logoWithoutText}
          alt="Order Sumary"
          className="w-1/2 h-auto object-contain absolute opacity-75"
        />
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Button className="flex-1">Hold Order</Button>
        <Button className="flex-1">Proceed Order</Button>
        <Button size="icon" variant="outline">
          <LucideMaximize size={16} />
          <span className="sr-only">Full screen</span>
        </Button>
      </div>
    </div>
  );
}
