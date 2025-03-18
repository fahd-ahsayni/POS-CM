import { createToast } from "@/components/global/Toasters";
import { ProductVariant, Step } from "@/interfaces/product";
import {
  createContext,
  useCallback,
  useContext,
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
  
  const handleSelect = useCallback(
    (
      variant: ProductVariant,
      isSupplement: boolean,
      isRequired: boolean,
      maxProducts?: number
    ) => {
      // For non-required steps:
      if (!isRequired) {
        if (!isSupplement) {
          // Optional main product: limit to maxProducts.
          setSelections((prev) => {
            const stepIndex = currentStep - 1;
            const currentVariants = prev.variants.filter(
              (v) => v.stepIndex === stepIndex
            );
            
            // Check if variant is already selected in this step
            const isAlreadySelected = currentVariants.some((v) => v._id === variant._id);
            
            if (isAlreadySelected) {
              // If already selected, we should remove it (toggle behavior)
              return {
                ...prev,
                variants: prev.variants.filter(
                  (v) => !(v._id === variant._id && v.stepIndex === stepIndex)
                ),
              };
            }
            
            // Calculate the total number of products already selected in this step
            const totalQuantitySelected = currentVariants.reduce(
              (sum, v) => sum + (v.quantity || 1), 
              0
            );
            
            // Check if adding would exceed max products
            if (maxProducts && totalQuantitySelected >= maxProducts) {
              toast.warning(
                createToast(
                  "Selection Limit Exceeded",
                  `You can't select more than ${maxProducts} products`,
                  "warning"
                )
              );
              return prev;
            }
            
            // Otherwise add it to selections with quantity 1
            return {
              ...prev,
              variants: [
                ...prev.variants,
                { ...variant, quantity: 1, stepIndex, suite_commande: false },
              ],
            };
          });
        } else {
          // Optional supplement
          setSelections((prev) => {
            const stepIndex = currentStep - 1;
            // Check if already selected in this step
            const isAlreadySelected = prev.supplements.some(
              (s) => s._id === variant._id && s.stepIndex === stepIndex
            );
            
            if (isAlreadySelected) {
              // If already selected, we should remove it (toggle behavior)
              return {
                ...prev,
                supplements: prev.supplements.filter(
                  (s) => !(s._id === variant._id && s.stepIndex === stepIndex)
                ),
              };
            }
            
            return {
              ...prev,
              supplements: [
                ...prev.supplements,
                { ...variant, quantity: 1, stepIndex, suite_commande: false },
              ],
            };
          });
        }
        return;
      }

      // For required steps:
      if (!isSupplement) {
        // Main product is preset by default; do not change.
        return;
      } else {
        // If a supplement is required, process similarly to optional supplements.
        setSelections((prev) => {
          const stepIndex = currentStep - 1;
          const isAlreadySelected = prev.supplements.some(
            (s) => s._id === variant._id && s.stepIndex === stepIndex
          );
          
          if (isAlreadySelected) {
            return {
              ...prev,
              supplements: prev.supplements.filter(
                (s) => !(s._id === variant._id && s.stepIndex === stepIndex)
              ),
            };
          }
          
          return {
            ...prev,
            supplements: [
              ...prev.supplements,
              { ...variant, quantity: 1, stepIndex, suite_commande: false },
            ],
          };
        });
      }
    },
    [currentStep]
  );

  const handleQuantityChange = (
    variantId: string,
    increment: boolean,
    step: Step
  ) => {
    setSelections((prev) => {
      // Make sure we're consistently using currentStep - 1 for the stepIndex
      const stepIndex = currentStep - 1;
      
      if (step.is_supplement) {
        const supplementVariant = prev.supplements.find(
          (s) => s._id === variantId && s.stepIndex === stepIndex
        );

        if (supplementVariant) {
          // If decrementing to 0, remove the supplement (deselect)
          if (!increment && supplementVariant.quantity === 1) {
            return {
              ...prev,
              supplements: prev.supplements.filter(
                (s) => !(s._id === variantId && s.stepIndex === stepIndex)
              ),
            };
          }

          // Otherwise update quantity
          return {
            ...prev,
            supplements: prev.supplements.map((supp) =>
              supp._id === variantId && supp.stepIndex === stepIndex
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
        (v) => v._id === variantId && v.stepIndex === stepIndex
      );

      if (!variant) return prev;

      // If decrementing to 0, remove the variant (deselect)
      if (!increment && variant.quantity === 1) {
        return {
          ...prev,
          variants: prev.variants.filter(
            (v) => !(v._id === variantId && v.stepIndex === stepIndex)
          ),
        };
      }

      // Calculate total quantity for current step
      const stepVariants = prev.variants.filter(
        (v) => v.stepIndex === stepIndex
      );
      const totalQuantity = stepVariants.reduce(
        (sum, v) => sum + (v.quantity || 1), 
        0
      );

      const newQuantity = increment
        ? variant.quantity + 1
        : variant.quantity - 1;

      const maxProducts = step?.number_of_products || Infinity;
      
      // Calculate what the new total would be
      const newTotal = totalQuantity + (increment ? 1 : -1);
      
      if (increment && newTotal > maxProducts) {
        // Don't allow exceeding max products
        toast.warning(
          createToast(
            "Selection Limit Reached",
            `You can't select more than ${maxProducts} products for this step`,
            "warning"
          )
        );
        return prev;
      }

      // Update the variant quantity
      return {
        ...prev,
        variants: prev.variants.map((v) =>
          v._id === variantId && v.stepIndex === stepIndex
            ? { ...v, quantity: newQuantity }
            : v
        ),
      };
    });

    // Calculate and update total supplements price after state update
    setTimeout(() => {
      const totalSupplementsPrice = selections.supplements
        .reduce((total, supplement) => {
          return total + supplement.price_ttc * supplement.quantity;
        }, 0);
      
      setTotalSupplementsPrice(totalSupplementsPrice);
    }, 0);
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
