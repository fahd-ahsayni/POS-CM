import { logoLightMode } from "@/assets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppDispatch, RootState } from "@/store";
import {
  checkOpenDay,
  openDay,
} from "@/store/slices/authentication/openDaySlice";
import { fetchPosData } from "@/store/slices/data/posSlice";
import { User } from "@/types";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserCard from "./components/UserCard";

export default function SelectPosPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isDayOpen = useSelector((state: RootState) => state.dayStatus.isOpen);
  /* loading, error, data */
  const { data, loading, error } = useSelector((state: RootState) => state.pos);

  // Retrieve user from localStorage
  const userAuthenticated: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  console.log(userAuthenticated);

  // State for button disabled status
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleOpenDay = () => {
    setButtonDisabled(true); // Disable button immediately
    dispatch(openDay());
  };

  useEffect(() => {
    dispatch(checkOpenDay());
    setButtonDisabled(isDayOpen ?? false);
  }, [dispatch, isDayOpen]);

  useEffect(() => {
    dispatch(fetchPosData());
  }, [dispatch]);

  const handleChoisePos = (id: string) => {
    localStorage.setItem("posId", id);
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-3/12 h-full bg-gray-100">
        <div className="relative z-10 flex h-16 flex-shrink-0">
          <div className="flex flex-1 justify-between px-4 sm:px-6">
            <img src={logoLightMode} alt="logo" className="w-24 h-auto" />
          </div>
        </div>
        <div className="h-full flex items-center justify-center flex-col">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {userAuthenticated && (
              <UserCard
                withRole={true}
                user={userAuthenticated as User}
                isActive={true}
                className="scale-105"
              />
            )}
          </motion.div>
          <div className="mt-10">
            <Button to="/login">Change Account</Button>
          </div>
        </div>
      </div>
      <motion.div className="w-9/12 h-full bg-gray-100">
        <motion.div
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-zinc-950 flex flex-col items-start justify-center h-full w-full py-6 px-10"
        >
          <div className="flex justify-between items-start w-full">
            <div>
              <h2 className="tracking-tight scroll-m-20 text-3xl font-semibold text-white">
                Select your POS station
              </h2>
              <p className="mt-1 text-sm text-zinc-300">
                Choose your active POS to continue selling.
              </p>
            </div>
            <Button onClick={handleOpenDay} disabled={buttonDisabled}>
              Open new Day
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-10 w-11/12">
            {data.map((pos) => (
              <motion.div
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                key={pos._id}
                onClick={() => handleChoisePos(pos._id)}
              >
                <Card className="w-full cursor-pointer bg-zinc-800/60 rounded-lg py-4 px-6">
                  <div className="flex justify-between items-center">
                    <h2 className="tracking-tight scroll-m-20 text-2xl font-medium text-white">
                      {pos.name}
                    </h2>
                    <ChevronRight className="w-7 h-7 text-white" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
