import { RootState } from "@/store";
import { setSelectedUser } from "@/store/slices/data/users.slice";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import NavigationButton from "./ui/NavigationButton";
import UserCard from "./ui/UserCard";
import UserCardSkeleton from "./ui/UserCardSkelton";
import { User } from "@/types/user.types";

export interface SelectUserSlideProps {
  userType: string;
}

const SelectUserSlide: React.FC<SelectUserSlideProps> = ({ userType }) => {
  const dispatch = useDispatch();
  const { users, loading: reduxLoading } = useSelector(
    (state: RootState) => state.users
  );
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

  const initialSlideIndex = useMemo(() => {
    if (!selectedUser || processedUsers.length === 0) return 0;
    const index = processedUsers.findIndex(
      (user) => user._id === selectedUser._id
    );
    return index >= 0 ? index : 0;
  }, [processedUsers, selectedUser]);

  const swiperConfig = useMemo(
    () => ({
      slidesPerView: 3,
      centeredSlides: true,
      initialSlide: initialSlideIndex,
      spaceBetween: 30,
      loop: processedUsers.length > 1,
      watchSlidesProgress: true,
      updateOnWindowResize: true,
      observer: true,
      observeParents: true,
    }),
    [initialSlideIndex, processedUsers.length]
  );

  useEffect(() => {
    if (processedUsers.length > 0) {
      dispatch(setSelectedUser(processedUsers[0]));
      setSwiperKey((prev) => prev + 1);
    }
  }, [userType, processedUsers, dispatch]);

  const handleSlideChange = (swiper: any) => {
    const realIndex = swiper.realIndex;
    const newSelectedUser = processedUsers[realIndex];

    if (
      newSelectedUser &&
      (!selectedUser || newSelectedUser._id !== selectedUser._id)
    ) {
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

  if (false) {
    return (
      <div className="w-full text-center text-primary-red h-[300px] flex items-center justify-center">
        <div
          className="bg-red-100/50 border w-full border-primary-red text-primary-red px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-semibold pr-2">Error!</strong>
          <span className="block text-sm sm:inline">
            No users available. Please contact support.
          </span>
        </div>
      </div>
    );
  }

  if (processedUsers.length === 0) {
    return (
      <div className="w-full text-center text-primary-red h-[300px] flex items-center justify-center">
        <div
          className="bg-red-100/30 border w-full border-primary-red text-primary-red px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-semibold pr-2">No users available</strong>
          <span className="block text-sm sm:inline">
            Please contact support.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="slider-container w-full custom-slider overflow-hidden mt-2 relative h-[300px]">
      {loading ? (
        <div className="flex justify-center space-x-4">
          {[1, 2, 3].map((n) => (
            <UserCardSkeleton key={n} />
          ))}
        </div>
      ) : (
        <Swiper
          key={swiperKey}
          {...swiperConfig}
          onSlideChange={handleSlideChange}
          className="mySwiper relative"
        >
          {processedUsers.map((user: User, index: number) => (
            <SwiperSlide
              key={`${user._id}-${index}-${userType}`}
              virtualIndex={index}
            >
              {({ isActive }) => (
                <UserCard
                  user={user}
                  isActive={user._id === selectedUser?._id}
                  className={isActive ? "scale-110" : "scale-90"}
                />
              )}
            </SwiperSlide>
          ))}
          {processedUsers.length > 3 && (
            <>
              <NavigationButton direction="prev" />
              <NavigationButton direction="next" />
            </>
          )}
        </Swiper>
      )}
    </div>
  );
};

export default SelectUserSlide;
