import { checkIsNewOrders } from "@/api/services";
import { CashWithCoinsIcon } from "@/assets/figma-icons";
import Drawer from "@/components/global/Drawer";
import InputComponent from "@/components/global/InputComponent";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { memo, useCallback, useEffect, useId, useState } from "react";
import { BeatLoader } from "react-spinners";
import { CurrencyQuantityData } from "./constants";
import { useCloseShift } from "./hooks/useCloseShift";
// Import the global virtual keyboard context hook
import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";

interface CloseShiftProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CloseShift = memo(({ open, setOpen }: CloseShiftProps) => {
  const {
    selectedCashier,
    setSelectedCashier,
    paymentAmounts,
    openCurrencyQuantity,
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
    availableCashiers,
  } = useCloseShift();
  const [isNewOrders, setIsNewOrders] = useState(false);
  const selectId = useId();

  // Remove local keyboard state variables for active input and showKeyboard.
  // Instead, we'll use the global context.
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  // Get the global virtual keyboard functions and active input from context.
  const { activeInput, openKeyboard } = useVirtualKeyboard();

  useEffect(() => {
    const checkForNewOrders = async () => {
      const shiftId = localStorage.getItem("shiftId");
      if (!shiftId) return;

      try {
        const res = await checkIsNewOrders(shiftId);
        setIsNewOrders(res.status === 200);
      } catch (error) {
        console.error("Error checking for new orders:", error);
        setIsNewOrders(false);
      }
    };

    checkForNewOrders();
  }, [open]);

  /**
   * This callback will be passed to the global virtual keyboard.
   * It uses the active input from the global context.
   */
  const handleKeyboardKeyPress = (key: string) => {
    if (!activeInput) return;

    // Determine if the active input is a currency quantity input.
    const isCurrency = activeInput.startsWith("currency_");
    let currentValue = isCurrency
      ? (currencyQuantities[Number(activeInput.replace("currency_", ""))]?.toString() || "")
      : (paymentAmounts[activeInput]?.toString() || "");

    if (key === "Backspace") {
      if (cursorPosition > 0) {
        currentValue =
          currentValue.slice(0, cursorPosition - 1) +
          currentValue.slice(cursorPosition);
      }
    } else if (key === "BackspaceLongPress") {
      currentValue = "";
    } else {
      currentValue =
        currentValue.slice(0, cursorPosition) +
        key +
        currentValue.slice(cursorPosition);
    }

    if (isCurrency) {
      const currencyKey = Number(activeInput.replace("currency_", ""));
      handleCurrencyQuantityChange(currencyKey, currentValue);
    } else {
      handleAmountChange(activeInput, currentValue);
    }
    setCursorPosition(cursorPosition + (key.length || 0));
  };

  /**
   * Render each payment method input. On focus, call openKeyboard() from the global context.
   */
  const renderPaymentMethod = useCallback(
    (method: any) => (
      <div
        key={method._id}
        className="w-full flex items-center justify-between space-x-2"
      >
        <InputComponent
          config={{
            label: `${method.name} total amount`,
            suffix: "MAD",
            type: "text",
            placeholder: `Enter ${method.name.toLowerCase()} total amount`,
            value: paymentAmounts[method._id]?.toString() || "",
            setValue: (value: string | number | null) =>
              handleAmountChange(method._id, value?.toString() || ""),
            isFocused: focusedMethod === method._id,
            onFocus: () => {
              setFocusedMethod(method._id);
              // Open the global virtual keyboard for this input.
              openKeyboard(method._id, handleKeyboardKeyPress);
            },
            onBlur: () => {
              setFocusedMethod(null);
            },
            onSelect: (e) => {
              const selectionStart =
                (e.target as HTMLInputElement).selectionStart || 0;
              setCursorPosition(selectionStart);
            },
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
    ),
    [
      paymentAmounts,
      focusedMethod,
      handleAmountChange,
      setFocusedMethod,
      handleCurrencyIconClick,
      openKeyboard,
      handleKeyboardKeyPress,
    ]
  );

  const drawerClassNames = cn(
    "transition-all duration-300",
    openCurrencyQuantity ? "max-w-[800px]" : "max-w-[500px]"
  );

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      title="End Shift"
      classNames={cn(drawerClassNames, "px-3")}
      description="Count your cash and enter totals for each denomination, then continue to add other payment methods."
    >
      <div className="h-full overflow-hidden w-full relative">
        <div className="flex h-full mt-8">
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <div className="relative z-0 flex flex-1 overflow-hidden space-x-8">
              <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
                {/* Start main area */}
                <div className="absolute inset-0">
                  <div
                    className={cn(
                      "flex flex-col h-full justify-between",
                      openCurrencyQuantity ? "pr-6" : ""
                    )}
                  >
                    <div className="space-y-6 h-full relative px-1">
                      {isNewOrders && (
                        <div className="space-y-1">
                          <Label className="pl-1" htmlFor={selectId}>
                            Select next cashier
                          </Label>
                          <Select
                            value={selectedCashier?._id || ""}
                            onValueChange={(value) => {
                              const cashier = availableCashiers.find(
                                (c) => c._id === value
                              );
                              setSelectedCashier(cashier || null);
                            }}
                          >
                            <SelectTrigger className="w-full" id={selectId}>
                              <SelectValue placeholder="Select next cashier" />
                            </SelectTrigger>
                            <SelectContent className="w-52">
                              {availableCashiers.map((cashier) => (
                                <SelectItem
                                  key={cashier._id}
                                  value={cashier._id}
                                >
                                  {cashier.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {paymentMethods.map(renderPaymentMethod)}
                      <div className="absolute bottom-20 left-0 w-full">
                        <Button
                          className="w-full"
                          onClick={handleCloseShift}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <BeatLoader color="#FB0000" size={8} />
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
                    {/* Secondary column for currency quantities */}
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
                                  handleCurrencyQuantityChange(item.value, value),
                                onFocus: () => {
                                  // Open the global virtual keyboard for this currency input.
                                  openKeyboard("currency_" + item.value, handleKeyboardKeyPress);
                                },
                                onSelect: (e) => {
                                  const selectionStart = (e.target as HTMLInputElement).selectionStart || 0;
                                  setCursorPosition(selectionStart);
                                },
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
      {/* The VirtualKeyboard is rendered globally via a portal */}
    </Drawer>
  );
});

CloseShift.displayName = "CloseShift";

export default CloseShift;
