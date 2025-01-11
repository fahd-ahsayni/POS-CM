import { Dhs100, Dhs20, Dhs200, Dhs50 } from "@/assets/Dhs";
import NumberPad from "@/components/global/NumberPad";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  TypographyH2,
  TypographyP,
  TypographySmall,
} from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { currency } from "@/preferences/index";
import { selectOrder } from "@/store/slices/order/createOrder";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import type { Swiper as SwiperType } from "swiper";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
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
  onComplete?: (payments: PaymentMethod[]) => Promise<void>;
}

export default function Payments({ open, setOpen, onComplete }: PaymentsProps) {
  const {
    paymentMethods,
    selectedPayments,
    isProcessing,
    activePaymentIndex,
    getTotalPaidAmount,
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

  const swiperRef = useRef<SwiperType>();
  const isManualSwipe = useRef(false);

  useEffect(() => {
    if (!open) {
      resetPayments();
    }
  }, [open]);

  useEffect(() => {
    if (
      swiperRef.current &&
      selectedPayments.length > 0 &&
      !isManualSwipe.current
    ) {
      swiperRef.current.slideTo(selectedPayments.length - 1, 0);
    }
    // Reset the manual swipe flag
    isManualSwipe.current = false;
  }, [selectedPayments.length]);

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
      classNames="max-w-[700px]"
    >
      <div className="flex items-center justify-center h-full gap-6">
        <div className="w-5/12 h-full pr-3 flex flex-col gap-3">
          <AnimatePresence>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <div key={method._id}>
                  <Card
                    onClick={() => handlePaymentMethodSelect(method)}
                    className="h-[3.5rem] rounded-md flex items-center justify-start px-6 cursor-pointer dark:bg-primary-black bg-neutral-bright-grey dark:border-white/20 border-primary-black/20"
                  >
                    <TypographyP className="font-medium">
                      {method.name}
                    </TypographyP>
                  </Card>
                </div>
              ))
            ) : (
              <TypographyP className="text-sm">
                No payment methods available
              </TypographyP>
            )}
          </AnimatePresence>
        </div>

        <Separator orientation="vertical" className="h-[90%]" />

        <div className="w-7/12 h-full pl-2 flex flex-col justify-between gap-6">
          <div className="w-full flex flex-col items-start justify-center h-[70%]">
            <div className="flex flex-col w-full items-center justify-center">
              <TypographySmall className="dark:text-white/50 text-primary-black/50 mb-0.5 text-xs">
                Total Amount
              </TypographySmall>
              <TypographyH2 className="text-center font-semibold">
                {order.total_amount.toFixed(currency.toFixed || 2)}{" "}
              </TypographyH2>
              <TypographyP className="text-center text-sm mt-0.5">
                {getPaymentStatus()}
              </TypographyP>
            </div>

            <div className="w-full flex items-center justify-center mt-6 gap-x-8">
              <div className="flex items-start justify-center">
                <NumberPad
                  onNumberClick={(value) => {
                    if (
                      paymentMethods.length > 0 &&
                      selectedPayments.length === 0 &&
                      value !== "C" &&
                      value !== "delete"
                    ) {
                      // Handle the first selection with the amount clicked
                      handlePaymentMethodSelect(paymentMethods[0], value);
                      setCurrentAmount(value);
                    } else {
                      handleAmountInput(value);
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
                    className="transition-transform hover:scale-[0.98] duration-200 disabled:opacity-50 flex items-center justify-center h-full"
                  >
                    <img
                      src={image}
                      className="h-[2.75rem] w-auto"
                      alt={`Add ${amount} ${currency.symbol}`}
                      title={`Add ${amount} ${currency.symbol}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-[30%] overflow-y-auto flex flex-col items-center justify-center mt-2 py-1">
            {selectedPayments.length > 0 ? (
              <AnimatePresence>
                <Swiper
                  direction="vertical"
                  slidesPerView={3}
                  spaceBetween={8}
                  modules={[Pagination]}
                  className="w-full h-full"
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  onSliderMove={() => {
                    // Set flag when user manually swipes
                    isManualSwipe.current = true;
                  }}
                >
                  {selectedPayments.map((payment, index) => (
                    <SwiperSlide key={payment._id}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="w-full px-2 py-1"
                      >
                        <Card
                          className={cn(
                            "p-2.5 h-12 mb-2",
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
                    </SwiperSlide>
                  ))}
                </Swiper>
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

          <div className="px-2">
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
