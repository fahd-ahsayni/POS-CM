import { unknownUser } from "@/assets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { StaffUser } from "@/types/staff";
import { memo, useCallback } from "react";
import Drawer from "../../Drawer";
import { GeneralData } from "@/types/general";

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
            {staff.image ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={staff.image}
                alt={staff.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full flex items-center justify-center ring-2 ring-border">
                <img
                  src={unknownUser}
                  alt=""
                  className="size-full rounded-full object-cover"
                />
              </div>
            )}
            <span className="flex h-2.5 w-2.5 absolute top-0 right-0">
              <span
                className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full bg-success-color opacity-75",
                  true ? "bg-success-color" : "bg-neutral-neutral-grey"
                )}
              ></span>
              <span
                className={cn(
                  "relative inline-flex rounded-full h-2.5 w-2.5",
                  true ? "bg-success-color" : "bg-neutral-neutral-grey"
                )}
              ></span>
            </span>
          </span>
          <div className="ml-4 truncate space-y-1">
            <TypographyP className="truncate text-sm">{staff.name}</TypographyP>
            <TypographySmall className="truncate dark:text-neutral-neutral-grey text-neutral-dark-grey flex items-center gap-1">
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

        <ul className="flex-1 divide-y divide-gray-50 overflow-y-auto">
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

        <div className="border-t border-border p-4">
          <Button
            variant="secondary"
            className="w-full"
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
