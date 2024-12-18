import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { ChevronDown, LucideAirplay } from "lucide-react";
import { useLeftViewContext } from "../../left-section/contexts/leftViewContext";
import { TypographyP } from "@/components/ui/typography";
import CardOrderSummary from "./CardOrderSummary";

export default function OrderLines() {
  const { selectedProducts } = useLeftViewContext();
  const [openValues, setOpenValues] = useState<string[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<Record<string, any[]>>(
    {}
  );

  useEffect(() => {
    // Group products by customer_index
    const grouped = selectedProducts.reduce(
      (acc: Record<number, any[]>, product) => {
        const { customer_index } = product;
        if (!acc[customer_index]) {
          acc[customer_index] = [];
        }
        acc[customer_index].push(product);
        return acc;
      },
      {} as Record<number, any[]>
    );
    setGroupedProducts(grouped);

    // Open all groups initially
    setOpenValues(Object.keys(grouped));
  }, [selectedProducts]);

  const handleToggle = (value: string) => {
    setOpenValues((prevOpenValues) =>
      prevOpenValues.includes(value)
        ? prevOpenValues.filter((id) => id !== value)
        : [...prevOpenValues, value]
    );
  };

  return (
    <div className="z-10 h-full w-full">
      <div className="space-y-4"></div>
      <Accordion
        type="multiple"
        className="w-full"
        value={openValues}
        onValueChange={setOpenValues}
      >
        {Object.entries(groupedProducts).map(([customerIndex, products]) => (
          <AccordionItem value={customerIndex} key={customerIndex} className="">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger
                className="flex dark:bg-zinc-800 bg-white py-2 flex-1 items-center justify-between text-left text-[15px] font-semibold leading-6 px-2 rounded-md"
                onClick={() => handleToggle(customerIndex)}
              >
                <span className="flex items-center gap-3">
                  <LucideAirplay
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 opacity-60"
                    aria-hidden="true"
                  />
                  <span>Customer {customerIndex}</span>
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className="shrink-0 opacity-60"
                  aria-hidden="true"
                />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionContent className="pt-4 space-y-2">
              {products.map((item) => (
                <CardOrderSummary key={item._id} item={item} />
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
