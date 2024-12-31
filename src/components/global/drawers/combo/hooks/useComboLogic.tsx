import { useEffect, useCallback } from "react";
import { useCombo } from "../context/ComboContext";
import { Step } from "@/types/comboTypes";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/leftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/rightViewContext";
import { ProductSelected } from "@/types";

interface FormattedComboData {
  is_combo: boolean;
  price: number;
  product_variant_id: string;
  uom_id: string;
  customer_index: number;
  notes: string[];
  quantity: number;
  suite_commande: boolean;
  order_type_id: string;
  suite_ordred: boolean;
  is_paid: boolean;
  is_ordred: boolean;
  combo_prod_ids: Array<{
    notes: string[];
    quantity: number;
    suite_commande: boolean;
    order_type_id: string;
    product_variant_id: string;
  }>;
  combo_supp_ids: Array<{
    notes: string[];
    quantity: number;
    suite_commande: boolean;
    order_type_id: string;
    product_variant_id: string;
  }>;
}

export function useComboLogic(currentStep: number, selectedStep?: Step) {
  const { selections, setSelections } = useCombo();
  const { setOpenDrawerCombo, selectedCombo, setSelectedProducts } =
    useLeftViewContext();
  const orderType = JSON.parse(localStorage.getItem("orderType") || "{}");
  const { customerIndex } = useRightViewContext();

  const createComboItem = (id: string, quantity: number) => ({
    notes: [],
    quantity,
    suite_commande: false,
    order_type_id: orderType._id,
    product_variant_id: id,
  });

  const handleFinish = useCallback(() => {
    if (!selectedCombo) return;

    // Create a new product structure for the combo
    const comboProduct: any = {
      _id: selectedCombo._id,
      name: selectedCombo.name,
      quantity: 1,
      price: selectedCombo.price_ttc,
      variants: [selectedCombo], // Include the combo variant
      customer_index: customerIndex,
      order_type_id: orderType?._id || "",
      is_combo: true, // Add flag to identify as combo
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
    };

    // Add combo to selected products
    setSelectedProducts((prev) => [...prev, comboProduct]);
    setOpenDrawerCombo(false);
  }, [
    selectedCombo,
    selections,
    customerIndex,
    orderType,
    setSelectedProducts,
    setOpenDrawerCombo,
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
