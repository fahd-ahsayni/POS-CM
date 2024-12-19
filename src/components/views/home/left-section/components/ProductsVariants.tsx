import Drawer from "@/components/global/Drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLeftViewContext } from "../contexts/leftViewContext";

import {
  ON_PLACE_VIEW,
  ORDER_SUMMARY_VIEW,
} from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";

export default function ProductsVariants() {
  const {
    openDrawerVariants,
    setOpenDrawerVariants,
    selectedProduct,
    selectedProducts,
    setSelectedProducts,
    setQuantityPerVariant,
  } = useLeftViewContext();

  const { selectedCustomer } = useRightViewContext();

  const { setViews, orderType } = useRightViewContext();

  const handleSelectVariant = (id: string, price: number) => {
    if (!selectedProduct) {
      console.warn("No selected product. Cannot select a variant.");
      return;
    }

    setSelectedProducts((prev) => {
      const existingProduct = prev.find(
        (p) =>
          p._id === selectedProduct._id &&
          p.variant_id === id &&
          p.customer_index === selectedCustomer
      );

      if (existingProduct) {
        return prev.map((p) =>
          p._id === selectedProduct._id && p.variant_id === id
            ? {
                ...p,
                quantity: p.quantity + 1,
                price: p.price + price,
              }
            : p
        );
      } else {
        const variant = selectedProduct.variants.find((v) => v._id === id);
        return [
          ...prev,
          {
            ...selectedProduct,
            id: uuidv4(),
            variants: variant ? [variant] : [],
            variant_id: id,
            quantity: 1,
            price: price,
            customer_index: selectedCustomer,
            order_type_id: orderType || ON_PLACE_VIEW,
          },
        ];
      }
    });

    setQuantityPerVariant((prev) => prev + 1);
  };

  const handleConfirm = () => {
    setOpenDrawerVariants(false);
    setViews(ORDER_SUMMARY_VIEW);
  };

  // Monitor updates to selectedProducts
  useEffect(() => {
    console.log("Updated Selected Products:", selectedProducts);
  }, [selectedProducts]);

  return (
    <Drawer
      title={selectedProduct?.name || ""}
      open={openDrawerVariants}
      setOpen={setOpenDrawerVariants}
    >
      <div className="h-full w-full relative flex justify-center">
        <div className="w-full h-full overflow-auto space-y-2">
          {selectedProduct &&
            selectedProduct.variants.map((variant, index) => {
              const isSelected = selectedProducts.some(
                (p) => p.variant_id === variant._id
              );

              return (
                <div
                  key={`${selectedProduct._id}-${variant._id}-${index}`}
                  onClick={() =>
                    handleSelectVariant(variant._id, variant.price_ttc)
                  }
                  tabIndex={0} // Makes it focusable
                  role="button" // Improves accessibility
                  onKeyPress={(e) => {
                    if (e.key === "Enter")
                      handleSelectVariant(variant._id, variant.price_ttc);
                  }}
                >
                  <Card
                    className={`w-full h-full px-4 py-2 rounded-lg dark:!bg-zinc-950 ${
                      isSelected ? "border-2 border-primary" : ""
                    }`}
                  >
                    <TypographyP className="font-semibold">
                      {variant.name}
                    </TypographyP>
                    <TypographySmall className="text-muted-foreground font-semibold">
                      {variant.price_ttc} Dhs
                    </TypographySmall>
                  </Card>
                </div>
              );
            })}
        </div>
        <div className="w-[105%] px-[2.5%] absolute bottom-0 h-16 flex items-end dark:!bg-zinc-900 bg-gray-100">
          <Button className="w-full" onClick={handleConfirm}>
            Add to cart
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
