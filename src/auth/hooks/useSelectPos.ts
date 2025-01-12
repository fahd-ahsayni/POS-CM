import { openDay } from "@/api/services";
import { useShift } from "@/auth/context/ShiftContext";
import { createToast } from "@/components/global/Toasters";
import { AppDispatch, RootState } from "@/store";
import { checkOpenDay } from "@/store/slices/authentication/openDaySlice";
import { fetchPosData, selectPosData } from "@/store/slices/data/posSlice";
import { User } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TOAST_MESSAGES = {
  DAY_NOT_OPEN: "Day is not open",
  UNAUTHORIZED: "Unauthorized",
  WELCOME_BACK: "Welcome back",
} as const;

interface UseSelectPosReturn {
  data: ReturnType<typeof selectPosData>;
  checkDay: boolean;
  open: boolean;
  reOpen: boolean;
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

  const userAuthenticated: User | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleOpenDay = useCallback(async () => {
    await openDay();
    window.location.reload();
  }, []);

  const handleSelectPos = useCallback(
    (id: string) => {
      if (!checkDay || !isDayOpen) {
        toast.warning(
          createToast(
            TOAST_MESSAGES.DAY_NOT_OPEN,
            "Please open the day first",
            "warning"
          )
        );
        return;
      }

      const findPos = data.pos?.find((pos) => pos._id === id);
      if (!findPos) return;

      localStorage.setItem("posId", id);

      const isAuthorizedUser =
        findPos.shift?.user_id._id === userAuthenticated?.id ||
        userAuthenticated?.position === "Manager";

      if (isAuthorizedUser) {
        setShiftId(findPos.shift?._id ?? "");
        localStorage.setItem("shiftID", findPos.shift?._id ?? "");
        toast.success(
          createToast(
            TOAST_MESSAGES.WELCOME_BACK,
            "You are authorized to use this POS",
            "success"
          )
        );

        if (findPos.shift?.status !== "opening_control") {
          navigate("/");
        } else {
          setOpen(true);
          setReOpen(true);
        }
        return;
      }

      if (findPos.shift !== null && !isAuthorizedUser) {
        toast.error(
          createToast(
            TOAST_MESSAGES.UNAUTHORIZED,
            "You are not authorized to use this POS",
            "error"
          )
        );
        return;
      }

      if (findPos.shift?.status === "opening_control") {
        toast.info(
          createToast(
            `Welcome back ${userAuthenticated?.name}`,
            "Please open the shift first",
            "info"
          )
        );
        setOpen(true);
        setReOpen(true);
        return;
      }

      if (findPos.shift === null) {
        setOpen(true);
        setReOpen(false);
      }
    },
    [data.pos, userAuthenticated, checkDay, isDayOpen, navigate, setShiftId]
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
    localStorage.removeItem("shiftID");
  }, []);

  return {
    data,
    checkDay,
    open,
    reOpen,
    setOpen,
    handleOpenDay,
    handleSelectPos,
  };
};
