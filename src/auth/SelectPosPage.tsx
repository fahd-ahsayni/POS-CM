import { logoLightMode } from "@/assets";
import { motion } from "framer-motion";
import UserCard from "./components/UserCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const posData = [
  {
    id: 1,
    name: "Terrace POS 1",
    manager: "John Doe",
    shiftOpened: "July 24, 2024 - 10:00 AM",
    printerStatus: "connected",
  },
  {
    id: 2,
    name: "Indoor POS 2",
    manager: "Jane Smith",
    shiftOpened: "July 24, 2024 - 09:30 AM",
    printerStatus: "disconnected",
  },
  {
    id: 3,
    name: "Bar POS 3",
    manager: "Mike Johnson",
    shiftOpened: "July 24, 2024 - 11:00 AM",
    printerStatus: "disconnected",
  },
];

export default function SelectPosPage() {
  const navigate = useNavigate();
  const userAuthenticated = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/5 h-full bg-gray-100">
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
                user={userAuthenticated}
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
      <motion.div className="w-4/5 h-full bg-gray-100">
        <motion.div
          initial={{ x: 200 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-zinc-950 flex flex-col items-start justify-center h-full w-full py-6 px-10"
        >
          <div>
            <h2 className="tracking-tight scroll-m-20 text-3xl font-semibold text-white">
              Select your POS station
            </h2>
            <p className="mt-1 text-sm text-zinc-300">
              Choose your active POS to continue selling.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-10 w-11/12">
            {posData.map((pos) => (
              <motion.div
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                key={pos.id}
                onClick={() => navigate("/")}
              >
                <Card
                  className={`w-full cursor-pointer bg-zinc-800/60 rounded-lg py-4 px-6 ${
                    pos.printerStatus === "connected"
                      ? "shadow-xl shadow-red-600/20 z-10 relative"
                      : ""
                  }`}
                >
                  <h2 className="tracking-tight scroll-m-20 text-2xl font-medium text-white">
                    {pos.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-100">
                    <span className="pr-2">Manager:</span>
                    <span className="font-semibold">{pos.manager}</span>
                  </p>
                  <p className="mt-1 text-sm text-zinc-100">
                    <span className="pr-2">Shift opened:</span>
                    <span className="font-semibold">{pos.shiftOpened}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-6">
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                          pos.printerStatus === "connected"
                            ? "bg-green-500"
                            : "bg-red-600"
                        } opacity-75`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          pos.printerStatus === "connected"
                            ? "bg-green-500"
                            : "bg-red-600"
                        }`}
                      ></span>
                    </span>
                    <p className="text-sm text-white/80">
                      Printer: {pos.printerStatus}
                    </p>
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
