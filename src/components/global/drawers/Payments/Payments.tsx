import { Dhs100, Dhs20, Dhs200, Dhs50 } from "@/assets/Dhs";
import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  TypographyH1,
  TypographyH2,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences/index";
import { selectOrder } from "@/store/slices/order/createOrder";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Drawer from "../../Drawer";
import { usePayments } from "./hooks/usePayments";

interface PaymentMethod {
  _id: string;
  name: string;
  amount: number;
}

interface PaymentsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onComplete?: (payments: PaymentMethod[]) => void;
}

export default function Payments({ open, setOpen, onComplete }: PaymentsProps) {
  const {
    paymentMethods,
    selectedPayments,
    currentAmount,
    isProcessing,
    activePaymentIndex,
    getTotalPaidAmount,
    getRemainingAmount,
    setActivePaymentIndex,
    setCurrentAmount,
    handlePaymentMethodSelect,
    handleAmountInput,
    handleQuickAmount,
    removePaymentMethod,
    handleComplete,
    resetPayments,
  } = usePayments({ onComplete });

  const order = useSelector(selectOrder);

  useEffect(() => {
    if (!open) {
      resetPayments();
    }
  }, [open]);

  const getPaymentStatus = () => {
    const totalPaid = getTotalPaidAmount();
    const difference = totalPaid - order.total_amount;

    if (difference === 0) {
      return <span className="text-success-color">Exact amount</span>;
    } else if (difference > 0) {
      return (
        <span className="text-success-color">
          Overpaid {difference.toFixed(currency.toFixed || 2)} {currency.symbol}
        </span>
      );
    }
    return (
      <span className="text-error-color">
        Remaining {Math.abs(difference).toFixed(currency.toFixed || 2)}{" "}
        {currency.symbol}
      </span>
    );
  };

  return (
    <Drawer
      open={open}
      setOpen={setOpen}
      title="Complete Payment"
      classNames="max-w-[780px]"
    >
      <div className="flex items-center justify-center h-full">
        <div className="w-5/12 h-full pr-4 flex flex-col gap-2">
          <AnimatePresence>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <div key={method._id}>
                  <Card
                    onClick={() => handlePaymentMethodSelect(method)}
                    className="h-16 flex items-center justify-start px-4 cursor-pointer dark:bg-primary-black bg-neutral-bright-grey dark:border-white/20 border-primary-black/20"
                  >
                    <TypographyP className="text-lg font-medium">
                      {method.name}
                    </TypographyP>
                  </Card>
                </div>
              ))
            ) : (
              <TypographyP>No payment methods available</TypographyP>
            )}
          </AnimatePresence>
        </div>

        <Separator orientation="vertical" />

        <div className="w-7/12 h-full pl-6 flex flex-col justify-between">
          <div className="w-full flex flex-col items-start justify-center h-[65%]">
            <div className="flex flex-col w-full items-center justify-center">
              <TypographySmall className="dark:text-white/50 text-primary-black/50 mb-2">
                Total Amount
              </TypographySmall>
              <TypographyH2 className="text-center font-semibold">
                {order.total_amount.toFixed(currency.toFixed || 2)}{" "}
                {currency.symbol}
              </TypographyH2>
              <TypographyP className="text-center mt-2">
                {getPaymentStatus()}
              </TypographyP>
            </div>

            <div className="w-full flex items-center justify-center mt-12">
              <div className="flex-1 flex items-start justify-center">
                <NumberPad
                  onNumberClick={(value) => {
                    if (
                      paymentMethods.length > 0 &&
                      selectedPayments.length === 0
                    ) {
                      // Handle the first selection with the amount clicked
                      handlePaymentMethodSelect(paymentMethods[0], value);
                      setCurrentAmount(value); // Update the current amount
                    } else {
                      handleAmountInput(value); // Normal input handling
                    }
                  }}
                  fixLightDark={true}
                />
              </div>
              <div className="flex-2 h-full flex flex-col justify-between items-center gap-4">
                {[
                  { amount: 200, image: Dhs200 },
                  { amount: 100, image: Dhs100 },
                  { amount: 50, image: Dhs50 },
                  { amount: 20, image: Dhs20 },
                ].map(({ amount, image }) => (
                  <button
                    key={amount}
                    onClick={() => {
                      if (
                        paymentMethods.length > 0 &&
                        selectedPayments.length === 0
                      ) {
                        // Handle the first selection with the quick amount
                        handlePaymentMethodSelect(
                          paymentMethods[0],
                          amount.toString()
                        );
                        setCurrentAmount(amount.toString()); // Update the current amount
                      } else {
                        handleQuickAmount(amount); // Normal quick amount handling
                      }
                    }}
                    className="transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    <img
                      src={image}
                      alt={`Add ${amount} ${currency.symbol}`}
                      title={`Add ${amount} ${currency.symbol}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[30%] overflow-y-auto flex flex-col items-center justify-center mt-[5%] px-1">
            {selectedPayments.length > 0 ? (
              <AnimatePresence>
                {selectedPayments.map((payment, index) => (
                  <motion.div
                    key={payment._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full"
                  >
                    <Card
                      className={cn(
                        "p-2 h-12 mb-2",
                        "dark:!bg-primary-black bg-neutral-bright-grey rounded-md",
                        "flex items-center justify-between px-4",
                        "dark:!border-neutral-dark-grey/30",
                        "cursor-pointer",
                        "hover:bg-neutral-100 dark:hover:bg-primary-black/80",
                        index === activePaymentIndex &&
                          "ring-1 ring-primary-red border-none"
                      )}
                      onClick={() => {
                        setActivePaymentIndex(index);
                        setCurrentAmount(payment.amount.toString());
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <TypographyP className="font-medium">
                          {payment.name}
                        </TypographyP>
                      </div>
                      <div className="flex items-center gap-4">
                        <TypographyP className="font-medium">
                          {payment.amount.toFixed(currency.toFixed || 2)}{" "}
                          {currency.symbol}
                        </TypographyP>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePaymentMethod(payment._id);
                          }}
                          className="p-1 hover:bg-neutral-100 rounded-full 
                           dark:hover:bg-primary-black/80"
                        >
                          <X className="h-5 w-5 text-primary-red" />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TypographyP className="text-[.8rem] font-light max-w-[15rem] text-center mx-auto dark:text-white/50 text-primary-black/50">
                  Select a payment method and enter the amount to settle the
                  order.
                </TypographyP>
              </motion.span>
            )}
          </div>

          <div className="px-1">
            <Button
              className="w-full"
              disabled={isProcessing}
              onClick={handleComplete}
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
