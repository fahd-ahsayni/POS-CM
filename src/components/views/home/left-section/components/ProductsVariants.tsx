import { Card } from "@/components/ui/card";
import { useLeftViewContext } from "../contexts/leftViewContext";
import Drawer from "@/components/global/Drawer";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProductsVariants() {
  const {
    openDrawerVariants,
    setOpenDrawerVariants,
    selectedProduct,
    selectedProducts,
    setSelectedProducts,
  } = useLeftViewContext();

  const handleSelectVariant = (id: string, price: number) => {
    if (!selectedProduct) {
      console.warn("No selected product. Cannot select a variant.");
      return;
    }

    console.info("Attempting to select variant:", { id, price });

    setSelectedProducts((prev) => {
      const existingProduct = prev.find(
        (p) => p._id === selectedProduct._id && p.variant_id === id
      );

      if (existingProduct) {
        return prev.map((p) =>
          p._id === selectedProduct._id && p.variant_id === id
            ? { ...p, quantity: p.quantity + 1, price: p.price + price }
            : p
        );
      } else {
        const variant = selectedProduct.variants.find((v) => v._id === id);
        return [
          ...prev,
          {
            ...selectedProduct,
            variants: variant ? [variant] : [],
            variant_id: id,
            quantity: 1,
            price: price,
          },
        ];
      }
    });
  };

  // Monitor updates to selectedProducts
  useEffect(() => {
    console.log("Updated Selected Products:", selectedProducts);
  }, [selectedProducts]);

  return (
    <Drawer open={openDrawerVariants} setOpen={setOpenDrawerVariants}>
      <div className="h-full w-full relative flex justify-center">
        <div className="w-full h-full overflow-auto space-y-2">
          {selectedProduct &&
            selectedProduct.variants.map((variant) => (
              <div
                key={variant._id}
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
                <Card className="w-full h-full px-4 py-2 rounded-lg !bg-zinc-950">
                  <TypographyP className="font-semibold">
                    {variant.name}
                  </TypographyP>
                  <TypographySmall className="text-muted-foreground font-semibold">
                    {variant.price_ttc} Dhs
                  </TypographySmall>
                </Card>
              </div>
            ))}
        </div>
        <div className="w-[105%] px-[2.5%] absolute bottom-0 h-16 flex items-end bg-zinc-900">
          <Button className="w-full">Add to cart</Button>
        </div>
      </div>
    </Drawer>
  );
}
