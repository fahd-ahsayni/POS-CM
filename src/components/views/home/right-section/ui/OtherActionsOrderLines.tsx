import ModalOrderComments from "@/components/global/modal/ModalOrderComments";
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
import { updateOrder } from "@/functions/updateOrder";
import { useDispatch } from "react-redux";
import ChangeOrderType from "@/components/global/drawers/change-order-type/ChangeOrderType";
import ApplyDiscount from "@/components/global/drawers/apply-discount/ApplyDiscount";

export default function OtherActionsOrderLines() {
  const dispatch = useDispatch();
  const [openModalOrderComments, setOpenModalOrderComments] = useState(false);
  const [openModalChangeOrderType, setOpenModalChangeOrderType] =
    useState(false);
  const [openModalApplyDiscount, setOpenModalApplyDiscount] = useState(true);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isOneTime, setIsOneTime] = useState(false);

  const handleUrgentToggle = (value: boolean) => {
    setIsUrgent(value);
    dispatch(updateOrder({ urgent: value }));
  };

  const handleOneTimeToggle = (value: boolean) => {
    setIsOneTime(value);
    dispatch(updateOrder({ one_time: value }));
  };

  return (
    <>
      <ApplyDiscount
        open={openModalApplyDiscount}
        setOpen={setOpenModalApplyDiscount}
      />
      <ChangeOrderType
        open={openModalChangeOrderType}
        setOpen={setOpenModalChangeOrderType}
      />
      <ModalOrderComments
        isOpen={openModalOrderComments}
        setOpen={setOpenModalOrderComments}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon">
            <BsThreeDotsVertical size={16} />
            <span className="sr-only">Other actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2 -ml-20 min-w-52">
          <DropdownMenuItem onClick={() => setOpenModalChangeOrderType(true)}>
            <span className="text-sm">Change Order Type</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="text-sm">Apply Discount</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <span className="text-sm">Cancel Order</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => setOpenModalOrderComments(true)}>
            <span className="text-sm">Add Comment</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className="text-sm flex items-center w-full justify-between space-x-4">
              <span>Order Immediately</span>
              <SwitchToggle
                enabled={isOneTime}
                setEnabled={handleOneTimeToggle}
              />
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="text-sm flex items-center w-full justify-between space-x-4">
              <span>Mark as Urgent</span>
              <SwitchToggle
                enabled={isUrgent}
                setEnabled={handleUrgentToggle}
              />
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
