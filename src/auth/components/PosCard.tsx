import { Card } from "@/components/ui/card";
import { TypographyH3, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { PosData } from "@/types/pos";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { pageAnimations } from "../animation";
import { BorderBeam } from "@/components/ui/border-beam";

interface PosCardProps {
  pos: PosData;
  onClick: (id: string) => void;
}

const PosCard = ({ pos, onClick }: PosCardProps) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <motion.div {...pageAnimations.posCard} onClick={() => onClick(pos._id)}>
      <Card
        className={cn(
          "w-full cursor-pointer px-8 group relative",
          // pos.shift?.user_id._id === user.id ? "last-pos-card" : "",
          pos.shift?.user_id ? "py-4" : "py-6"
        )}
      >
        {pos.shift?.user_id._id === user.id && (
          <BorderBeam colorFrom="#FB0000" colorTo="#520000" size={140} borderWidth={2} duration={5} />
        )}
        <div className="flex justify-between items-center">
          <div>
            <TypographyH3 className="tracking-tight font-medium">
              {pos.name}
            </TypographyH3>
            {pos.shift?.user_id && (
              <div className="mt-4">
                <TypographySmall className="text-neutral-dark-grey text-[0.8rem]">
                  {pos.shift?.user_id.position} :{" "}
                  <span className="font-semibold">
                    {pos.shift?.user_id.name}
                  </span>
                </TypographySmall>
                <TypographySmall className="text-neutral-dark-grey text-[0.8rem]">
                  opened at{" "}
                  <span className="font-semibold">
                    {pos.shift?.opening_time
                      ? format(new Date(pos.shift.opening_time), "PPp")
                      : ""}
                  </span>
                </TypographySmall>
                {pos.printer_ip ? (
                  <span className="flex items-center gap-x-2 pt-6">
                    <span className="relative flex h-2 w-2 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <TypographySmall>Printer Connected</TypographySmall>
                  </span>
                ) : (
                  <span className="flex items-center gap-x-2 pt-6">
                    <span className="relative flex h-2 w-2 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <TypographySmall>Printer Not Connected</TypographySmall>
                  </span>
                )}
              </div>
            )}
          </div>
          <ChevronRight className="w-7 h-7 text-neutral-dark-grey group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </Card>
    </motion.div>
  );
};

export default PosCard;
