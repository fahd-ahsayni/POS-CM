import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SwitchToggle } from "@/components/ui/toggle";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";

export default function OrderLineOtherActions() {
  const [isUrgent, setIsUrgent] = useState(false);

  const handleUrgentToggle = () => {
    setIsUrgent(!isUrgent);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="-ms-px rounded h-7 w-7 bg-accent-white/10 hover:bg-accent-white/20"
          aria-label="Open edit menu"
        >
          <BsThreeDotsVertical className="text-primary-black dark:text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 -ml-36 min-w-52">
        <DropdownMenuItem>
          <span className="text-sm">Change Order Line Type</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-sm">Apply Discount</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="text-sm flex items-center w-full justify-between space-x-4">
            <span>Mark as Urgent</span>
            <SwitchToggle enabled={isUrgent} setEnabled={handleUrgentToggle} />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
