import { Step } from "@/interfaces/product";
import { useCombo } from "../context/ComboContext";
import { VariantCard } from "./VariantCard";

interface StepContentProps {
  step: Step;
}

export function StepContent({ step }: StepContentProps) {
  const { selections, handleSelect, handleQuantityChange, currentStep } = useCombo();

  // Filter selections to only show those for the current step
  const currentSelections = {
    variants: selections.variants.filter(v => v.stepIndex === currentStep) || [],
    supplements: selections.supplements.filter(s => s.stepIndex === currentStep) || [],
  };

  const handleVariantQuantityChange = (
    variantId: string,
    increment: boolean
  ) => {
    handleQuantityChange(variantId, increment, step);
  };

  return (
    <>
      <div className="space-y-4 p-1">
        {step.product_variant_ids.map((variant) => {
          const selectedVariant = step.is_supplement
            ? currentSelections.supplements.find(
                (v) => v._id === variant._id
              )
            : currentSelections.variants.find(
                (v) => v._id === variant._id
              );

          return (
            <VariantCard
              key={variant._id}
              variant={variant}
              customerIndex={0}
              isSelected={!!selectedVariant}
              isSupplement={step.is_supplement}
              isRequired={step.is_required && !step.is_supplement}
              quantity={selectedVariant?.quantity || 0}
              onClick={() =>
                handleSelect(
                  variant,
                  step.is_supplement,
                  step.is_required,
                  step.number_of_products
                )
              }
              onQuantityChange={(increment) =>
                handleVariantQuantityChange(variant._id, increment)
              }
              step={step}
            />
          );
        })}
      </div>
    </>
  );
}
