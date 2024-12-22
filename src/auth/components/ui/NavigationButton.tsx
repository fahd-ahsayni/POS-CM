import { useSwiper } from "swiper/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const NavigationButton = ({ direction }: { direction: "prev" | "next" }) => {
  const swiper = useSwiper();

  return (
    <button
      onClick={() =>
        direction === "prev" ? swiper.slidePrev() : swiper.slideNext()
      }
      className={`absolute z-10 top-1/2 -translate-y-1/2 
          ${direction === "prev" ? "left-2" : "right-2"}
          flex items-center justify-center`}
    >
      {direction === "prev" ? (
        <ChevronLeftIcon className="w-10 h-10 text-primary-red" />
      ) : (
        <ChevronRightIcon className="w-10 h-10 text-primary-red" />
      )}
    </button>
  );
};

export default NavigationButton;
