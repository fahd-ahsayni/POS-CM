import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { ChevronLeftIcon } from "lucide-react";
import { memo } from "react";
import { useSelectOrderType } from "../hooks/useSelectOrderType";
import { OrderCard, OrderCardSkeleton } from "../ui/OrderTypeCards";

function SelectTypeOfOrder() {
  const {
    state: { selectedType, displayedTypes, isLoading },
    actions: { handleOrderTypeSelect, handleBack },
  } = useSelectOrderType();

  return (
    <div className="flex flex-col h-full pb-7">
      <div className="flex items-center gap-x-2">
        {selectedType && (
          <Button variant="secondary" size="icon" onClick={handleBack}>
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
        )}
        <TypographyH3 className="font-medium">
          {selectedType
            ? selectedType.name
            : "What type of order would you like to process?"}
        </TypographyH3>
      </div>
      <div className="flex-1 flex h-full items-center justify-center overflow-hidden relative mt-20">
        <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background to-transparent" />
        <div className="w-full space-y-6 pb-12 pt-12 h-full overflow-y-auto">
          {isLoading ? (
            <OrderCardSkeleton />
          ) : (
            displayedTypes.map((type) => (
              <OrderCard
                key={type._id}
                orderType={type}
                onSelect={handleOrderTypeSelect}
                isSelected={selectedType?._id === type._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SelectTypeOfOrder);
