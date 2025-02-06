import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSelectedUser } from "@/store/slices/data/users.slice";

export const useUserSlider = (userType: string) => {
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

  // Handle loading state with delay
  useEffect(() => {
    if (reduxLoading) {
      setLoading(true);
    } else {
      const timer = setTimeout(() => setLoading(false), 700);
      return () => clearTimeout(timer);
    }
  }, [reduxLoading]);

  // Process users array
  const processedUsers = useMemo(() => {
    const originalUsers = users[userType as keyof typeof users] || [];
    if (originalUsers.length > 1 && originalUsers.length < 4) {
      return [...originalUsers, ...originalUsers];
    }
    return originalUsers;
  }, [users, userType]);

  // Calculate initial slide index
  const initialSlideIndex = useMemo(() => {
    if (!selectedUser || processedUsers.length === 0) return 0;
    const index = processedUsers.findIndex(
      (user) => user._id === selectedUser._id
    );
    return index >= 0 ? index : 0;
  }, [processedUsers, selectedUser]);

  // Swiper configuration
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

  // Set initial selected user
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

  return {
    loading,
    error,
    processedUsers,
    selectedUser,
    swiperKey,
    swiperConfig,
    handleSlideChange,
  };
};
