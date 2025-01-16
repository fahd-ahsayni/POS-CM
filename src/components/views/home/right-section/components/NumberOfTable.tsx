import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { useNumberOfTable } from "../hooks/useNumberOfTable";
import { TableNumberDisplay } from "../layouts/TableNumberDisplay";

export default function NumberOfTable() {
  const {
    tableNumber,
    tableValid,
    handleNumberClick,
    handleConfirm,
    handleCancel,
    getValidationMessage,
  } = useNumberOfTable();

  return (
    <div className="flex flex-col justify-start h-full">
      <TypographyH3 className="font-medium max-w-md text-balance">
        Enter the table number to start the order:
      </TypographyH3>
      <div className="flex flex-col justify-center h-full relative">
        <TableNumberDisplay
          getValidationMessage={getValidationMessage}
          tableNumber={tableNumber}
          tableValid={tableValid}
          handleNumberClick={handleNumberClick}
        />
        <div className="flex gap-x-2 absolute bottom-0 w-full">
          <Button className="flex-1" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirm(tableNumber)}
            className="flex-1"
            disabled={tableValid !== "valid"}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
