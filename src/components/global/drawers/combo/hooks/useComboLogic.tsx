import { useLeftViewContext } from "@/components/views/home/left-section/contexts/leftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/rightViewContext";
import { Step } from "@/types/comboTypes";
import { useCallback, useEffect } from "react";
import { useCombo } from "../context/ComboContext";
import { ProductSelected } from "@/types";

export function useComboLogic(currentStep: number, selectedStep?: Step) {
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

  const handleFinish = useCallback(() => {
    if (!selectedCombo) return;

    // Create combo product
    const comboProduct: any = {
      _id: selectedCombo._id,
      name: selectedCombo.name,
      quantity: 1,
      price: selectedCombo.price_ttc,
      variants: [selectedCombo],
      customer_index: customerIndex,
      order_type_id: orderType?._id || "",
      is_combo: true,
      combo_items: {
        variants: selections.variants.map((v) => ({
          ...v,
          customer_index: customerIndex,
          order_type_id: orderType?._id || "",
        })),
        supplements: selections.supplements.map((s) => ({
          ...s,
          customer_index: customerIndex,
          order_type_id: orderType?._id || "",
        })),
      },
      notes: [],
      suite_commande: false,
    };

    // Add to selected products
    setSelectedProducts((prev) => [...prev, comboProduct]);

    // Reset combo state
    setSelections({ variants: [], supplements: [] });
    setCurrentStep(0);
    setTotalSupplementsPrice(0);
    setOpenDrawerCombo(false);
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

  const getStepDescription = (step: Step): string => {
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
  };

  return { getStepDescription, handleFinish };
}
