import { Button } from "@/components/ui/button";
import { DialogTitle } from "@headlessui/react";
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
}: BaseModalProps) {
  return (
    <ModalLayout isOpen={isOpen} closeModal={closeModal}>
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
          <DialogTitle
            as="h3"
            className="text-xl font-semibold leading-6 dark:text-white text-primary-black"
          >
            {title}
          </DialogTitle>
          <div className="mt-4">
            <p className="text-[0.8rem] dark:text-secondary-white/90 text-secondary-black/90">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm}>{confirmText}</Button>
      </div>
    </ModalLayout>
  );
}
