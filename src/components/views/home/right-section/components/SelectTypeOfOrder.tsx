import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { ChevronLeftIcon } from "lucide-react";
import { memo } from "react";
import { useSelectOrderType } from "../hooks/useSelectOrderType";
import { OrderCard, OrderCardSkeleton } from "../ui/OrderTypeCards";
import { OrderType } from "@/types/order.types";

function SelectTypeOfOrder() {
  const {
    state: { selectedType, displayedTypes, isLoading },
    actions: { handleOrderTypeSelect, handleBack },
  } = useSelectOrderType();

  const handleTypeSelect = (type: OrderType) => (event: React.MouseEvent) => {
    event.preventDefault();
    handleOrderTypeSelect(type);
  };

  return (
    <div className="flex flex-col h-full pb-7">
      <div className="flex items-center gap-x-2">
        {selectedType && (
          <Button variant="secondary" size="icon" onClick={handleBack}>
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
        )}
        <TypographyH3 className="font-medium text-balance max-w-lg">
          {selectedType
            ? selectedType.name
            : "What type of order would you like to process?"}
        </TypographyH3>
      </div>
      <div className="flex-1 flex h-full items-center justify-center overflow-hidden relative mt-20">
        <div className="absolute top-0 left-0 w-[calc(100%-0.5rem)] h-6 bg-gradient-to-b from-background to-transparent" />
        <div className="w-full space-y-6 pb-12 pt-5 pr-3 h-full overflow-y-auto">
          {isLoading ? (
            <OrderCardSkeleton />
          ) : (
            <>
              {displayedTypes.map((type) => (
                <OrderCard
                  key={type._id}
                  orderType={type}
                  onSelect={handleTypeSelect(type)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SelectTypeOfOrder);
