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

    const isSingleRequiredStep =
      selectedCombo.steps.length === 1 &&
      selectedCombo.steps[0].is_required &&
      !selectedCombo.steps[0].is_supplement;

    // Deduplicate selections before processing
    const uniqueVariants = Array.from(
      new Map(selections.variants.map(v => [v._id, v])).values()
    );
    const uniqueSupplements = Array.from(
      new Map(selections.supplements.map(s => [s._id, s])).values()
    );

    if (!isSingleRequiredStep) {
      // Check if there are any selections
      const hasVariants = uniqueVariants.length > 0;
      const hasSupplements = uniqueSupplements.length > 0;

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
    }

    try {
      setIsFinishing(true);

      // Check availability for all selected variants and supplements
      const variantsToCheck = [
        ...uniqueVariants,
        ...uniqueSupplements,
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
      const supplementsPrice = uniqueSupplements.reduce((total, supp) => {
        const suppPrice =
          supp.menus?.find((menu: any) => menu.menu_id === orderType?.menu_id)
            ?.price_ttc ||
          supp.default_price ||
          supp.price_ttc ||
          0;
        return total + suppPrice * supp.quantity;
      }, 0);

      // Check if this combo is already selected for the current customer
      setSelectedProducts((prevProducts: any[]) => {
        const isComboAlreadySelectedForCustomer = prevProducts.some(
          (p) => 
            p.product_variant_id === selectedCombo._id && 
            p.customer_index === customerIndex
        );

        if (isComboAlreadySelectedForCustomer) {
          // If combo already exists for this customer, don't add it again
          setOpenDrawerCombo(false);
          return prevProducts;
        }

        // Continue with normal combo creation
        const uniqueComboId = `${selectedCombo._id}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Create combo product
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
            variants: uniqueVariants.map((variant) => ({
              ...variant,
              combo_id: uniqueComboId,
              suite_commande: variant.suite_commande || false, // Preserve suite_commande
            })),
            supplements: uniqueSupplements.map((supp) => {
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
                suite_commande: supp.suite_commande || false, // Preserve suite_commande
              };
            }),
          },
          notes: [],
          discount: null,
          suite_commande: false,
          high_priority: false,
        };

        return [...prevProducts, comboProduct];
      });

      // Reset combo state
      setSelections({
        variants: [],
        supplements: [],
        comboId: `combo_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
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
    if (selectedStep?.is_required && !selectedStep.is_supplement) {
      // Clear existing selections for this step before adding new ones
      setSelections((prev) => ({
        ...prev,
        variants: [
          // Keep variants from other steps
          ...prev.variants.filter(v => v.stepIndex !== currentStep),
          // Add new required variants for current step
          ...selectedStep.product_variant_ids.map((variant) => ({
            ...variant,
            quantity: 1,
            stepIndex: currentStep,
            suite_commande: false,
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
