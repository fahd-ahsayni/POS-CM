import { useLeftViewContext } from "@/components/views/home/left-section/contexts/leftViewContext";
import { useState } from "react";
import Drawer from "../../Drawer";
import { Card } from "@/components/ui/card";
import { TypographyP } from "@/components/ui/typography";
import { currency } from "@/preferences";

export default function Combo() {
  const { openDrawerCombo, setOpenDrawerCombo, selectedCombo } =
    useLeftViewContext();
  const [currentStep, setCurrentStep] = useState(0);

  console.log(selectedCombo);

  return (
    <Drawer
      open={openDrawerCombo}
      setOpen={setOpenDrawerCombo}
      title="Combo"
      position="left"
    >
      <div className="space-y-3">
        {selectedCombo &&
          selectedCombo.steps[currentStep].product_variant_ids.map(
            (variant: any) => (
              <Card
                key={variant._id}
                className="!bg-background h-24 px-4 py-3 flex flex-col justify-between"
              >
                <div>
                  <TypographyP className="capitalize font-medium">
                    {variant.name.toLowerCase()}
                  </TypographyP>
                </div>
                <div>
                  <div>
                    <TypographyP className="capitalize font-medium text-sm">
                      {variant.price_ttc.toFixed(currency.toFixed ?? 2)}{" "}
                      {currency.currency}
                    </TypographyP>
                  </div>
                  <div></div>
                </div>
              </Card>
            )
          )}
      </div>
    </Drawer>
  );
}
