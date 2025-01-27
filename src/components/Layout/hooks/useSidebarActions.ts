import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { TYPE_OF_ORDER_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { useAppDispatch } from "@/store/hooks";
import { fetchGeneralData } from "@/store/slices/data/general-data.slice";
import {
  resetOrder,
  resetStaffIds,
  setDeliveryGuyId,
  setWaiterId,
} from "@/store/slices/order/create-order.slice";
import { StaffUser } from "@/interfaces/staff";
import { useCallback } from "react";

interface UseSidebarActionsReturn {
  handleStaffSelect: (staff: StaffUser) => void;
  handleClientClick: () => void;
  handleDropClick: () => void;
  handleResetApp: () => void;
}

export const useSidebarActions = (
  setOpenClientDrawer: (open: boolean) => void,
  setOpenDropDrawer: (open: boolean) => void
): UseSidebarActionsReturn => {
  const dispatch = useAppDispatch();
  const rightViewContext = useRightViewContext();
  const leftViewContext = useLeftViewContext();

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
    },
    [dispatch]
  );

  const handleClientClick = useCallback(() => {
    setOpenClientDrawer(true);
  }, [setOpenClientDrawer]);

  const handleDropClick = useCallback(() => {
    setOpenDropDrawer(true);
  }, [setOpenDropDrawer]);

  const handleResetApp = useCallback(async () => {
    const posId = localStorage.getItem("posId");

    // Clear localStorage items
    localStorage.removeItem("orderType");
    localStorage.removeItem("loadedOrder");
    localStorage.removeItem("generalData");

    // Reset Right View Context
    rightViewContext.setViews(TYPE_OF_ORDER_VIEW);
    rightViewContext.setSelectedOrderType(null);
    rightViewContext.setCustomerIndex(1);
    rightViewContext.setTableNumber("");
    rightViewContext.setOrderType(null);

    // Reset Left View Context
    leftViewContext.setViews(ALL_CATEGORIES_VIEW);
    leftViewContext.setSelectedProducts([]);
    leftViewContext.setOpenDrawerVariants(false);
    leftViewContext.setSelectedProduct(null);
    leftViewContext.setQuantityPerVariant(0);
    leftViewContext.setCategory(null);
    leftViewContext.setSubCategory(null);
    leftViewContext.setOpenDrawerCombo(false);
    leftViewContext.setSelectedCombo(null);
    leftViewContext.setCurrentMenu(null);
    leftViewContext.setBreadcrumbs([]);

    // Reset Redux Store - Do this before fetching new data
    dispatch(resetOrder());
    dispatch(resetStaffIds());

    // Fetch fresh general data if posId exists
    if (posId) {
      try {
        // Initialize with empty data before fetching
        const emptyData = {
          floors: [],
          configs: [],
          defineNote: [],
          orderTypes: [],
          discount: [],
          paymentMethods: [],
          waiters: [],
          livreurs: [],
        };
        localStorage.setItem("generalData", JSON.stringify(emptyData));

        // Fetch new data
        await dispatch(fetchGeneralData(posId)).unwrap();
      } catch (error) {
        console.error("Failed to fetch general data:", error);
        // Ensure we still have empty data if fetch fails
        const emptyData = {
          floors: [],
          configs: [],
          defineNote: [],
          orderTypes: [],
          discount: [],
          paymentMethods: [],
          waiters: [],
          livreurs: [],
        };
        localStorage.setItem("generalData", JSON.stringify(emptyData));
      }
    }
  }, [dispatch, rightViewContext, leftViewContext]);

  return {
    handleStaffSelect,
    handleClientClick,
    handleDropClick,
    handleResetApp,
  };
};
