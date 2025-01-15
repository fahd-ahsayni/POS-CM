import { BsCheck2Circle } from "react-icons/bs";
import BaseModal from "./Layout/BaseModal";

interface ModalConfirmOrderProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export default function ModalConfirmOrder({
  open,
  setOpen,
  onConfirm,
  isProcessing,
}: ModalConfirmOrderProps) {
  return (
    <BaseModal
      isOpen={open}
      closeModal={() => setOpen(false)}
      title="Confirm Order"
      description="Are you sure you want to proceed with this order?"
      icon={<BsCheck2Circle className="h-8 w-8 text-success-color" />}
      confirmText={isProcessing ? "Processing..." : "Yes, Proceed"}
      onConfirm={onConfirm}
      onCancel={() => setOpen(false)}
      variant="default"
      disabled={isProcessing}
    />
  );
}
