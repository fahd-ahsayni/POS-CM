import { checkProductAvailability } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { Step } from "@/types/product.types";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCombo } from "../context/ComboContext";

export function useComboLogic(currentStep: number, selectedStep?: Step) {
  const [isFinishing, setIsFinishing] = useState(false);

  const {
    selections,
    setSelections,
    setCurrentStep,
    setTotalSupplementsPrice,
  } = useCombo();
  const { setOpenDrawerCombo, selectedCombo, setSelectedProducts } =
    useLeftViewContext();
  const { customerIndex } = useRightViewContext();
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");

  const handleFinish = useCallback(async () => {
    if (!selectedCombo) return;

    // Check if there are any selections
    const hasVariants = selections.variants.length > 0;
    const hasSupplements = selections.supplements.length > 0;

    if (!hasVariants && !hasSupplements) {
      toast.error(
        createToast(
          "Invalid Combo",
          "Please select at least one product",
          "warning"
        )
      );
      return;
    }

    try {
      setIsFinishing(true);

      // Check availability for all selected variants and supplements
      const variantsToCheck = [
        ...selections.variants,
        ...selections.supplements,
      ];

      for (const variant of variantsToCheck) {
        const response = await checkProductAvailability(variant._id);
        if (response.status !== 200) {
          toast.error(
            createToast(
              "Product Unavailable",
              `${variant.name} is currently not available`,
              "error"
            )
          );
          return;
        }
      }

      // Get menu price for the combo
      const menuPrice =
        selectedCombo.menus?.find(
          (menu: any) => menu.menu_id === orderType?.menu_id
        )?.price_ttc || selectedCombo.default_price;

      // Calculate supplements total price
      const supplementsPrice = selections.supplements.reduce((total, supp) => {
        const suppPrice =
          supp.menus?.find((menu: any) => menu.menu_id === orderType?.menu_id)
            ?.price_ttc ||
          supp.default_price ||
          supp.price_ttc ||
          0;
        return total + suppPrice * supp.quantity;
      }, 0);

      // Create combo product with proper structure
      const comboProduct = {
        _id: `${selectedCombo._id}_${Date.now()}`,
        name: selectedCombo.name,
        quantity: 1,
        price: menuPrice + supplementsPrice,
        variants: [selectedCombo],
        product_variant_id: selectedCombo._id,
        customer_index: customerIndex,
        order_type_id: orderType?._id || "",
        uom_id: selectedCombo.uom_id?._id || "",
        is_combo: true,
        is_ordered: false,
        is_paid: false,
        combo_items: {
          variants: selections.variants.map((variant) => ({
            _id: variant._id,
            name: variant.name,
            price: variant.price_ttc || variant.default_price || 0,
            quantity: variant.quantity || 1,
            stepIndex: variant.stepIndex,
            product_variant_id: variant._id,
            customer_index: customerIndex,
            order_type_id: orderType?._id || "",
            uom_id: variant.uom_id?._id || "",
          })),
          supplements: selections.supplements.map((supp) => {
            const suppPrice =
              supp.menus?.find(
                (menu: any) => menu.menu_id === orderType?.menu_id
              )?.price_ttc ||
              supp.default_price ||
              supp.price_ttc ||
              0;
            return {
              _id: supp._id,
              name: supp.name,
              price: suppPrice,
              quantity: supp.quantity || 1,
              stepIndex: supp.stepIndex,
              product_variant_id: supp._id,
              customer_index: customerIndex,
              order_type_id: orderType?._id || "",
              uom_id: supp.uom_id?._id || "",
              is_supplement: true,
            };
          }),
        },
        notes: [],
        discount: null,
        suite_commande: false,
        high_priority: false,
      };

      // Add the combo product to selected products
      setSelectedProducts((prev: any) => [...prev, comboProduct]);

      // Reset combo state
      setSelections({ variants: [], supplements: [] });
      setCurrentStep(0);
      setTotalSupplementsPrice(0);
      setOpenDrawerCombo(false);
    } catch (error) {
      toast.error(
        createToast(
          "Availability Check Failed",
          "Unable to verify product availability",
          "error"
        )
      );
    } finally {
      setIsFinishing(false);
    }
  }, [
    selectedCombo,
    selections,
    customerIndex,
    orderType,
    setSelectedProducts,
    setOpenDrawerCombo,
    setSelections,
    setCurrentStep,
    setTotalSupplementsPrice,
  ]);

  useEffect(() => {
    if (selectedStep?.is_required) {
      setSelections((prev) => ({
        ...prev,
        variants: [
          ...selectedStep.product_variant_ids.map((variant) => ({
            ...variant,
            quantity: 1,
            stepIndex: currentStep,
          })),
        ],
      }));
    }
  }, [currentStep, selectedStep, setSelections]);

  return {
    getStepDescription: (step: Step): string => {
      if (step.is_required && !step.is_supplement) {
        return "All variants are automatically selected";
      }
      if (!step.is_required && !step.is_supplement) {
        return `You can select up to ${step.number_of_products} items`;
      }
      if (!step.is_required && step.is_supplement) {
        return "Select supplements and adjust quantities as needed";
      }
      return "";
    },
    handleFinish,
    isFinishing,
  };
}
