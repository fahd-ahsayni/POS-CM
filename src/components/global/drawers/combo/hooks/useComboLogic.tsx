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

      // Create combo product
      const comboProduct: any = {
        _id: selectedCombo._id,
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
            // high_priority: false,
          })),
          supplements: selections.supplements.map((s) => ({
            ...s,
            price_ttc: s.price_ttc,
            customer_index: customerIndex,
            order_type_id: orderType?._id || "",
            suite_commande: false,
            // high_priority: false,
          })),
        },
        notes: [],
        suite_commande: false,
        high_priority: false,
      };

      // Add to selected products
      setSelectedProducts((prev) => {
        // Check for existing combo with same ID and customer index
        const existingComboIndex = prev.findIndex(
          (p) => p._id === comboProduct._id && p.customer_index === customerIndex
        );

        if (existingComboIndex !== -1) {
          // If exists, preserve the existing flags
          const existingCombo = prev[existingComboIndex];
          comboProduct.suite_commande = existingCombo.suite_commande;
          comboProduct.high_priority = existingCombo.high_priority;

          // Also preserve flags for variants and supplements
          comboProduct.combo_items.variants =
            comboProduct.combo_items.variants.map((v: any) => ({
              ...v,
              suite_commande: existingCombo.suite_commande,
              // high_priority: existingCombo.high_priority,
            }));

          comboProduct.combo_items.supplements =
            comboProduct.combo_items.supplements.map((s: any) => ({
              ...s,
              suite_commande: existingCombo.suite_commande,
              // high_priority: existingCombo.high_priority,
            }));

          // Replace the existing combo
          const newProducts = [...prev];
          newProducts[existingComboIndex] = comboProduct;
          return newProducts;
        }

        // If it's a new combo, add it to the array
        return [...prev, comboProduct];
      });

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
