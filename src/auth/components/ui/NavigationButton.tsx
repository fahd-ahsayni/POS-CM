import { useSwiper } from "swiper/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const NavigationButton = ({ direction }: { direction: "prev" | "next" }) => {
  const swiper = useSwiper();

  return (
    <button
      onClick={() =>
        direction === "prev" ? swiper.slidePrev() : swiper.slideNext()
      }
      className={`absolute z-10 top-[calc(50%-20px)] -translate-y-1/2 
          ${direction === "prev" ? "-left-3 justify-start bg-gradient-to-r from-secondary-white to-transparent" : "-right-3 justify-end bg-gradient-to-l from-secondary-white to-transparent"}
          flex items-center h-full w-1/5`}
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
