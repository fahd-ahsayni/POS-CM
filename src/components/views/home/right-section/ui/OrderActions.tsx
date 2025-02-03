import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
import ApplyDiscount from "@/components/global/drawers/apply-discount/ApplyDiscount";
import ModalOrderComments from "@/components/global/modal/ModalOrderComments";
import { Switch } from "@/components/ui/switch";
import { updateOrder } from "@/functions/updateOrder";
import { cn } from "@/lib/utils";
import { setOneTime, setUrgent } from "@/store/slices/order/create-order.slice";
import * as Headless from "@headlessui/react";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { TYPE_OF_ORDER_VIEW } from "../constants";
import { useRightViewContext } from "../contexts/RightViewContext";

export default function OtherActionsOrderLines() {
  const dispatch = useDispatch();
  const [openModalOrderComments, setOpenModalOrderComments] = useState(false);

  const [openModalApplyDiscount, setOpenModalApplyDiscount] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isOneTime, setIsOneTime] = useState(false);

  const { setViews } = useRightViewContext();
  const loadedOrder = localStorage.getItem("loadedOrder");

  const handleUrgentToggle = (value: boolean) => {
    setIsUrgent(value);
    dispatch(updateOrder({ urgent: value }));
    dispatch(setUrgent(value));
  };

  const handleOneTimeToggle = (value: boolean) => {
    setIsOneTime(value);
    dispatch(updateOrder({ one_time: value }));
    dispatch(setOneTime(value));
  };

  return (
    <>
      <ApplyDiscount
        open={openModalApplyDiscount}
        setOpen={setOpenModalApplyDiscount}
      />
      <ModalOrderComments
        isOpen={openModalOrderComments}
        setOpen={setOpenModalOrderComments}
      />
      <Dropdown>
        <Headless.MenuButton>
          <span
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 [&_svg]:pointer-events-none [&_svg]:shrink-0",
              "bg-primary-red text-white shadow-sm shadow-black/5 hover:bg-[#CE0303] disabled:pointer-events-none disabled:bg-[#AAAAAA] disabled:text-[#7E7E7E] disabled:cursor-not-allowed",
              "h-8 w-8"
            )}
          >
            <BsThreeDotsVertical size={16} />
          </span>
        </Headless.MenuButton>

        <DropdownMenu className="z-[9999] p-3">
          <DropdownItem
            onClick={() => setViews(TYPE_OF_ORDER_VIEW)}
            disabled={!!loadedOrder}
          >
            Change Order Type
          </DropdownItem>

          <DropdownItem onClick={() => setOpenModalApplyDiscount(true)}>
            Apply Discount
          </DropdownItem>

          <DropdownItem
            onClick={() => setOpenModalOrderComments(true)}
            disabled={!!loadedOrder}
          >
            Add Comment
          </DropdownItem>

          <DropdownDivider />

          <div className="flex flex-col gap-y-2 px-3.5 py-2.5 sm:px-3 sm:py-1.5">
            <div className="flex items-center justify-between w-full">
              <span className="text-sm">Order One Time</span>
              <span className="-mr-10">
                <Switch
                  color="red"
                  checked={isOneTime}
                  onChange={handleOneTimeToggle}
                  disabled={!!loadedOrder}
                />
              </span>
            </div>

            <div
              className="flex items-center justify-between w-full"
              onClick={() => handleUrgentToggle(!isUrgent)}
            >
              <span className="text-sm">Mark as Urgent</span>
              <span className="-mr-10">
                <Switch
                  color="red"
                  checked={isUrgent}
                  onChange={handleUrgentToggle}
                  disabled={!!loadedOrder}
                />
              </span>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
