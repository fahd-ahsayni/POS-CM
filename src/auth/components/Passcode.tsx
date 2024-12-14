import { Button } from "@/components/ui/button";
import CirclesAnimation from "./CirclesAnimation";
import { useState, useMemo } from "react";
import NumberPad from "@/components/global/NumberPad";

export default function Passcode() {
  const [passcode, setPasscode] = useState<string>("");
  
  const shuffledNumbers = useMemo(() => 
    Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5),
    [] // Empty dependency array means this only runs once on mount
  );

  const handleNumberClick = (value: string) => {
    if (value === "C") {
      setPasscode("");
    } else if (value === "delete") {
      setPasscode(prev => prev.slice(0, -1));
    } else if (passcode.length < 7) {
      setPasscode(prev => prev + value);
    }
  };

  return (
    <div className="flex lg:w-1/2 w-full bg-zinc-950 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative">
      <div className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30" />
      <div className="mx-auto w-full max-w-sm lg:w-96">
        <div>
          <h2 className="tracking-tight scroll-m-20 text-3xl font-semibold text-white">
            Entre Passcode
          </h2>
          <p className="mt-1 text-sm text-zinc-300">
            Securely authenticate to access the POS system.
          </p>
        </div>
        <div className="mt-10">
          <CirclesAnimation currentLength={passcode.length} />
        </div>
        <div className="mt-10 min-w-full px-20">
          <NumberPad onNumberClick={handleNumberClick} numbers={shuffledNumbers} />
        </div>
        <div className="mt-10">
          <Button to='/select-pos' className="w-full">Log In</Button>
        </div>
      </div>
    </div>
  );
}
