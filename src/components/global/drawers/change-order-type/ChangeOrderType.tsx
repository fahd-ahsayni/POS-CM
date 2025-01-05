import Drawer from "../../Drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { TypographyH3 } from "@/components/ui/typography";
import {
  ChangeOrderTypeProvider,
  useChangeOrderType,
} from "./context/ChangeOrderTypeContext";
import DrawerChangeOrderContent from "./DrawerChangeOrderContent";

function ChangeOrderTypeContent() {
  const { selectedType, showForm, handleBack } = useChangeOrderType();

  return (
    <div className="flex flex-col h-full py-2 px-3">
      <div className="flex items-center gap-x-2 mb-4">
        {(selectedType || showForm !== "types") && (
          <Button
            variant="secondary"
            size="icon"
            onClick={handleBack}
            className="bg-white border border-border shadow dark:bg-white/10"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
        )}
        <TypographyH3 className="font-medium">
          {selectedType ? selectedType.name : "Select a new order type"}
        </TypographyH3>
      </div>

      <div className="flex-1 overflow-auto">
        <DrawerChangeOrderContent />
      </div>
    </div>
  );
}

export default function ChangeOrderType({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <ChangeOrderTypeProvider setOpen={setOpen}>
      <Drawer open={open} setOpen={setOpen} title="Change Order Type">
        <ChangeOrderTypeContent />
      </Drawer>
    </ChangeOrderTypeProvider>
  );
}
