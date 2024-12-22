import Drawer from "@/components/global/Drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import { useEffect } from "react";
import { useLeftViewContext } from "../contexts/leftViewContext";
import { ORDER_SUMMARY_VIEW } from "../../right-section/constants";
import { useRightViewContext } from "../../right-section/contexts/rightViewContext";
import { useProductSelection } from "../hooks/useProductSelection";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";

export default function ProductsVariants() {
  const {
    openDrawerVariants,
    setOpenDrawerVariants,
    selectedProduct,
    selectedProducts,
    setSelectedProducts,
  } = useLeftViewContext();

  const { selectedCustomer } = useRightViewContext();

  const { setViews, orderType } = useRightViewContext();

  const { addOrUpdateProduct } = useProductSelection({
    selectedProducts,
    setSelectedProducts,
    selectedCustomer,
    orderType,
  });

  const handleSelectVariant = (id: string, price: number) => {
    if (!selectedProduct) {
      console.warn("No selected product. Cannot select a variant.");
      return;
    }

    addOrUpdateProduct(selectedProduct, id, price);
  };

  const handleQuantityChange = (variantId: string, increment: boolean) => {
    setSelectedProducts(prev => prev.map(product => {
      if (product.product_variant_id === variantId) {
        return {
          ...product,
          quantity: increment 
            ? product.quantity + 1 
            : Math.max(1, product.quantity - 1) // Prevent going below 1
        };
      }
      return product;
    }));
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
      position="left"
    >
      <div className="h-full w-full relative flex justify-center px-4 sm:px-6">
        <div className="w-full h-full overflow-auto space-y-2">
          {selectedProduct &&
            selectedProduct.variants.map((variant, index) => {
              const selectedProduct = selectedProducts.find(
                (p) => p.product_variant_id === variant._id
              );
              const isSelected = !!selectedProduct;
              const quantity = selectedProduct?.quantity || 0;

              return (
                <div
                  key={`${selectedProduct?._id}-${variant._id}-${index}`}
                  onClick={() => !isSelected && handleSelectVariant(variant._id, variant.price_ttc)}
                  tabIndex={0}
                  role="button"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isSelected)
                      handleSelectVariant(variant._id, variant.price_ttc);
                  }}
                >
                  <Card
                    className={`w-full h-full px-4 py-2 rounded-lg dark:!bg-zinc-950 ${
                      isSelected ? "!border-2 !border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <TypographyP className="font-semibold capitalize text-sm">
                        {variant.name.toLowerCase()}
                      </TypographyP>
                      {isSelected && (
                        <div className="flex items-center gap-2">
                          <Button
                            slot="decrement"
                            className="-ms-px h-6 w-6 rounded bg-accent-white/10 hover:bg-accent-black/10"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(variant._id, false);
                            }}
                          >
                            <Minus size={16} strokeWidth={2} aria-hidden="true" />
                          </Button>
                          <TypographyP className="px-1.5 font-medium">
                            {quantity}
                          </TypographyP>
                          <Button
                            slot="increment"
                            className="-ms-px h-6 w-6 rounded bg-accent-white/10 hover:bg-accent-black/10"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuantityChange(variant._id, true);
                            }}
                          >
                            <Plus size={16} strokeWidth={2} aria-hidden="true" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <TypographySmall className="text-neutral-dark-grey font-medium text-xs">
                      {variant.price_ttc} Dhs
                    </TypographySmall>
                  </Card>
                </div>
              );
            })}
        </div>
        <div className="w-full absolute bottom-0 h-16 flex items-end dark:!bg-secondary-black bg-secondary-white px-4 sm:px-6">
          <Button className="w-full" onClick={handleConfirm}>
            Add to cart
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
