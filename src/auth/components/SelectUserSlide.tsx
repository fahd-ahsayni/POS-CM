import Slider from "react-slick";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import UserCard from "./UserCard";
import { setSelectedUser } from "@/store/slices/data/usersSlice";

interface SelectUserSlideProps {
  userType: string;
}

const SelectUserSlide: React.FC<SelectUserSlideProps> = ({ userType }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<Slider | null>(null);
  const users = useSelector((state: RootState) => state.users.users);
  const searchQuery = useSelector(
    (state: RootState) => state.users.searchQuery
  );
  const dispatch = useDispatch();

  const currentUsers = useMemo(() => {
    return users?.[userType as keyof typeof users] || [];
  }, [users, userType]);

  const filteredUsers = useMemo(() => {
    return currentUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [currentUsers, searchQuery]);

  const duplicatedUsers = useMemo(() => {
    return filteredUsers.length === 2
      ? [...filteredUsers, ...filteredUsers]
      : filteredUsers;
  }, [filteredUsers]);

  useEffect(() => {
    if (sliderRef.current && duplicatedUsers.length > 1) {
      sliderRef.current.slickGoTo(activeSlide);
    }
  }, [activeSlide, duplicatedUsers]);

  useEffect(() => {
    if (duplicatedUsers.length > 0) {
      dispatch(setSelectedUser(duplicatedUsers[activeSlide]));
    }
  }, [duplicatedUsers, activeSlide, dispatch]);

  const settings = useMemo(
    () => ({
      className: "center",
      centerMode: true,
      infinite: duplicatedUsers.length > 1,
      centerPadding: "0px",
      slidesToShow: 3,
      speed: 300,
      focusOnSelect: true,
      afterChange: (current: number) => {
        setActiveSlide(current);
        dispatch(setSelectedUser(duplicatedUsers[current]));
      },
      arrows: true,
      nextArrow: <NextButton />,
      prevArrow: <PrevButton />,
    }),
    [duplicatedUsers, dispatch]
  );

  return (
    <div className="slider-container w-full custom-slider overflow-hidden mt-2 relative">
      <div className="h-full absolute right-0 top-0 bg-gradient-to-l from-gray-100 to-transparent w-[200px] z-10"></div>
      <div className="h-full absolute left-0 top-0 bg-gradient-to-r from-gray-100 to-transparent w-[200px] z-10"></div>
      <Slider {...settings} ref={sliderRef} className="py-8">
        {duplicatedUsers.map((user, index) => (
          <UserCard key={index} user={user} isActive={index === activeSlide} />
        ))}
      </Slider>
    </div>
  );
};

const NextButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-2 top-[calc(50%-20px)] -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
  >
    <ChevronRightIcon className="w-14 h-14 text-red-600" />
  </button>
);

const PrevButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-2 top-[calc(50%-20px)] -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
  >
    <ChevronLeftIcon className="w-14 h-14 text-red-600" />
  </button>
);

export default SelectUserSlide;
