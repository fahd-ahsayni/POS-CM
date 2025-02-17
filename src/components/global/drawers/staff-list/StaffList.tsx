import { fetchLivreurs, fetchWaiters, updateOrder } from "@/api/services";
import { unknownUser } from "@/assets";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { StaffUser } from "@/interfaces/staff";
import { useAppDispatch } from "@/store/hooks";
import {
  setDeliveryGuyId,
  setWaiterId,
} from "@/store/slices/order/create-order.slice";
import { Phone } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Drawer from "../layout/Drawer";

interface StaffListProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  onSelect?: (staff: StaffUser) => void;
}

const StaffList = ({ open, setOpen }: StaffListProps) => {
  // Compute baseUrl dynamically
  const baseUrl = localStorage.getItem("ipAddress") || window.ENV?.VITE_BASE_URL || import.meta.env.VITE_BASE_URL;

  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");

  const dispatch = useAppDispatch();

  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const isDelivery = orderType?.select_delivery_boy;

  const fetchStaffList = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await (isDelivery ? fetchLivreurs() : fetchWaiters());
      setStaffList(response.data);
    } catch (error) {
      setError("Failed to fetch staff list");
      console.error("Error fetching staff list:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isDelivery]);

  useEffect(() => {
    if (open) {
      fetchStaffList();
    }
  }, [open, fetchStaffList]);

  const handleConfirm = async () => {
    const selectedStaff = staffList.find((s) => s._id === selectedStaffId);
    const loadedOrder = localStorage.getItem("loadedOrder");

    if (selectedStaff) {
      if (loadedOrder) {
        // Handle loaded order update
        const order = JSON.parse(loadedOrder);
        try {
          if (isDelivery) {
            await updateOrder(
              {
                waiter_id: null,
                delivery_guy_id: selectedStaff._id,
              },
              order._id
            );
          } else {
            await updateOrder(
              {
                waiter_id: selectedStaff._id,
                delivery_guy_id: null,
              },
              order._id
            );
          }
        } catch (error) {
          console.error("Error updating order staff:", error);
        }
      }

      // Update Redux state
      if (isDelivery) {
        dispatch(setDeliveryGuyId(selectedStaff._id));
        dispatch(setWaiterId(null));
      } else {
        dispatch(setWaiterId(selectedStaff._id));
        dispatch(setDeliveryGuyId(null));
      }

      setOpen(false);
    }
  };

  const handleStaffSelection = (staffId: string) => {
    setSelectedStaffId(staffId);
  };

  const handleReset = () => {
    setSelectedStaffId("");
    dispatch(setWaiterId(null));
    dispatch(setDeliveryGuyId(null));
    setOpen(false);
  };

  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState error={error} />;
    if (staffList.length === 0) return <EmptyState isDelivery={isDelivery} />;

    return (
      <div className="space-y-4">
        {staffList.map((staff) => (
          <div
            key={staff._id}
            onClick={() => handleStaffSelection(staff._id)}
            className={`relative flex gap-x-4 w-full cursor-pointer px-4 border bg-secondary-white dark:bg-primary-black rounded-lg py-3.5 ${
              selectedStaffId === staff._id
                ? "border-primary-red border"
                : "border-input"
            }`}
          >
            <div className="h-full">
              <div className="relative">
                <Avatar className="size-20 rounded-lg">
                  <AvatarImage
                    src={
                      staff.image
                        ? `${baseUrl}${staff.image}`
                        : unknownUser
                    }
                    alt={staff.name}
                  />
                </Avatar>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex mb-1.5 justify-between items-center">
                <div className="flex space-x-1">
                  <TypographyP className="font-medium">
                    {staff.name}
                  </TypographyP>
                  {/* <Verified className="size-5" /> */}
                </div>
                {/* <div className="flex gap-x-1">
                  <Star
                    size={16}
                    className="size-3.5 fill-yellow-500 stroke-yellow-500"
                  />
                  <TypographySmall className="-mt-0.5 font-semibold">
                    4.9
                  </TypographySmall>
                </div> */}
              </div>
              {/* <div className="flex flex-wrap gap-1">
                <TypographySmall className="inline rounded-md bg-red-500/15 px-2 py-0.5 text-red-500 text-xs">
                  Senior
                </TypographySmall>
                <TypographySmall className="inline rounded-md bg-amber-500/15 px-2 py-0.5 text-amber-500 text-xs">
                  VIP Service
                </TypographySmall>
              </div> */}
              <div className="pt-3 flex gap-x-4">
                <span className="flex gap-x-1.5 dark:text-white/70 text-primary-black/70">
                  <Phone size={14} />
                  <TypographySmall className="inline text-xs font-medium">
                    {staff.phone}
                  </TypographySmall>
                </span>
                {/* <span className="flex gap-x-1.5 dark:text-white/70 text-primary-black/70">
                  <Salad size={14} />
                  <TypographySmall className="inline text-xs font-medium">
                    32
                  </TypographySmall>
                </span> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      title={isDelivery ? "Delivery Boys" : "Waiters"}
      classNames="focus:outline-none max-w-md bg-neutral-bright-grey"
      description={`Select a ${
        isDelivery ? "delivery boy" : "waiter"
      } to assign`}
    >
      <div className="flex h-full flex-col">
        <ScrollArea className="flex-1 flex flex-col justify-center items-center pr-3">
          {renderContent()}
        </ScrollArea>

        <div className="pt-4 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            className="dark:bg-white/10 bg-white border border-border w-full"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="default"
            className="w-full"
            onClick={handleConfirm}
            disabled={!selectedStaffId}
          >
            Confirm Selection
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

// Helper components for different states
const LoadingState = () => (
  <div className="p-6">
    <TypographyP className="text-center text-gray-500">Loading...</TypographyP>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="p-6">
    <TypographyP className="text-center text-red-500">{error}</TypographyP>
  </div>
);

const EmptyState = ({ isDelivery }: { isDelivery: boolean }) => (
  <div className="p-6">
    <TypographyP className="text-center text-gray-500">
      No {isDelivery ? "delivery boys" : "waiters"} available
    </TypographyP>
  </div>
);

StaffList.displayName = "StaffList";

export default StaffList;
