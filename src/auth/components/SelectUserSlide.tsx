import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setSelectedUser } from "@/store/slices/data/usersSlice";
import UserCard from "./ui/UserCard";
import type { User } from "@/types";
import NavigationButton from "./ui/NavigationButton";
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

  const handleUserSelect = (user: User) => {
    dispatch(setSelectedUser(user));
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
    <div className="slider-container w-full custom-slider overflow-hidden mt-2 relative">
      <Swiper
        key={swiperKey}
        slidesPerView={3}
        centeredSlides={true}
        initialSlide={currentIndex !== -1 ? currentIndex : 0}
        spaceBetween={30}
        loop={processedUsers.length > 1}
        onSlideChange={handleSlideChange}
        className="mySwiper relative"
        watchSlidesProgress={true}
        updateOnWindowResize={true}
        observer={true}
        observeParents={true}
      >
        {processedUsers.map((user, index) => (
          <SwiperSlide
            key={`${user._id}-${index}-${userType}`}
            virtualIndex={index}
          >
            {({ isActive }) => (
              <UserCard
                user={user}
                isActive={user._id === selectedUser?._id}
                onClick={() => handleUserSelect(user)}
                className={
                  isActive
                    ? "scale-110 transition-transform"
                    : "scale-90 transition-transform"
                }
              />
            )}
          </SwiperSlide>
        ))}
        <div className="h-40 left-0 absolute w-24 bg-red-400" />
        <NavigationButton direction="prev" />
        <NavigationButton direction="next" />
      </Swiper>
    </div>
  );
};

export default SelectUserSlide;
