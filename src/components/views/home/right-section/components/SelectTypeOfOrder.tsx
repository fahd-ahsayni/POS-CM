import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { ChevronLeftIcon } from "lucide-react";
import { memo } from "react";
import { useSelectOrderType } from "../hooks/useSelectOrderType";
import { OrderCard, OrderCardSkeleton } from "../ui/OrderTypeCards";
import { OrderType } from "@/types/order.types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";

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
      <div className="flex-1 flex h-ful items-center justify-center relative pr-8">
        {isLoading ? (
          <OrderCardSkeleton />
        ) : displayedTypes.length > 3 ? (
          <Swiper
            direction="vertical"
            slidesPerView={3}
            spaceBetween={16}
            className="w-full h-[80%] pr-3 products-swiper"
            modules={[Pagination]}
            pagination={{
              clickable: true,
              type: "bullets",
            }}
          >
            {displayedTypes.map((type) => (
              <SwiperSlide key={type._id} className="pl-6">
                <OrderCard orderType={type} onSelect={handleTypeSelect(type)} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="flex flex-col gap-4 w-full pl-6">
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
