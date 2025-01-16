import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { StaffUser } from "@/types/staff";
import {
  setWaiterId,
  setDeliveryGuyId,
} from "@/store/slices/order/create-order.slice";

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
  const dispatch = useDispatch();

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

  const handleResetApp = useCallback(() => {
    localStorage.removeItem("orderType");
    window.location.reload();
  }, []);

  return {
    handleStaffSelect,
    handleClientClick,
    handleDropClick,
    handleResetApp,
  };
};
