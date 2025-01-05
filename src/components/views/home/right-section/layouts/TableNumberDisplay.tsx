import { TypographyH1, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import NumberPad from "@/components/global/NumberPad";

interface TableNumberDisplayProps {
  tableNumber: string | null;
  tableValid: "valid" | "invalid" | "not-found";
  getValidationMessage: () => string;
  handleNumberClick: (number: string) => void;
}

export function TableNumberDisplay({
  tableNumber,
  tableValid,
  getValidationMessage,
  handleNumberClick,
}: TableNumberDisplayProps) {
  return (
    <div className="flex flex-col space-y-1 justify-center items-center mb-6">
      <TypographyH1
        className={cn(
          "font-medium tracking-wider",
          tableValid === "invalid" && "text-warning-color",
          tableValid === "not-found" && "text-error-color"
        )}
      >
        {tableNumber || "0"}
      </TypographyH1>
      <TypographySmall
        className={cn(
          "text-center leading-3 pb-6",
          tableValid === "invalid" && "text-warning-color",
          tableValid === "not-found" && "text-error-color"
        )}
      >
        {getValidationMessage()}
        <span className="opacity-0">?</span>
      </TypographySmall>
      <NumberPad onNumberClick={handleNumberClick} />
    </div>
  );
}
