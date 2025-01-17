import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { GeneralData } from "@/types/general";
import { StaffUser } from "@/types/staff";
import { Avatar } from "@heroui/avatar";
import { Phone } from "lucide-react";
import { memo, useCallback } from "react";
import Drawer from "../../Drawer";

interface StaffListProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (staff: StaffUser) => void;
}

const StaffList = memo(({ open, setOpen, onSelect }: StaffListProps) => {
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const isDelivery = orderType?.select_delivery_boy;
  const generalData: GeneralData = JSON.parse(
    localStorage.getItem("generalData") || "{}"
  );
  const staffList: StaffUser[] = isDelivery
    ? generalData.livreurs || []
    : generalData.waiters || [];

  const handleStaffSelect = useCallback(
    (staff: StaffUser) => {
      onSelect(staff);
      setOpen(false);
    },
    [onSelect, setOpen]
  );

  const StaffCard = ({ staff }: { staff: StaffUser }) => (
    <li key={staff._id}>
      <Card
        className="group relative flex items-center py-6 px-5 cursor-pointer dark:bg-primary-black bg-white"
        onClick={() => handleStaffSelect(staff)}
      >
        <div className="relative flex min-w-0 flex-1 items-center">
          <span className="relative inline-block flex-shrink-0">
            <Avatar
              isBordered
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
              <span>
                <Phone className="size-3" />
              </span>
              <span>{staff.phone}</span>
            </TypographySmall>
          </div>
        </div>
      </Card>
    </li>
  );

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      title={isDelivery ? "Delivery Boys" : "Waiters"}
    >
      <div className="flex h-full flex-col">
        <div className="py-3">
          <TypographySmall>
            Select a {isDelivery ? "delivery boy" : "waiter"} to assign
          </TypographySmall>
        </div>

        <ul className="flex-1 overflow-y-auto space-y-4 pr-3">
          {staffList.length > 0 ? (
            staffList.map((staff) => (
              <StaffCard key={staff._id} staff={staff} />
            ))
          ) : (
            <li className="p-6">
              <TypographyP className="text-center text-gray-500">
                No {isDelivery ? "delivery boys" : "waiters"} available
              </TypographyP>
            </li>
          )}
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
