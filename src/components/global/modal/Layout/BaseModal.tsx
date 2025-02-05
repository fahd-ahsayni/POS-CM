import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { TypographyH3 } from "@/components/ui/typography";
import ModalLayout from "./index";

interface BaseModalProps {
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "warning" | "success" | "danger" | "default";
  disabled?: boolean;
}

const getIconContainerClass = (variant: BaseModalProps["variant"]) => {
  const classes = {
    warning: "bg-warning-color",
    success: "bg-green-100/50",
    danger: "bg-red-100/50",
    default: "dark:bg-secondary-black bg-neutral-bright-grey",
  };
  return classes[variant || "default"];
};

export default function BaseModal({
  isOpen,
  closeModal,
  title,
  description,
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  disabled = false,
}: BaseModalProps) {
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={closeModal}
      className="dark:bg-primary-black bg-white"
    >
      <DialogTitle className="sr-only">Caisse Manager</DialogTitle>
      <DialogDescription className="sr-only">Caisse Manager</DialogDescription>
      <div>
        {icon && (
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${getIconContainerClass(
              variant
            )}`}
          >
            {icon}
          </div>
        )}
        <div className="mt-1 text-center sm:mt-3">
          <TypographyH3 className="text-xl font-semibold leading-6 dark:text-white text-primary-black">
            {title}
          </TypographyH3>
          <div className="mt-4">
            <p className="text-[0.8rem] dark:text-secondary-white/90 text-secondary-black/90">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={disabled}
          className="!bg:neutral-bright-grey dark:bg-secondary-black"
        >
          {cancelText}
        </Button>
        <Button onClick={onConfirm} disabled={disabled}>
          {confirmText}
        </Button>
      </div>
    </ModalLayout>
  );
}
