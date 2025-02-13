import { createToast } from "@/components/global/Toasters";
import { ProductVariant, Step } from "@/interfaces/product";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { useStep } from "@/hooks/use-step";

interface SelectionState {
  variants: SelectedVariant[];
  supplements: SelectedVariant[];
  comboId: string;
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
  resetSelections: () => void;
}

const ComboContext = createContext<ComboContextType | undefined>(undefined);

export function ComboProvider({
  children,
  totalSteps,
}: {
  children: React.ReactNode;
  totalSteps: number;
}) {
  const [
    currentStep,
    { goToNextStep, goToPrevStep, setStep, reset: resetStep },
  ] = useStep(totalSteps);

  const [selections, setSelections] = useState<SelectionState>({
    variants: [],
    supplements: [],
    comboId: `combo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  });

  const [totalSupplementsPrice, setTotalSupplementsPrice] = useState(0);
  const navigationLock = useRef(false);
  
  const handleSelect = useCallback(
    (
      variant: ProductVariant,
      isSupplement: boolean,
      isRequired: boolean,
      maxProducts?: number
    ) => {
      // For required steps, don't allow manual selection
      if (isRequired) {
        return;
      }

      setSelections((prev) => {
        const targetArray = isSupplement ? 'supplements' : 'variants';
        const currentStepItems = prev[targetArray].filter(
          (v) => v.stepIndex === currentStep
        );

        // Check if variant is already selected in current step
        const isAlreadySelected = currentStepItems.some(
          (v) => v._id === variant._id
        );
        
        if (isAlreadySelected) {
          return prev;
        }

        // Check max products limit for non-supplements
        if (!isSupplement && maxProducts && currentStepItems.length >= maxProducts) {
          toast.warning(
            createToast(
              "Selection Limit",
              `Maximum ${maxProducts} items allowed`,
              "warning"
            )
          );
          return prev;
        }

        const newItem = {
          ...variant,
          quantity: 1,
          stepIndex: currentStep,
          suite_commande: false,
        };

        return {
          ...prev,
          [targetArray]: [...prev[targetArray], newItem],
        };
      });
    },
    [currentStep]
  );

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

      const maxProducts = step?.number_of_products || Infinity;
      const newTotal = otherVariantsQuantity + newQuantity;
      if (newTotal > maxProducts) {
        return prev;
      }

      const newState = {
        ...prev,
        variants: prev.variants.map((v) =>
          v._id === variantId && v.stepIndex === currentStep
            ? { ...v, quantity: newQuantity }
            : v
        ),
      };

      // Auto navigate if new total equals the product limit and navigation is not locked
      if (newTotal === maxProducts && !navigationLock.current) {
        navigationLock.current = true;
        requestAnimationFrame(() => {
          goToNextStep();
          setTimeout(() => {
            navigationLock.current = false;
          }, 50);
        });
      }

      return newState;
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
      goToNextStep();
    } else {
      goToPrevStep();
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

  const resetSelections = useCallback(() => {
    setSelections({
      variants: [],
      supplements: [],
      comboId: `combo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
    resetStep();
  }, [resetStep]);

  return (
    <ComboContext.Provider
      value={{
        currentStep: currentStep - 1,
        selections,
        handleSelect,
        handleQuantityChange,
        handleNavigation,
        setCurrentStep: (step: number) => setStep(step + 1),
        setSelections,
        totalSupplementsPrice,
        setTotalSupplementsPrice,
        updateVariantNotes,
        updateVariantSuiteCommande,
        resetSelections,
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
