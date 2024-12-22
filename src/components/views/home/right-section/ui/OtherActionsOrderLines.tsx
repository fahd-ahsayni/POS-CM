// Dependencies: pnpm install lucide-react

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

export default function OtherActionsOrderLines() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <BsThreeDotsVertical size={16} />
          <span className="sr-only">Other actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 -ml-20 min-w-52">
        <DropdownMenuItem>
          <span className="text-sm">Change Order Type</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-sm">Apply Discount</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-sm">Cancel Order</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-sm">Add Comment</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <span className="text-sm flex items-center w-full justify-between space-x-4">
            <span>Order Immediately</span>
            <SwitchToggle enabled={false} setEnabled={() => {}} />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-sm flex items-center w-full justify-between space-x-4">
            <span>Mark as Urgent</span>
            <SwitchToggle enabled={false} setEnabled={() => {}} />
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
