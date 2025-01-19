import { fetchLivreurs, fetchWaiters } from "@/api/services";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { StaffUser } from "@/types/staff";
import { Avatar } from "@heroui/avatar";
import { Phone } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import Drawer from "../../Drawer";

interface StaffListProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (staff: StaffUser) => void;
}

const StaffCard = memo(
  ({
    staff,
    onSelect,
    isSelected,
  }: {
    staff: StaffUser;
    onSelect: (staff: StaffUser) => void;
    isSelected: boolean;
  }) => (
    <Card
      className={cn(
        "group relative flex items-center py-6 px-5 cursor-pointer dark:bg-primary-black bg-white",
        isSelected && "ring-2 ring-primary-red"
      )}
      onClick={() => onSelect(staff)}
    >
      <div className="relative flex min-w-0 flex-1 items-center">
        <span className="relative inline-block flex-shrink-0">
          <Avatar
            radius="lg"
            showFallback={true}
            fallback={
              <span className="font-medium text-sm">
                {staff.name?.charAt(0)}
              </span>
            }
            src={staff?.image || undefined}
          />
        </span>
        <div className="ml-4 truncate space-y-1">
          <TypographyP className="truncate text-sm font-medium tracking-wide flex items-center gap-x-2">
            {staff.name}
          </TypographyP>
          <TypographySmall className="truncate dark:text-neutral-neutral-grey text-neutral-dark-grey flex items-center justify-center gap-x-2">
            <Phone className="size-3" />
            <span>{staff.phone}</span>
          </TypographySmall>
        </div>
      </div>
    </Card>
  )
);

StaffCard.displayName = "StaffCard";

const StaffList = memo(({ open, setOpen, onSelect }: StaffListProps) => {
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleStaffSelect = useCallback(
    (staff: StaffUser) => {
      onSelect(staff);
      setOpen(false);
    },
    [onSelect, setOpen]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <li className="p-6">
          <TypographyP className="text-center text-gray-500">
            Loading...
          </TypographyP>
        </li>
      );
    }

    if (error) {
      return (
        <li className="p-6">
          <TypographyP className="text-center text-red-500">
            {error}
          </TypographyP>
        </li>
      );
    }

    if (staffList.length === 0) {
      return (
        <li className="p-6">
          <TypographyP className="text-center text-gray-500">
            No {isDelivery ? "delivery boys" : "waiters"} available
          </TypographyP>
        </li>
      );
    }

    return staffList.map((staff) => (
      <li key={staff._id}>
        <StaffCard
          staff={staff}
          onSelect={handleStaffSelect}
          isSelected={false}
        />
      </li>
    ));
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

        <ul className="flex-1 overflow-y-auto space-y-4 pr-3">
          {renderContent()}
        </ul>

        <div className="pt-4">
          <Button
            variant="secondary"
            className="flex-1 dark:bg-white/10 bg-white border border-border w-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  );
});

StaffList.displayName = "StaffList";

export default StaffList;
