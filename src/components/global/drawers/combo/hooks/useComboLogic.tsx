import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { Step } from "@/types/comboTypes";
import { useCallback, useEffect } from "react";
import { useCombo } from "../context/ComboContext";
import { checkProductAvailability } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { toast } from "react-toastify";

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

  const handleFinish = useCallback(async () => {
    if (!selectedCombo) return;

    try {
      // Check availability for all selected variants and supplements
      const variantsToCheck = [
        ...selections.variants,
        ...selections.supplements
      ];

      for (const variant of variantsToCheck) {
        const response = await checkProductAvailability(variant._id);
        if (response.status !== 200) {
          toast.error(createToast(
            "Product Unavailable",
            `${variant.name} is currently not available`,
            "error"
          ));
          return;
        }
      }

      // Create combo product with a unique identifier
      const comboProduct: any = {
        id: `${selectedCombo._id}_${Date.now()}`, // Unique id
        _id: selectedCombo._id, // Keep original _id
        name: selectedCombo.name,
        quantity: 1,
        price: selectedCombo.price_ttc,
        variants: [selectedCombo],
        customer_index: customerIndex,
        product_vaiant_id: selectedCombo._id,
        order_type_id: orderType?._id || "",
        is_combo: true,
        is_ordered: false,
        is_paid: false,
        combo_items: {
          variants: selections.variants.map((v) => ({
            ...v,
            customer_index: customerIndex,
            order_type_id: orderType?._id || "",
            suite_commande: false,
          })),
          supplements: selections.supplements.map((s) => ({
            ...s,
            price_ttc: s.price_ttc,
            customer_index: customerIndex,
            order_type_id: orderType?._id || "",
            suite_commande: false,
          })),
        },
        notes: [],
        suite_commande: false,
        high_priority: false,
      };

      // Always add as a new product
      setSelectedProducts((prev) => [...prev, comboProduct]);

      // Reset combo state
      setSelections({ variants: [], supplements: [] });
      setCurrentStep(0);
      setTotalSupplementsPrice(0);
      setOpenDrawerCombo(false);

    } catch (error) {
      toast.error(createToast(
        "Availability Check Failed",
        "Unable to verify product availability",
        "error"
      ));
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
