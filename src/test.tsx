import { RootState } from "@/store";
import { setSelectedUser } from "@/store/slices/data/usersSlice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import NavigationButton from "./ui/NavigationButton";
import UserCard from "./ui/UserCard";
import UserCardSkeleton from "./ui/UserCardSkelton";

export interface SelectUserSlideProps {
  userType: string;
}

const SelectUserSlide: React.FC<SelectUserSlideProps> = ({ userType }) => {
  const dispatch = useDispatch();
  const {
    users,
    loading: reduxLoading,
    error,
  } = useSelector((state: RootState) => state.users);
  const selectedUser = useSelector(
    (state: RootState) => state.users.selectedUser
  );
  const [swiperKey, setSwiperKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reduxLoading) {
      setLoading(true);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [reduxLoading]);

  const processedUsers = useMemo(() => {
    const originalUsers = users[userType as keyof typeof users] || [];
    if (originalUsers.length > 1 && originalUsers.length < 4) {
      return [...originalUsers, ...originalUsers];
    }
    return originalUsers;
  }, [users, userType]);

  const currentIndex = useMemo(
    () => processedUsers.findIndex((user) => user._id === selectedUser?._id),
    [processedUsers, selectedUser]
  );

  useEffect(() => {
    if (processedUsers.length > 0) {
      const centerIndex = Math.floor(processedUsers.length / 2);
      const centerUser = processedUsers[centerIndex];
      dispatch(setSelectedUser(centerUser));
      setSwiperKey((prev) => prev + 1);
    }
  }, [userType]);

  const handleSlideChange = (swiper: any) => {
    const realIndex = swiper.realIndex;
    const actualIndex =
      processedUsers.length > 3
        ? realIndex % (processedUsers.length / 2)
        : realIndex;

    const newSelectedUser = processedUsers[actualIndex];
    if (newSelectedUser?._id !== selectedUser?._id) {
      dispatch(setSelectedUser(newSelectedUser));
    }
  };

  if (loading) {
    return (
      <div className="slider-container w-full custom-slider overflow-hidden mt-2 relative">
        <div className="flex justify-center space-x-4">
          {[1, 2, 3].map((n) => (
            <UserCardSkeleton key={n} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-red-500">
        <p>Error loading users. Please try again later.</p>
      </div>
    );
  }

  if (processedUsers.length === 0) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        <p>No users available for this category.</p>
      </div>
    );
  }

  return (
    <div className="slider-container w-full custom-slider overflow-hidden mt-2 relative h-[600px]">
      <Swiper
        key={swiperKey}
        slidesPerView={5}
        centeredSlides={true}
        initialSlide={currentIndex !== -1 ? currentIndex : 0}
        spaceBetween={30}
        loop={processedUsers.length > 1}
        onSlideChange={handleSlideChange}
        className="mySwiper relative h-full [&_.swiper-slide]:flex [&_.swiper-slide]:justify-center [&_.swiper-slide]:items-center [&_.swiper-button-prev]:left-1/2 [&_.swiper-button-prev]:top-4 [&_.swiper-button-prev]:-translate-x-1/2 [&_.swiper-button-prev]:rotate-90 [&_.swiper-button-next]:left-1/2 [&_.swiper-button-next]:bottom-4 [&_.swiper-button-next]:top-auto [&_.swiper-button-next]:-translate-x-1/2 [&_.swiper-button-next]:rotate-90"
        watchSlidesProgress={true}
        updateOnWindowResize={true}
        observer={true}
        observeParents={true}
        direction="vertical"
      >
        {processedUsers.map((user, index) => (
          <SwiperSlide
            key={`${user._id}-${index}-${userType}`}
            virtualIndex={index}
          >
            {({ isActive, isNext, isPrev }) => (
              <UserCard
                user={user}
                isActive={user._id === selectedUser?._id}
                className={`
                  ${
                    isActive
                      ? "scale-100 pr-52"
                      : isNext || isPrev
                      ? "scale-90 pr-20  "
                      : "scale-[.6] -mr-20"
                  }
                  transition-transform
                `}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SelectUserSlide;
