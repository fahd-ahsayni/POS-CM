import { logoLightMode } from "@/assets";
import { RiRfidFill } from "react-icons/ri";
import { useState, useEffect, useCallback } from "react";
import SegmentedControl from "./SegmentedControl";
import SelectUserSlide from "./SelectUserSlide";
import ShineBorder from "@/components/ui/shine-border";
import { useDispatch, useSelector } from "react-redux";
import { loginWithRfid } from "@/store/slices/authentication/authSlice";
import type { AppDispatch, RootState } from "@/store";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Tilt from "react-parallax-tilt";

export default function SelectUser() {
  const [activeTab, setActiveTab] = useState("cashiers");
  const [rfidInput, setRfidInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get loading and error states from Redux
  const { loading } = useSelector((state: RootState) => state.auth);

  // Reset RFID input buffer
  const resetRfidBuffer = useCallback(() => {
    setRfidInput("");
    setIsScanning(false);
  }, []);

  // Handle successful RFID scan
  const handleRfidSubmit = useCallback(
    async (rfid: string) => {
      if (rfid.length < 8) {
        // Adjust minimum length based on your RFID format
        console.error("Invalid RFID length");
        resetRfidBuffer();
        return;
      }

      try {
        setIsScanning(true);
        const result = await dispatch(loginWithRfid(rfid)).unwrap();
        if (result) {
          navigate("/select-pos");
        }
      } catch (err) {
        console.error("RFID login failed:", err);
      } finally {
        resetRfidBuffer();
      }
    },
    [dispatch, navigate, resetRfidBuffer]
  );

  useEffect(() => {
    let rfidTimeout: NodeJS.Timeout;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Only accept numeric and alphanumeric input
      if (/^[a-zA-Z0-9]$/.test(e.key)) {
        setIsScanning(true);
        setRfidInput((prev) => prev + e.key);

        // Reset timeout on each keypress
        clearTimeout(rfidTimeout);
        rfidTimeout = setTimeout(() => {
          resetRfidBuffer();
        }, 1000); // Timeout after 1 second of no input
      }

      if (e.key === "Enter" && rfidInput) {
        clearTimeout(rfidTimeout);
        handleRfidSubmit(rfidInput);
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(rfidTimeout);
    };
  }, [rfidInput, handleRfidSubmit, resetRfidBuffer]);

  return (
    <div className="relative w-1/2 bg-secondary-white hidden flex-1 lg:flex flex-col">
      <div className="relative z-10 flex h-16 flex-shrink-0">
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <img src={logoLightMode} alt="logo" className="w-24 h-auto" />
        </div>
      </div>
      <div className="sm:px-6 px-4">
        <div className="mt-6">
          <h2 className="tracking-tight scroll-m-20 text-3xl font-semibold text-zinc-950">
            Authenticate your access
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Choose your account or scan your RFID to authenticate.
          </p>
        </div>
        <div className="mt-10 flex justify-between items-center">
          {/* <SelectUserCombobox /> */}

          <SegmentedControl activeTab={activeTab} onChange={setActiveTab} />
        </div>
        <div className="mt-20">
          <SelectUserSlide userType={activeTab} />
          <div className="flex justify-center items-center mt-6">
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1000}
              transitionSpeed={2000}
              className="pt-10 border-t-2 border-neutral-bright-grey"
            >
              <ShineBorder
                className={cn(
                  "flex cursor-pointer justify-center items-center gap-4 py-2 px-8",
                  loading && "opacity-50"
                )}
                color="#fff"
                borderWidth={2}
              >
                <RiRfidFill
                  size={22}
                  className={cn("text-white", isScanning && "animate-pulse")}
                />
                {loading
                  ? "Authenticating..."
                  : isScanning
                  ? "Reading card..."
                  : "Scan your badge"}
              </ShineBorder>
            </Tilt>
          </div>
        </div>
      </div>
    </div>
  );
}
