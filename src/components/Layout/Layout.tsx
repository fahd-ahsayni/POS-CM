import { extractProducts } from "@/functions/extractProducts";
import { getAllVariants } from "@/functions/getAllVariants";
import { updateOrder } from "@/functions/updateOrder";
import { AppDispatch, RootState } from "@/store";
import { fetchGeneralData } from "@/store/slices/data/generalDataSlice";
import { fetchPosData } from "@/store/slices/data/posSlice";
import { setShiftId } from "@/store/slices/order/createOrder";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import Keyboard from "../global/keyboard/Keyboard";
import { LoadingFullScreen } from "../global/loading";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const generalStatus = useSelector(
    (state: RootState) => state.generalData.status,
    shallowEqual
  );
  const generalError = useSelector(
    (state: RootState) => state.generalData.error,
    shallowEqual
  );

  const [isLoading, setIsLoading] = useState(true);
  const [hasShiftId, setHasShiftId] = useState(
    !!localStorage.getItem("shiftId")
  );

  useEffect(() => {
    const posId = localStorage.getItem("posId");
    if (posId) {
      dispatch(fetchGeneralData(posId));
      dispatch(fetchPosData());
    } else {
      navigate("/select-pos");
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const generalData = localStorage.getItem("generalData");
    if (generalData) {
      const parsedData = JSON.parse(generalData);

      localStorage.setItem("variants", JSON.stringify(getAllVariants()));

      if (parsedData?.categories) {
        localStorage.setItem(
          "products",
          JSON.stringify(extractProducts(parsedData.categories))
        );
      }
    }
  }, []);

  useEffect(() => {
    if (generalStatus === "failed") {
      navigate("/login");
    }
  }, [generalStatus, navigate]);

  const handleUpdateOrder = useCallback(() => {
    const shiftId = localStorage.getItem("shiftId");
    if (!shiftId) return;

    setIsLoading(true);
    try {
      dispatch(setShiftId(shiftId));
      Promise.resolve(dispatch(updateOrder({ shift_id: shiftId })))
        .catch(error => console.error('Error updating order:', error))
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    const shiftId = localStorage.getItem("shiftId");
    if (shiftId) {
      setHasShiftId(true);
      handleUpdateOrder();
    } else {
      const checkShiftId = setInterval(() => {
        const newShiftId = localStorage.getItem("shiftId");
        if (newShiftId) {
          setHasShiftId(true);
          handleUpdateOrder();
          clearInterval(checkShiftId);
        }
      }, 1000);

      return () => clearInterval(checkShiftId);
    }
  }, [handleUpdateOrder]);

  useEffect(() => {
    const isFirstRender = localStorage.getItem("firstRender");

    if (!isFirstRender) {
      setTimeout(() => {
        localStorage.setItem("firstRender", "true");
        setIsLoading(false);
      }, 2000);
    } else {
      setIsLoading(false);
    }
  }, []);

  const content = useMemo(
    () => (
      <div className="flex relative w-screen h-screen overflow-hidden">
        <Keyboard />
        <div
          className="absolute rounded-full -top-52 -right-52 w-[400px] h-[400px] bg-red-600 blur-3xl opacity-30"
          aria-hidden="true"
        />
        <main className="flex flex-1 flex-col relative z-10">
          <Navbar />
          <div className="flex flex-1 items-stretch overflow-y-hidden">
            <Outlet />
          </div>
        </main>
        <Sidebar />
      </div>
    ),
    []
  );

  if (isLoading || !hasShiftId) {
    return <LoadingFullScreen />;
  }

  if (generalError) {
    return <div>Error: {generalError}</div>;
  }

  return content;
};

export default memo(Layout);
