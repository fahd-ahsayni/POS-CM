import { useAppDispatch } from "@/store/hooks";
import { fetchGeneralData } from "@/store/slices/data/general-data.slice";
import {
  setDeliveryGuyId,
  setWaiterId,
} from "@/store/slices/order/create-order.slice";
import { StaffUser } from "@/types/staff";
import { useCallback } from "react";

interface UseSidebarActionsReturn {
  handleStaffSelect: (staff: StaffUser) => void;
  handleClientClick: () => void;
  handleDropClick: () => void;
  handleResetApp: () => void;
}

export const useSidebarActions = (
  setOpenClientDrawer: (open: boolean) => void,
  setOpenDropDrawer: (open: boolean) => void,
  setOpenStaffList: (open: boolean) => void
): UseSidebarActionsReturn => {
  const dispatch = useAppDispatch();

  const handleStaffSelect = useCallback(
    (staff: StaffUser) => {
      const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
      const isDelivery = orderType?.select_delivery_boy;

      if (isDelivery) {
        // If delivery staff, set delivery_guy_id and reset waiter_id
        dispatch(setDeliveryGuyId(staff._id));
        dispatch(setWaiterId(null));
      } else {
        // If waiter, set waiter_id and reset delivery_guy_id
        dispatch(setWaiterId(staff._id));
        dispatch(setDeliveryGuyId(null));
      }

      // Close the staff list drawer after selection
      setOpenStaffList(false);
    },
    [dispatch, setOpenStaffList]
  );

  const handleClientClick = useCallback(() => {
    setOpenClientDrawer(true);
  }, [setOpenClientDrawer]);

  const handleDropClick = useCallback(() => {
    setOpenDropDrawer(true);
  }, [setOpenDropDrawer]);

  const handleResetApp = useCallback(async () => {
    const posId = localStorage.getItem("posId");
    localStorage.removeItem("orderType");

    if (posId) {
      try {
        await dispatch(fetchGeneralData(posId));
      } catch (error) {
        console.error("Failed to fetch general data:", error);
      }
    }

    window.location.reload();
  }, [dispatch]);

  return {
    handleStaffSelect,
    handleClientClick,
    handleDropClick,
    handleResetApp,
  };
};
