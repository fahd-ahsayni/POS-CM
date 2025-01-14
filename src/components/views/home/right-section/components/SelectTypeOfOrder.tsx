import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { ChevronLeftIcon } from "lucide-react";
import { memo } from "react";
import { useSelectOrderType } from "../hooks/useSelectOrderType";
import { OrderCard, OrderCardSkeleton } from "../ui/OrderTypeCards";
import { OrderType } from "@/types/order.types";

function SelectTypeOfOrder() {
  const {
    state: { selectedType, displayedTypes, isLoading, categories },
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
            <>
              {displayedTypes.map((type) => (
                <OrderCard
                  key={type._id}
                  orderType={type}
                  onSelect={handleTypeSelect(type)}
                  isSelected={selectedType?._id === type._id}
                />
              ))}
              
              {categories.length > 0 && (
                <div className="mt-6">
                  <TypographyH3>Categories</TypographyH3>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {categories.map((category) => (
                      <div
                        key={category._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SelectTypeOfOrder);
