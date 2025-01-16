import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { OrderType } from "@/types/order.types";
import { ChevronRightIcon } from "lucide-react";
import { memo } from "react";
import { TypeOfOrderDescription, TypeOfOrderIcon } from "./TypeOfOrderIcon";

export const OrderCardSkeleton = () => (
  <Card className="w-full rounded-lg h-24 px-8 py-4 dark:!bg-secondary-black bg-white flex space-x-4 items-center justify-between">
    <div className="flex items-center gap-x-4 w-full">
      <Skeleton className="h-7 w-7 rounded-full bg-neutral-dark-grey/30" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-24 bg-neutral-dark-grey/30" />
        <Skeleton className="h-4 w-40 bg-neutral-dark-grey/30" />
      </div>
    </div>
  </Card>
);

export const OrderCard = memo(
  ({
    orderType,
    onSelect,
    fixedLightDark,
  }: {
    orderType: OrderType;
    onSelect: (event: React.MouseEvent) => void;
    fixedLightDark?: boolean;
  }) => {
    const iconType = orderType?.type?.toLowerCase();
    const isDeliveryChild = orderType?.parent_id && iconType === "delivery";
    const showDescription = !orderType?.parent_id;

    return (
      <Card
        className={cn(
          "w-full rounded-md h-24 px-8 py-4 flex space-x-4 items-center justify-between cursor-pointer",
          fixedLightDark
            ? "bg-neutral-bright-grey dark:bg-primary-black"
            : "bg-white dark:bg-secondary-black" 
        )}
        onClick={onSelect}
      >
        <div className="flex items-center gap-x-4">
          {orderType.image || isDeliveryChild ? (
            <img
              src={orderType.image || "/path/to/delivery-image.png"}
              alt={orderType.name}
              className="w-7 h-7"
            />
          ) : (
            <TypeOfOrderIcon type={iconType || ""} />
          )}
          <div>
            <TypographyP className="font-medium text-lg">
              {orderType.name}
            </TypographyP>
            {showDescription && (
              <TypographySmall className="text-xs text-neutral-dark-grey pt-0.5 tracking-tight">
                {TypeOfOrderDescription({ type: iconType || "" })}
              </TypographySmall>
            )}
          </div>
        </div>
        <ChevronRightIcon className="w-6 h-6 text-primary-black/50 dark:text-white/50" />
      </Card>
    );
  }
);

OrderCard.displayName = "OrderCard";
