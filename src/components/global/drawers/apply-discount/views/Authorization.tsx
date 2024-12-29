import { checkAuthorization } from "@/api/services";
import CirclesAnimation from "@/auth/components/ui/CirclesAnimation";
import NumberPad from "@/components/global/NumberPad";
import ShineBorder from "@/components/ui/shine-border";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiRfidFill } from "react-icons/ri";

export default function Authorization({
  setAuthorization,
}: {
  setAuthorization: (authorization: boolean) => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [incorrectPasscode, setIncorrectPasscode] = useState(false);

  const shuffledNumbers = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => i + 1).sort(
        () => Math.random() - 0.5
      ),
    []
  );

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

  const handleChangePasscode = useCallback(async () => {
    if (passcode.length === 6 || passcode.length === 4) {
      const response = await checkAuthorization(passcode);
      if (response.status === 200) {
        setAuthorization(true);
      }
    }
  }, [passcode, setAuthorization]);

  useEffect(() => {
    handleChangePasscode();
  }, [passcode, handleChangePasscode]);

  return (
    <section className="overflow-hidden h-full flex flex-col items-center gap-8 relative">
      <TypographyP className="text-sm opacity-70 pt-10">
        Enter the admin passcode or scan an admin badge to proceed with the
        cancellation.
      </TypographyP>
      <div className="flex-1 pt-12 flex items-center justify-center flex-col space-y-8">
        <CirclesAnimation
          currentLength={passcode.length}
          incorrectPasscode={incorrectPasscode}
          isFixedLightDark={true}
        />
        <NumberPad
          onNumberClick={handleNumberClick}
          numbers={shuffledNumbers}
          fixLightDark
        />
      </div>
      <div className="flex justify-center gap-4 w-full px-8">
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
