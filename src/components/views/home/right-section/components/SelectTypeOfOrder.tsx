import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TypographyH3 } from "@/components/ui/typography";
import { updateOrder } from "@/functions/updateOrder";
import { OrderType } from "@/interfaces/order";
import { cn } from "@/lib/utils";
import { loadingColors } from "@/preferences/index";
import { ChevronLeftIcon } from "lucide-react";
import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useSelectOrderType } from "../hooks/useSelectOrderType";
import { OrderCard } from "../ui/OrderTypeCards";

function SelectTypeOfOrder() {
  const {
    state: { selectedType, displayedTypes, isLoading },
    actions: { handleOrderTypeSelect, handleBack },
  } = useSelectOrderType();

  const generalData = JSON.parse(localStorage.getItem("generalData") || "{}");
  const orderTypesFromLocalStorage = generalData["orderTypes"] || [];
  const typesToDisplay =
    displayedTypes?.length > 0 ? displayedTypes : orderTypesFromLocalStorage;

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      displayedTypes.length === 1 &&
      (!displayedTypes[0].children ||
        displayedTypes[0].children.length === 0) &&
      !selectedType
    ) {
      const shiftId = localStorage.getItem("shiftId");
      if (!shiftId) {
        toast.error(createToast("Error", "No active shift found", "error"));
        return;
      }
      const singleType = displayedTypes[0];
      handleOrderTypeSelect(singleType);
      dispatch(updateOrder({ shift_id: shiftId }));
    }
  }, [displayedTypes, selectedType, handleOrderTypeSelect, dispatch]);

  const handleTypeSelect = (type: OrderType) => (event: React.MouseEvent) => {
    event.preventDefault();
    const shiftId = localStorage.getItem("shiftId");
    if (!shiftId) {
      toast.error(createToast("Error", "No active shift found", "error"));
      return;
    }
    handleOrderTypeSelect(type);
    dispatch(updateOrder({ shift_id: shiftId }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <BeatLoader color={loadingColors.secondary} size={10} />
      </div>
    );
  }

  if (!isLoading && (!typesToDisplay || typesToDisplay.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-lg text-muted-foreground">
          No order types available
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

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
      <div className={cn("h-full flex items-center justify-center relative")}>
        <Carousel
          opts={{ align: "start" }}
          orientation="vertical"
          className="w-full"
        >
          <CarouselContent className="-mt-1 h-[350px]">
            {typesToDisplay.map((type: OrderType) => (
              <CarouselItem key={type._id} className="pt-2 basis-1/3">
                <OrderCard orderType={type} onSelect={handleTypeSelect(type)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-primary-red text-white hover:bg-primary-red hover:text-white" />
          <CarouselNext className="bg-primary-red text-white hover:bg-primary-red hover:text-white" />
        </Carousel>
      </div>
    </div>
  );
}

export default memo(SelectTypeOfOrder);
