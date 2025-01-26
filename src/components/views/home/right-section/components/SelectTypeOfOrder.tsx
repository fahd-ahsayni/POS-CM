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
import { OrderCard } from "../ui/OrderTypeCards";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { loadingColors } from "@/preferences/index";

function SelectTypeOfOrder() {
  const {
    state: { selectedType, displayedTypes, isLoading },
    actions: { handleOrderTypeSelect, handleBack },
  } = useSelectOrderType();

  const dispatch = useDispatch();

  const handleTypeSelect = (type: OrderType) => (event: React.MouseEvent) => {
    event.preventDefault();
    const shiftId = localStorage.getItem("shiftId");

    if (!shiftId) {
      toast.error("No active shift found");
      return;
    }

    handleOrderTypeSelect(type);
    dispatch(updateOrder({ shift_id: shiftId }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <BeatLoader color={loadingColors.secondary} size={10} />
      </div>
    );
  }

  if (!displayedTypes.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No order types available</p>
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
      <div
        className={cn(
          "flex-1 flex h-full py-32 items-center justify-center relative",
          displayedTypes.length > 3 ? "pr-8 pl-3" : "px-4"
        )}
      >
        {displayedTypes.length > 3 ? (
          <Swiper
            direction="vertical"
            slidesPerView={3}
            spaceBetween={16}
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
