import { checkIsNewOrders } from "@/api/services";
import { CashWithCoinsIcon } from "@/assets/figma-icons";
import { useShift } from "@/auth/context/ShiftContext";
import Drawer from "@/components/global/Drawer";
import InputComponent from "@/components/global/InputField";
import { KeyboardProvider } from "@/components/global/keyboard/context/KeyboardContext";
import { createToast } from "@/components/global/Toasters";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypographyP } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import SelectNextCashier from "./components/ui/SelectNextCashier";
import { CurrencyQuantityData } from "./constants";
import { useCloseShift } from "./hooks/useCloseShift";

interface CloseShiftProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CloseShift({ open, setOpen }: CloseShiftProps) {
  const {
    selectedCashier,
    setSelectedCashier,
    paymentAmounts,
    openCurrencyQuantity,
    requiredNextCashier,
    currencyQuantities,
    focusedMethod,
    setFocusedMethod,
    paymentMethods,
    handleAmountChange,
    handleCurrencyQuantityChange,
    handleCurrencyIconClick,
    handleCloseShift,
    handleReset,
    handleValidate,
    isLoading,
  } = useCloseShift();
  const [isNewOrders, setIsNewOrders] = useState(false);
  const { shiftId } = useShift();

  useEffect(() => {
    const checkForNewOrders = async () => {
      if (!shiftId) {
        toast.warning(
          createToast("Shift not found", "Please refresh the page", "warning")
        );
        return;
      }

      try {
        const res = await checkIsNewOrders(shiftId);
        setIsNewOrders(res.status === 200);
      } catch (error) {
        console.error("Error checking for new orders:", error);
        setIsNewOrders(false);
      }
    };

    console.log("shiftId", shiftId);
    checkForNewOrders();
  }, [shiftId]);

  console.log("isNewOrders", isNewOrders);
  console.log("requiredNextCashier", requiredNextCashier);

  const renderPaymentMethod = (method: any) => (
    <div
      key={method._id}
      className="w-full flex items-center justify-between space-x-2"
    >
      <InputComponent
        config={{
          label: `${method.name} total amount`,
          suffix: "MAD",
          type: "number",
          placeholder: `Enter ${method.name.toLowerCase()} total amount`,
          value: paymentAmounts[method._id] || "",
          setValue: (value: string | number | null) =>
            handleAmountChange(method._id, value?.toString() || ""),
          isFocused: focusedMethod === method._id,
          onFocus: () => setFocusedMethod(method._id),
          onBlur: () => setFocusedMethod(null),
        }}
        className={method.is_cash ? "w-[90%]" : "w-full"}
      />
      {method.is_cash && (
        <div className="w-[10%] mt-6 flex items-center justify-end">
          <Button
            variant="link"
            className="w-full"
            onClick={handleCurrencyIconClick}
          >
            <CashWithCoinsIcon className="w-auto h-6 dark:fill-white fill-primary-black" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <KeyboardProvider>
      <Drawer
        open={open}
        setOpen={setOpen}
        title="End Shift"
        classNames={cn(
          "transition-all duration-300",
          openCurrencyQuantity ? "max-w-[800px]" : "max-w-[500px]"
        )}
      >
        <div className="h-full overflow-hidden w-full relative">
          <TypographyP className="text-[0.8rem] max-w-lg">
            Count your cash and enter totals for each denomination, then
            continue to add other payment methods.
          </TypographyP>
          <div className="flex h-full mt-8">
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="relative z-0 flex flex-1 overflow-hidden space-x-8">
                <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
                  {/* Start main area*/}
                  <div className="absolute inset-0">
                    <div
                      className={cn(
                        "flex flex-col h-full justify-between",
                        openCurrencyQuantity ? "pr-6" : ""
                      )}
                    >
                      <div className="space-y-6 h-full relative px-1">
                        {(isNewOrders || requiredNextCashier)  && (
                          <SelectNextCashier
                            selectedPerson={selectedCashier}
                            setSelectedPerson={setSelectedCashier}
                          />
                        )}

                        {paymentMethods.map(renderPaymentMethod)}
                        <div className="absolute bottom-20 left-0 w-full">
                          <Button className="w-full" onClick={handleCloseShift}>
                            {isLoading ? (
                              <BeatLoader color="#fff" size={10} />
                            ) : (
                              "End Shift"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End main area */}
                </main>
                {openCurrencyQuantity && (
                  <>
                    <Separator orientation="vertical" />
                    <motion.aside
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-72 flex-shrink-0 overflow-y-auto xl:flex xl:flex-col"
                    >
                      {/* Start secondary column (hidden on smaller screens) */}
                      <div className="absolute inset-0 h-full space-y-4">
                        {CurrencyQuantityData.map((item) => (
                          <div
                            key={item.value}
                            className="flex items-center justify-between space-x-2"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-12 flex items-center justify-center">
                                <img
                                  src={item.img}
                                  alt={item.placeholder}
                                  className={item.className}
                                />
                              </div>
                              <InputComponent
                                config={{
                                  placeholder: item.placeholder,
                                  type: "number",
                                  value: currencyQuantities[item.value] || "",
                                  setValue: (value) =>
                                    handleCurrencyQuantityChange(
                                      item.value,
                                      value
                                    ),
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-[4.12rem] left-0 w-full p-4 flex items-center space-x-4 dark:bg-secondary-black bg-secondary-white">
                        <Button
                          variant="secondary"
                          className="w-full bg-white dark:bg-accent-white/10"
                          onClick={handleReset}
                        >
                          Reset
                        </Button>
                        <Button className="w-full" onClick={handleValidate}>
                          Validate
                        </Button>
                      </div>
                    </motion.aside>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </KeyboardProvider>
  );
}
