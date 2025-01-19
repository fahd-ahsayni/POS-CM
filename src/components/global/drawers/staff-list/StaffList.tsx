import { fetchLivreurs, fetchWaiters } from "@/api/services";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useAppDispatch } from "@/store/hooks";
import {
  setDeliveryGuyId,
  setWaiterId,
} from "@/store/slices/order/create-order.slice";
import { StaffUser } from "@/types/staff";
import { Avatar } from "@heroui/avatar";
import { Phone } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import Drawer from "../../Drawer";

interface StaffListProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const StaffList = ({ open, setOpen }: StaffListProps) => {
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const id = useId();

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

  const handleConfirm = () => {
    const selectedStaff = staffList.find((s) => s._id === selectedStaffId);
    if (selectedStaff) {
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
      <RadioGroup
        className="gap-2"
        value={selectedStaffId}
        onValueChange={handleStaffSelection}
      >
        {staffList.map((staff) => (
          <div
            key={staff._id}
            className="relative flex w-full items-start gap-4 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-primary-red dark:bg-primary-black bg-white"
          >
            <RadioGroupItem
              value={staff._id}
              id={`${id}-${staff._id}`}
              className="order-1 after:absolute after:inset-0"
            />
            <div className="flex grow items-start gap-5">
              <Avatar
                radius="lg"
                size="sm"
                showFallback={true}
                fallback={
                  <span className="font-medium text-sm">
                    {staff.name?.charAt(0)}
                  </span>
                }
                src={staff?.image || undefined}
                className="shrink-0"
              />
              <div className="grid grow gap-2">
                <Label htmlFor={`${id}-${staff._id}`}>{staff.name}</Label>
                <p className="text-xs text-muted-foreground flex items-center gap-x-2">
                  <Phone className="size-3" />
                  <span>{staff.phone}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    );
  };

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      title={isDelivery ? "Delivery Boys" : "Waiters"}
      classNames="focus:outline-none max-w-md"
    >
      <div className="flex h-full flex-col">
        <div className="py-3">
          <TypographySmall>
            Select a {isDelivery ? "delivery boy" : "waiter"} to assign
          </TypographySmall>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-3">
          {renderContent()}
        </div>

        <div className="pt-4 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            className="dark:bg-white/10 bg-white border border-border"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button
            variant="default"
            className="flex-1"
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
