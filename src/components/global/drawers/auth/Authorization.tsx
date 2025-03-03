import { checkAuthorization } from "@/api/services";
import { checkAdminRfid } from "@/api/services"; // Import the RFID check function
import NumberPad from "@/components/global/NumberPad";
import ShineBorder from "@/components/ui/shine-border";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiRfidFill } from "react-icons/ri";
import { motion } from "framer-motion";

// Inline circle animation component
interface PasscodeCirclesProps {
  totalCircles: number;
  filledCircles: number;
  circleSize?: number;
  activeColor?: string;
  inactiveColor?: string;
  spacing?: number;
}

const PasscodeCircles = ({ 
  totalCircles, 
  filledCircles, 
  circleSize = 12,
  activeColor = "#ffffff", 
  inactiveColor = "rgba(255, 255, 255, 0.3)",
  spacing = 12
}: PasscodeCirclesProps) => {
  return (
    <div className="flex" style={{ gap: `${spacing}px` }}>
      {Array.from({ length: totalCircles }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ scale: 1 }}
          animate={{
            scale: index < filledCircles ? 1.05 : 1,
            backgroundColor: index < filledCircles ? activeColor : inactiveColor,
          }}
          transition={{ duration: 0.15 }}
          style={{
            width: circleSize,
            height: circleSize,
            borderRadius: "50%",
          }}
        />
      ))}
    </div>
  );
};

export default function Authorization({
  setAuthorization,
  setAdmin,
}: {
  setAuthorization: (authorization: boolean) => void;
  setAdmin: (admin: any) => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [rfid, setRfid] = useState(""); // State to store RFID input
  const shuffledNumbers = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => i + 1).sort(
        () => Math.random() - 0.5
      ),
    []
  );

  // Handle number pad clicks
  const handleNumberClick = useCallback(
    (value: string) => {
      if (value === "C") {
        setPasscode("");
      } else if (value === "delete") {
        setPasscode((prev) => prev.slice(0, -1));
      } else if (passcode.length < 6) {
        setPasscode((prev) => prev + value);
      }
    },
    [passcode.length]
  );

  // Check passcode authorization
  const handleChangePasscode = useCallback(async () => {
    if (passcode.length === 6 || passcode.length === 4) {
      const response = await checkAuthorization(passcode);
      if (response.status === 200) {
        setAuthorization(true);
        setAdmin(response.data);
      }
    }
  }, [passcode, setAuthorization]);

  // Check RFID badge authorization
  const handleRfidScan = useCallback(
    async (rfid: string) => {
      try {
        const response = await checkAdminRfid(rfid); // Call the RFID check function
        if (response.status === 200) {
          setAuthorization(true);
          setAdmin(response.data);
        }
      } catch (error) {
        console.error("RFID validation failed:", error);
      }
    },
    [setAuthorization, setAdmin]
  );

  // Listen for RFID input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;

      // Assuming RFID input ends with "Enter" key
      if (key === "Enter" && rfid.length > 0) {
        handleRfidScan(rfid); // Validate RFID badge
        setRfid(""); // Reset RFID state
      } else if (key.length === 1 || key === "Backspace") {
        setRfid((prev) => prev + key); // Accumulate RFID input
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [rfid, handleRfidScan]);

  // Trigger passcode validation when passcode changes
  useEffect(() => {
    handleChangePasscode();
  }, [passcode, handleChangePasscode]);

  return (
    <section className="overflow-hidden h-full flex flex-col items-center gap-8 relative">
      <div className="flex-1 pt-12 flex items-center justify-center flex-col space-y-8">
        <TypographyP className="text-sm text-center max-w-sm pb-8 dark:text-white/70 text-primary-black/70">
          Enter admin code or scan badge to continue.
        </TypographyP>

        <div className="flex justify-center mb-6">
          <PasscodeCircles
            totalCircles={6}
            filledCircles={passcode.length}
            circleSize={12}
            activeColor="#ffffff"
            inactiveColor="rgba(255, 255, 255, 0.3)"
          />
        </div>

        <NumberPad
          onNumberClick={handleNumberClick}
          numbers={shuffledNumbers}
          fixLightDark
        />
      </div>
      
      <div className="flex justify-center gap-4 w-full px-8 pb-8">
        <ShineBorder
          className={cn(
            "flex cursor-pointer justify-center items-center gap-4 py-2.5 px-4"
          )}
          color="#fff"
          borderWidth={1}
        >
          <RiRfidFill size={20} className={cn("text-white")} />
          <span className="text-white text-sm">Scan Admin Badge</span>
        </ShineBorder>
      </div>
    </section>
  );
}
