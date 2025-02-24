import { logoutService } from "@/api/services";
import { ValidIcon } from "@/assets/figma-icons";
import { useNavigate } from "react-router-dom";
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleConfirm = async () => {
    onConfirm();
  };

  return (
    <BaseModal
      isOpen={open}
      closeModal={() => setOpen(false)}
      title="Confirm Order"
      description="Are you sure you want to proceed with this order?"
      icon={<ValidIcon className="h-12 w-12 text-success-color" />}
      confirmText={isProcessing ? "Processing..." : "Yes, Proceed"}
      onConfirm={async () => {
        await handleConfirm();
        if (user.position === "Waiter") {
          await logoutService();
          navigate("/login");
        }
      }}
      onCancel={() => setOpen(false)}
      variant="default"
      disabled={isProcessing}
    />
  );
}
