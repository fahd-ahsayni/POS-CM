import { checkProductAvailability } from "@/api/services";
import { createToast } from "@/components/global/Toasters";
import { useLeftViewContext } from "@/components/views/home/left-section/contexts/LeftViewContext";
import { useRightViewContext } from "@/components/views/home/right-section/contexts/RightViewContext";
import { Step } from "@/interfaces/product";
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

      // Generate a unique ID for this combo instance
      const uniqueComboId = `${selectedCombo._id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create combo product with unique ID
      const comboProduct = {
        _id: uniqueComboId,
        id: uniqueComboId,
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
            ...variant,
            combo_id: uniqueComboId,
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
              ...supp,
              combo_id: uniqueComboId,
              price: suppPrice,
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
      setSelections({ 
        variants: [], 
        supplements: [], 
        comboId: `combo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
      });
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
