import { ReactNode } from "react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Grid, Mousewheel, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface CustomSwiperProps {
  children: ReactNode[];
  direction?: "horizontal" | "vertical";
  slidesPerView?: number;
  spaceBetween?: number;
  grid?: {
    rows: number;
    fill: "row" | "column";
  };
  showPagination?: boolean;
  showNavigation?: boolean;
  mousewheel?: boolean;
  className?: string;
  modules?: (
    | typeof Grid
    | typeof Mousewheel
    | typeof Navigation
    | typeof Pagination
  )[];
  onInit?: (swiper: any) => void;
  onSlideChange?: (swiper: any) => void;
}

export default function CustomSwiper({
  children,
  direction = "horizontal",
  slidesPerView = 1,
  spaceBetween = 0,
  grid,
  showPagination = false,
  showNavigation = false,
  mousewheel = false,
  className = "",
  modules = [],
  onInit,
  onSlideChange,
}: CustomSwiperProps) {
  const defaultModules = [
    ...(grid ? [Grid] : []),
    ...(mousewheel ? [Mousewheel] : []),
    ...(showPagination ? [Pagination] : []),
    ...(showNavigation ? [Navigation] : []),
    ...modules,
  ];

  const paginationConfig = showPagination
    ? {
        clickable: true,
        renderBullet: function (index: number, className: string) {
          return `<span class="${className}" data-index="${index}"></span>`;
        },
      }
    : false;

  return (
    <Swiper
      direction={direction}
      slidesPerView={slidesPerView}
      grid={grid}
      mousewheel={mousewheel}
      spaceBetween={spaceBetween}
      pagination={paginationConfig}
      modules={defaultModules}
      className={className}
      onInit={onInit}
      onSlideChange={onSlideChange}
    >
      {children.map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}
