import ApplyDiscount from "@/components/global/drawers/apply-discount/ApplyDiscount";
import ModalOrderComments from "@/components/global/modal/ModalOrderComments";
import { Switch } from "@/components/ui/switch";
import { updateOrder } from "@/functions/updateOrder";
import { cn } from "@/lib/utils";
import { setOneTime, setUrgent } from "@/store/slices/order/create-order.slice";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
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

      <Menu as="div" className="relative">
        <MenuButton>
          <span
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 [&_svg]:pointer-events-none [&_svg]:shrink-0",
              "bg-primary-red text-white shadow-sm shadow-black/5 hover:bg-[#CE0303] disabled:pointer-events-none disabled:bg-[#AAAAAA] disabled:text-[#7E7E7E] disabled:cursor-not-allowed",
              "h-8 w-8"
            )}
          >
            <BsThreeDotsVertical size={16} />
          </span>
        </MenuButton>

        <MenuItems className="absolute right-0 mt-2 z-[9999] w-60 origin-top-right rounded-md bg-white dark:bg-primary-black shadow-lg focus:outline-none p-3 border border-border">
          <MenuItem disabled={!!loadedOrder}>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-100 dark:bg-secondary-black" : ""
                } group flex w-full items-center px-4 py-2 text-sm rounded ${
                  loadedOrder ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setViews(TYPE_OF_ORDER_VIEW)}
                disabled={!!loadedOrder}
              >
                Change Order Type
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-100 dark:bg-secondary-black" : ""
                } group flex w-full items-center px-4 py-2 text-sm rounded`}
                onClick={() => setOpenModalApplyDiscount(true)}
              >
                Apply Discount
              </button>
            )}
          </MenuItem>
          <MenuItem disabled={!!loadedOrder}>
            {({ active }) => (
              <button
                className={`${
                  active ? "bg-gray-100 dark:bg-secondary-black" : ""
                } group flex w-full items-center px-4 py-2 text-sm rounded ${
                  loadedOrder ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setOpenModalOrderComments(true)}
                disabled={!!loadedOrder}
              >
                Add Comment
              </button>
            )}
          </MenuItem>
          <MenuItem disabled>
            {({ active }) => (
              <div
                className={`${
                  active ? "bg-gray-100 dark:bg-secondary-black" : ""
                } group flex w-full items-center justify-between px-4 py-2 text-sm rounded ${
                  loadedOrder ? "opacity-50" : ""
                }`}
              >
                <span>Order One Time</span>
                <Switch
                  color="red"
                  checked={isOneTime}
                  onChange={handleOneTimeToggle}
                  disabled={!!loadedOrder}
                />
              </div>
            )}
          </MenuItem>
          <MenuItem disabled>
            {({ active }) => (
              <div
                className={`${
                  active ? "bg-gray-100 dark:bg-secondary-black" : ""
                } group flex w-full items-center justify-between px-4 py-2 text-sm rounded ${
                  loadedOrder ? "opacity-50" : ""
                }`}
              >
                <span>Mark as Urgent</span>
                <Switch
                  color="red"
                  checked={isUrgent}
                  onChange={handleUrgentToggle}
                  disabled={!!loadedOrder}
                />
              </div>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </>
  );
}
