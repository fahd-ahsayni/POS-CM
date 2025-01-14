import { logoWithoutText } from "@/assets";
import ShineBorder from "@/components/ui/shine-border";
import { TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { AppDispatch, RootState } from "@/store";
import { loginWithRfid } from "@/store/slices/authentication/auth.slice";
import { useCallback, useEffect, useState } from "react";
import { RiRfidFill } from "react-icons/ri";
import Tilt from "react-parallax-tilt";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SegmentedControl from "./SegmentedControl";
import SelectUserSlide from "./SelectUserSlide";

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
      <header className="absolute top-0 left-0 z-10 flex h-16 flex-shrink-0">
        <div className="flex flex-1 justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <img
              // src={theme.theme === "dark" ? logoDarkMode : logoLightMode}
              src={logoWithoutText}
              alt="logo"
              className="w-8 h-auto"
            />
            <span>
              <TypographySmall className="font-semibold leading-[0] text-xs text-primary-black">
                Caisse
              </TypographySmall>
              <TypographySmall className="font-semibold leading-[0] text-xs text-primary-black">
                Manager
              </TypographySmall>
            </span>
          </div>
        </div>
      </header>
      <div className="sm:px-6 px-4 h-full flex flex-col justify-center">
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
        <div className="mt-8">
          <SelectUserSlide userType={activeTab} />
          <div className="flex justify-center items-center mt-4">
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
