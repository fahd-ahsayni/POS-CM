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

  if (error) {
    return (
      <div className="w-full p-4 text-center text-primary-red">
        <p>Error loading users. Please try again later.</p>
      </div>
    );
  }

  if (processedUsers.length === 0) {
    return (
      <div className="w-full p-4 text-center text-primary-black">
        <p>No users available</p>
      </div>
    );
  }

  console.log(selectedUser);

  return (
    <div className="slider-container w-full custom-slider overflow-hidden mt-2 relative">
      {loading ? (
        <div className="flex justify-center space-x-4">
          {[1, 2, 3].map((n) => (
            <UserCardSkeleton key={n} />
          ))}
        </div>
      ) : processedUsers.length === 0 ? (
        <div className="w-full p-4 text-center text-primary-black">
          <p>No users available</p>
        </div>
      ) : (
        <Swiper
          key={swiperKey}
          {...swiperConfig}
          onSlideChange={handleSlideChange}
          className="mySwiper relative"
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
