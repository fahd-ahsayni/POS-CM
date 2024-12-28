import { checkAuthorization } from "@/api/services";
import CirclesAnimation from "@/auth/components/ui/CirclesAnimation";
import NumberPad from "@/components/global/NumberPad";
import ShineBorder from "@/components/ui/shine-border";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiRfidFill } from "react-icons/ri";
import Tilt from "react-parallax-tilt";

export default function Authorization({
  setAuthorization,
}: {
  setAuthorization: (authorization: boolean) => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [incorrectPasscode, setIncorrectPasscode] = useState(false);

  // Memoize shuffled numbers
  const shuffledNumbers = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => i + 1).sort(
        () => Math.random() - 0.5
      ),
    []
  );

  // Memoize handlers
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

  const handleChangePasscode = async () => {
    if (passcode.length === 6 || passcode.length === 4) {
      const response = await checkAuthorization(passcode);
      if (response.status === 200) {
        setAuthorization(true);
      }
    }
  };

  useEffect(() => {
    handleChangePasscode();
  }, [passcode]);

  return (
    <>
      <div className="flex flex-col gap-2 h-full py-8">
        <TypographyP className="text-sm">
          Enter the admin passcode or scan an admin badge to proceed with the
          cancellation.
        </TypographyP>
        <div className="h-full flex flex-col justify-center items-center">
          <div className="">
            <CirclesAnimation
              currentLength={passcode.length}
              incorrectPasscode={incorrectPasscode}
            />
          </div>
          <div className="mt-10 min-w-full px-20">
            <NumberPad
              onNumberClick={handleNumberClick}
              numbers={shuffledNumbers}
              fixLightDark
            />
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center mt-6">
            <ShineBorder
              className={cn(
                "flex cursor-pointer justify-center items-center gap-4 py-3 px-8"
              )}
              color="#fff"
              borderWidth={2}
            >
              <RiRfidFill size={20} className={cn("text-white")} />
              Scan Admin Badge
            </ShineBorder>
          </div>
        </div>
      </div>
    </>
  );
}
