import { logoWithoutText } from "@/assets";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TypographyP } from "@/components/ui/typography";
import { AnimatePresence, motion } from "framer-motion";
import { LucideMaximize, LucidePlus } from "lucide-react";
import { useEffect } from "react";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import { useRightViewContext } from "../contexts/rightViewContext";
import OrderLines from "../import/OrderLines";

export default function OrderSummary() {
  const rightViewContext = useRightViewContext();
  if (!rightViewContext) return null;

  const { customerIndex, setCustomerIndex, setSelectedCustomer } = rightViewContext;
  const { selectedProducts } = useLeftViewContext();

  useEffect(() => {
    console.log("selectedProducts", selectedProducts);
    console.log("customerIndex", customerIndex);
  }, [selectedProducts, customerIndex]);

  return (
    <div className="flex flex-col h-full gap-y-2 py-4">
      <div className="flex items-center justify-between">
        <div>
          <TypographyP className="text-sm">
            <span className="font-medium">Table 18</span>{" "}
            <span className="text-muted-foreground">{"(dining Area)"}</span>
          </TypographyP>
        </div>
        <TypographyP className="text-sm">
          <span>Order ref</span>{" "}
          <span className="text-muted-foreground">01-1423-26</span>
        </TypographyP>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <TypographyP className="text-sm font-medium">
            Order at once
          </TypographyP>
          <Switch
            id="switch-02"
            className="h-5 w-8 [&_span]:size-4 [&_span]:data-[state=checked]:translate-x-3 rtl:[&_span]:data-[state=checked]:-translate-x-3"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon">
            <LucidePlus size={16} />
            <span className="sr-only">Full screen</span>
          </Button>
          <Button size="icon">
            <LucideMaximize size={16} />
            <span className="sr-only">Full screen</span>
          </Button>
          <Button size="icon">
            <LucideMaximize size={16} />
            <span className="sr-only">Full screen</span>
          </Button>
          <Button
            onClick={() => {
              // Check if there are products for the current last customer
              const lastCustomerProducts = selectedProducts.filter(
                product => product.customer_index === customerIndex
              );

              if (selectedProducts.length > 0 && lastCustomerProducts.length > 0) {
                setCustomerIndex(customerIndex + 1);
                setSelectedCustomer(customerIndex + 1);
              }
            }}
            size="icon"
          >
            <LucidePlus size={16} />
            <span className="sr-only">add customer</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-y-2 overflow-hidden">
        <div className="flex-border flex-grow relative flex items-center justify-center mt-4 overflow-y-auto overflow-x-hidden h-full">
          <AnimatePresence>
            {selectedProducts.length < 1 && (
              <motion.img
                src={logoWithoutText}
                alt="Order Sumary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-1/2 h-auto object-contain absolute"
              />
            )}
          </AnimatePresence>
          <OrderLines />
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2">
        <Button className="flex-1" disabled={selectedProducts.length === 0}>
          Hold Order
        </Button>
        <Button className="flex-1" disabled={selectedProducts.length === 0}>
          Proceed Order
        </Button>
        <Button size="icon" variant="outline" disabled={selectedProducts.length === 0}>
          <LucideMaximize size={16} />
          <span className="sr-only">Full screen</span>
        </Button>
      </div>
    </div>
  );
}
