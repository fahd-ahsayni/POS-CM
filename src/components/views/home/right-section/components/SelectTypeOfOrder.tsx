import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { updateOrder } from "@/functions/updateOrder";
import { cn } from "@/lib/utils";
import { OrderType } from "@/types/order.types";
import { ChevronLeftIcon } from "lucide-react";
import { memo } from "react";
import { useDispatch } from "react-redux";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelectOrderType } from "../hooks/useSelectOrderType";
import { OrderCard, OrderCardSkeleton } from "../ui/OrderTypeCards";

function SelectTypeOfOrder() {
  const {
    state: { selectedType, displayedTypes, isLoading },
    actions: { handleOrderTypeSelect, handleBack },
  } = useSelectOrderType();

  const dispatch = useDispatch();

  const handleTypeSelect = (type: OrderType) => (event: React.MouseEvent) => {
    event.preventDefault();
    const shiftId = localStorage.getItem("shiftId") || "";
    handleOrderTypeSelect(type);
    dispatch(updateOrder({ shift_id: shiftId }));
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
      <div
        className={cn(
          "flex-1 flex h-full py-32 items-center justify-center relative pr-8",
          displayedTypes.length > 3 ? "pl-3" : ""
        )}
      >
        {isLoading ? (
          <OrderCardSkeleton />
        ) : displayedTypes.length > 3 ? (
          <Swiper
            direction="vertical"
            slidesPerView={3}
            className="w-full h-full products-swiper"
            modules={[Pagination]}
            pagination={{
              clickable: true,
              type: "bullets",
            }}
          >
            {displayedTypes.map((type) => (
              <SwiperSlide key={type._id} className="pl-5">
                <OrderCard orderType={type} onSelect={handleTypeSelect(type)} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {displayedTypes.map((type) => (
              <OrderCard
                key={type._id}
                orderType={type}
                onSelect={handleTypeSelect(type)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(SelectTypeOfOrder);
