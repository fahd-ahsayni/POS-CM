import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import UserCard from './UserCard';

interface SelectUserSlideProps {
  userType: string;
}

function SelectUserSlide({ userType }: SelectUserSlideProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const users = useSelector((state: RootState) => state.users.users);
  const searchQuery = useSelector((state: RootState) => state.users.searchQuery);
  
  // Get the correct user list based on userType and filter by search query
  const currentUsers = users[userType as keyof typeof users] || [];
  const filteredUsers = currentUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Duplicate the array if it has only two items
  const duplicatedUsers = filteredUsers.length === 2 ? [...filteredUsers, ...filteredUsers] : filteredUsers;

  const settings = {
    className: 'center',
    centerMode: true,
    infinite: duplicatedUsers.length > 1,
    centerPadding: '0px',
    slidesToShow: 3,
    speed: 500,
    focusOnSelect: true,
    beforeChange: (current: number, next: number) => {
      if (duplicatedUsers.length > 1) {
        setActiveSlide(next);
      }
    },
    arrows: true,
    nextArrow: <NextButton />,
    prevArrow: <PrevButton />,
  };
  return (
    <div className="slider-container w-full custom-slider overflow-hidden mt-2 relative">
      <div className="h-full absolute right-0 top-0 bg-gradient-to-l from-gray-100 to-transparent w-[200px] z-10"></div>
      <div className="h-full absolute left-0 top-0 bg-gradient-to-r from-gray-100 to-transparent w-[200px] z-10"></div>
      <Slider {...settings} className="py-8">
        {duplicatedUsers.map((user, index) => (
          <UserCard 
            key={user.id} 
            user={user} 
            isActive={duplicatedUsers.length === 1 || index === activeSlide}
          />
        ))}
      </Slider>
    </div>
  );
}

// Custom button components
const NextButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -right-2 top-[calc(50%-20px)] -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
  >
    <ChevronRightIcon className="w-14 h-14 text-red-500" />
  </button>
);

const PrevButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    onClick={onClick}
    className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
  >
    <ChevronLeftIcon className="w-14 h-14 text-red-500" />
  </button>
);

export default SelectUserSlide;
