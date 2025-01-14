import { ProductVariant, Step } from "@/types/product.types";
import { createContext, useCallback, useContext, useState } from "react";

interface SelectionState {
  variants: SelectedVariant[];
  supplements: SelectedVariant[];
}

interface SelectedVariant extends ProductVariant {
  quantity: number;
  stepIndex: number;
}

interface ComboContextType {
  currentStep: number;
  selections: SelectionState;
  handleSelect: (
    variant: ProductVariant,
    isSupplement: boolean,
    isRequired: boolean,
    maxProducts?: number
  ) => void;
  handleQuantityChange: (
    variantId: string,
    increment: boolean,
    step: Step
  ) => void;
  handleNavigation: (direction: "next" | "previous") => void;
  updateVariantNotes: (
    variantId: string,
    notes: string[],
    isSupplement: boolean
  ) => void;
  updateVariantSuiteCommande: (
    variantId: string,
    value: boolean,
    isSupplement: boolean
  ) => void;
  setCurrentStep: (step: number) => void;
  setSelections: React.Dispatch<React.SetStateAction<SelectionState>>;
  totalSupplementsPrice: number;
  setTotalSupplementsPrice: (price: number) => void;
}

const ComboContext = createContext<ComboContextType | undefined>(undefined);

export function ComboProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<SelectionState>({
    variants: [],
    supplements: [],
  });

  const [totalSupplementsPrice, setTotalSupplementsPrice] = useState(0);

  const handleSelect = (
    variant: ProductVariant,
    isSupplement: boolean,
    isRequired: boolean,
    maxProducts?: number
  ) => {
    if (isRequired && !isSupplement) return;

    setSelections((prev) => {
      if (isSupplement) {
        const exists = prev.supplements.some(
          (v) => v._id === variant._id && v.stepIndex === currentStep
        );

        return {
          ...prev,
          supplements: exists
            ? prev.supplements.filter(
                (v) => !(v._id === variant._id && v.stepIndex === currentStep)
              )
            : [
                ...prev.supplements,
                { ...variant, quantity: 1, stepIndex: currentStep },
              ],
        };
      }

      const existingVariant = prev.variants.find(
        (v) => v._id === variant._id && v.stepIndex === currentStep
      );

      // Handle deselection
      if (!isRequired && existingVariant) {
        return {
          ...prev,
          variants: prev.variants.filter(
            (v) => !(v._id === variant._id && v.stepIndex === currentStep)
          ),
        };
      }

      // Handle new selections
      if (!isRequired && maxProducts) {
        const stepVariants = prev.variants.filter(
          (v) => v.stepIndex === currentStep
        );
        const totalQuantity = stepVariants.reduce(
          (sum, v) => sum + (v.quantity || 1),
          0
        );

        if (totalQuantity < maxProducts) {
          return {
            ...prev,
            variants: [
              ...prev.variants,
              { ...variant, quantity: 1, stepIndex: currentStep },
            ],
          };
        }
      }

      return prev;
    });
  };

  const handleQuantityChange = (
    variantId: string,
    increment: boolean,
    step: Step
  ) => {
    setSelections((prev) => {
      if (step.is_supplement && !step.is_required) {
        const supplementVariant = prev.supplements.find(
          (s) => s._id === variantId && s.stepIndex === currentStep
        );

        if (supplementVariant) {
          // If decrementing to 0, remove the supplement
          if (!increment && supplementVariant.quantity === 1) {
            return {
              ...prev,
              supplements: prev.supplements.filter(
                (s) => !(s._id === variantId && s.stepIndex === currentStep)
              ),
            };
          }

          // Otherwise update quantity
          return {
            ...prev,
            supplements: prev.supplements.map((supp) =>
              supp._id === variantId && supp.stepIndex === currentStep
                ? {
                    ...supp,
                    quantity: increment ? supp.quantity + 1 : supp.quantity - 1,
                  }
                : supp
            ),
          };
        }
      }

      // Handle regular variants with limits
      const variant = prev.variants.find(
        (v) => v._id === variantId && v.stepIndex === currentStep
      );

      if (!variant) return prev;

      // If decrementing to 0, remove the variant
      if (!increment && variant.quantity === 1) {
        return {
          ...prev,
          variants: prev.variants.filter(
            (v) => !(v._id === variantId && v.stepIndex === currentStep)
          ),
        };
      }

      // Calculate total quantity for current step
      const stepVariants = prev.variants.filter(
        (v) => v.stepIndex === currentStep
      );
      const otherVariantsQuantity = stepVariants
        .filter((v) => v._id !== variantId)
        .reduce((sum, v) => sum + (v.quantity || 1), 0);

      const newQuantity = increment
        ? variant.quantity + 1
        : variant.quantity - 1;

      // Check if new total quantity would exceed step.number_of_products
      const maxProducts = step?.number_of_products || Infinity;
      if (otherVariantsQuantity + newQuantity > maxProducts) {
        return prev;
      }

      return {
        ...prev,
        variants: prev.variants.map((v) =>
          v._id === variantId && v.stepIndex === currentStep
            ? { ...v, quantity: newQuantity }
            : v
        ),
      };
    });

    // Calculate and log total supplements price after state update
    const totalSupplementsPrice = Object.values(selections.supplements)
      .flat()
      .reduce((total, supplement) => {
        return total + supplement.price_ttc * supplement.quantity;
      }, 0);

    setTotalSupplementsPrice(totalSupplementsPrice);
  };

  const handleNavigation = (direction: "next" | "previous") => {
    if (direction === "next") {
      setCurrentStep((prev) => prev + 1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateVariantNotes = useCallback(
    (variantId: string, notes: string[], isSupplement: boolean) => {
      setSelections((prev) => ({
        ...prev,
        [isSupplement ? "supplements" : "variants"]: prev[
          isSupplement ? "supplements" : "variants"
        ].map((item) => (item._id === variantId ? { ...item, notes } : item)),
      }));
    },
    []
  );

  const updateVariantSuiteCommande = useCallback(
    (variantId: string, value: boolean, isSupplement: boolean) => {
      setSelections((prev) => ({
        ...prev,
        [isSupplement ? "supplements" : "variants"]: prev[
          isSupplement ? "supplements" : "variants"
        ].map((item) =>
          item._id === variantId ? { ...item, suite_commande: value } : item
        ),
      }));
    },
    []
  );

  return (
    <ComboContext.Provider
      value={{
        currentStep,
        selections,
        handleSelect,
        handleQuantityChange,
        handleNavigation,
        setCurrentStep,
        setSelections,
        totalSupplementsPrice,
        setTotalSupplementsPrice,
        updateVariantNotes,
        updateVariantSuiteCommande,
      }}
    >
      {children}
    </ComboContext.Provider>
  );
}

export const useCombo = () => {
  const context = useContext(ComboContext);
  if (!context) throw new Error("useCombo must be used within ComboProvider");
  return context;
};
