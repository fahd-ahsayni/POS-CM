import { ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { pageAnimations } from "../animation";
import { TypographyH3, TypographySmall } from "@/components/ui/typography";
import { format } from "date-fns";
import { PosData } from "@/types/pos";
import { cn } from "@/lib/utils";

interface PosCardProps {
  pos: PosData;
  onClick: (id: string) => void;
}

const PosCard = ({ pos, onClick }: PosCardProps) => {
  const posId = localStorage.getItem("posId");
  return (
    <motion.div {...pageAnimations.posCard} onClick={() => onClick(pos._id)}>
      <Card
        className={cn(
          "w-full cursor-pointer py-4 px-8",
          pos._id === posId ? "last-pos-card" : ""
        )}
      >
        <div className="flex justify-between items-center">
          <div>
            <TypographyH3 className="tracking-tight font-medium">
              {pos.name}
            </TypographyH3>
            {pos.shift?.user_id && (
              <div className="mt-4">
                <TypographySmall className="text-zinc-200 text-sm">
                  {pos.shift?.user_id.position} :{" "}
                  <span className="font-medium">{pos.shift?.user_id.name}</span>
                </TypographySmall>
                <TypographySmall className="text-zinc-300 text-sm">
                  opened at{" "}
                  <span className="font-medium">
                    {pos.shift?.opening_time
                      ? format(new Date(pos.shift.opening_time), "PPp")
                      : ""}
                  </span>
                </TypographySmall>
              </div>
            )}
          </div>
          <ChevronRight className="w-7 h-7 text-white" />
        </div>
      </Card>
    </motion.div>
  );
};

export default PosCard;
