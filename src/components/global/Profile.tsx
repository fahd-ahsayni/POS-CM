import { logoutService } from "@/api/services";
import { unknownUser } from "@/assets";
import { DisplayIcon } from "@/assets/figma-icons";
import CloseShift from "@/auth/CloseShift";
import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/catalyst/dropdown";
import { ALL_CATEGORIES_VIEW } from "@/components/views/home/left-section/constants";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { TYPE_OF_ORDER_VIEW } from "@/components/views/home/right-section/constants";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { PosData } from "@/interfaces/pos";
import { truncateName } from "@/lib/utils";
import { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/slices/authentication/auth.slice";
import { fetchGeneralData } from "@/store/slices/data/general-data.slice";
import { fetchPosData } from "@/store/slices/data/pos.slice";
import {
  resetOrder,
  resetStaffIds,
} from "@/store/slices/order/create-order.slice";
import * as Headless from "@headlessui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { ChevronDown, LogOut, Power } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarImage } from "../ui/avatar";
import { TypographySmall } from "../ui/typography";
import {
  isCustomerDisplayOpen,
  openCustomerDisplay,
} from "./customer-display/useCustomerDisplay";
import { useNavigate } from "react-router-dom"; // added import

interface UserData {
  id: string;
  name: string;
  image?: string;
  position: string;
}

export default function Profile() {
  const [open, setOpen] = useState(false);
  const [currentPos, setCurrentPos] = useState<PosData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const pos = useSelector((state: RootState) => state.pos.data.pos);
  const posFromLocalStorage = JSON.parse(localStorage.getItem("pos") || "{}");
  const navigate = useNavigate(); // added
  const isWaiter = user?.position === "Waiter";

  const rightViewContext = useRightViewContext();
  const leftViewContext = useLeftViewContext();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}") as UserData;
    setUser(user);
    dispatch(fetchPosData());
  }, [dispatch]);

  useEffect(() => {
    if (pos && user?.id) {
      const currentPos = pos.find(
        (p: PosData) => p.shift?.user_id?._id === user.id
      );
      setCurrentPos(currentPos || posFromLocalStorage);
    }
  }, [pos, user]);

  const resetAppState = useCallback(async () => {
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

    // Reset Redux Store
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

  const handleLogout = useCallback(() => {
    // Reset the app state before logging out
    resetAppState();

    // Perform logout actions
    dispatch(logout());
    logoutService();

    // Navigate to the login page after logout
    navigate("/login");
  }, [dispatch, resetAppState, navigate]);

  const handleCustomerDisplay = () => {
    if (!isCustomerDisplayOpen()) {
      openCustomerDisplay();
    }
  };

  return (
    <>
      {!isWaiter && <CloseShift open={open} setOpen={setOpen} />}
      <Dropdown>
        <Headless.MenuButton
          className="flex items-center gap-3 rounded-xl border border-transparent"
          aria-label="Account options"
        >
          <Avatar className="rounded-lg">
            <AvatarImage
              src={
                user?.image
                  ? `${import.meta.env.VITE_BASE_URL}${user?.image}`
                  : unknownUser
              }
            />
          </Avatar>
          <div className="md:flex hidden flex-col justify-center items-start">
            <TypographySmall className="font-medium capitalize">
              {truncateName(user?.name ?? "", 20)}
            </TypographySmall>
            <TypographySmall className="text-xs text-neutral-dark-grey">
              {user?.position}
            </TypographySmall>
          </div>
          <ChevronDown
            size={20}
            strokeWidth={1.5}
            className="ml-auto mr-1 size-4 shrink-0 stroke-zinc-400"
            aria-hidden="true"
          />
        </Headless.MenuButton>

        <DropdownMenu className="min-w-[--button-width] z-[9999] p-2 -ml-10">
          <DropdownHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-zinc-800 dark:text-white flex-1">
                {currentPos?.name || ""}
              </div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 flex-1 text-end">
                {currentPos?.shift?.opening_time
                  ? formatDistanceToNowStrict(
                      new Date(currentPos.shift.opening_time),
                      {
                        addSuffix: false,
                        roundingMethod: "floor",
                      }
                    )
                      .replace(" minutes", "m")
                      .replace(" minute", "m")
                      .replace(" hours", "h")
                      .replace(" hour", "h") + " ago"
                  : ""}
              </div>
            </div>
          </DropdownHeader>

          <DropdownItem onClick={handleCustomerDisplay}>
            <DisplayIcon className="opacity-60" aria-hidden="true" />
            <DropdownLabel className="pl-2">Customer Display</DropdownLabel>
          </DropdownItem>

          <DropdownDivider />

          {!isWaiter && (
            <DropdownItem onClick={() => setOpen(true)}>
              <Power size={17} className="opacity-60" aria-hidden="true" />
              <DropdownLabel className="pl-2">End Shift</DropdownLabel>
            </DropdownItem>
          )}

          <DropdownItem onClick={handleLogout}>
            <LogOut
              size={17}
              className="opacity-60 text-primary-red"
              aria-hidden="true"
            />
            <DropdownLabel className="pl-2 text-primary-red">
              Logout
            </DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
