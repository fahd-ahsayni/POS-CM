import { openDay } from "@/api/services";
import { useShift } from "@/auth/context/ShiftContext";
import { createToast } from "@/components/global/Toasters";
import { updateOrder } from "@/functions/updateOrder";
import { AppDispatch, RootState } from "@/store";
import { checkOpenDay } from "@/store/slices/authentication/open.day.slice";
import { fetchGeneralData } from "@/store/slices/data/general-data.slice";
import { fetchPosData, selectPosData } from "@/store/slices/data/pos.slice";
import { PosData } from "@/interfaces/pos";
import { User } from "@/interfaces/user";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

enum ToastMessages {
  DAY_NOT_OPEN = "Day is not open",
  UNAUTHORIZED = "Unauthorized",
  WELCOME_BACK = "Welcome back",
}

interface UseSelectPosReturn {
  data: ReturnType<typeof selectPosData>;
  checkDay: boolean;
  open: boolean;
  reOpen: boolean;
  isLoading: boolean;
  setOpen: (value: boolean) => void;
  handleOpenDay: () => Promise<void>;
  handleSelectPos: (id: string) => void;
}

export const useSelectPos = (): UseSelectPosReturn => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen: isDayOpen } = useSelector(
    (state: RootState) => state.dayStatus
  );
  const data = useSelector(selectPosData);
  const { setShiftId } = useShift();

  const [checkDay, setCheckDay] = useState(false);
  const [open, setOpen] = useState(false);
  const [reOpen, setReOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userAuthenticated: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleOpenDay = useCallback(async () => {
    try {
      setIsLoading(true);
      await openDay();
      window.location.reload();
    } catch (error) {
      toast.error("Failed to open day");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectPos = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);

        if (!checkDay || !isDayOpen) {
          toast.warning(
            createToast(
              ToastMessages.DAY_NOT_OPEN,
              "Please open the day first",
              "warning"
            )
          );
          return;
        }

        const selectedPos = data.pos?.find((pos: PosData) => pos._id === id);
        if (!selectedPos) {
          throw new Error("POS not found");
        }

        localStorage.setItem("posId", id);
        localStorage.setItem("pos", JSON.stringify(selectedPos));
        localStorage.setItem("shiftId", selectedPos?.shift?._id || "");

        const isAuthorizedUser =
          selectedPos.shift?.user_id._id === userAuthenticated?.id ||
          userAuthenticated?.position === "Manager";

        if (selectedPos.shift?.status === "opening_control") {
          if (!isAuthorizedUser) {
            throw new Error("Unauthorized");
          }
          setShiftId(selectedPos.shift._id);
          localStorage.setItem("shiftId", selectedPos.shift._id);
          setOpen(true);
          setReOpen(true);
          return;
        }

        if (selectedPos.shift?.status === "open") {
          if (!isAuthorizedUser) {
            throw new Error("Unauthorized");
          }
          setShiftId(selectedPos.shift._id);
          localStorage.setItem("shiftId", selectedPos.shift._id);
          dispatch(updateOrder({ shift_id: selectedPos.shift._id }));

          // Wait for general data to be loaded before navigation
          const generalDataResponse = await dispatch(
            fetchGeneralData(id)
          ).unwrap();
          localStorage.setItem(
            "generalData",
            JSON.stringify(generalDataResponse)
          );

          navigate("/");
          return;
        }

        if (!selectedPos.shift) {
          setOpen(true);
          setReOpen(false);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "An error occurred while selecting POS";
        toast.error(
          createToast(
            message === "Unauthorized" ? ToastMessages.UNAUTHORIZED : "Error",
            message === "Unauthorized"
              ? "You are not authorized to use this POS"
              : message,
            "error"
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      data.pos,
      userAuthenticated,
      checkDay,
      isDayOpen,
      navigate,
      setShiftId,
      dispatch,
    ]
  );

  useEffect(() => {
    dispatch(checkOpenDay());
    setCheckDay(isDayOpen ?? false);
  }, [dispatch, isDayOpen]);

  useEffect(() => {
    dispatch(fetchPosData());
  }, [dispatch]);

  useEffect(() => {
    localStorage.removeItem("posId");
  }, []);

  return {
    data,
    checkDay,
    open,
    reOpen,
    isLoading,
    setOpen,
    handleOpenDay,
    handleSelectPos,
  };
};
