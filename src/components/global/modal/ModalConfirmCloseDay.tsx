import { BsExclamation } from "react-icons/bs";
import BaseModal from "./Layout/BaseModal";

interface ModalConfirmCloseDayProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

export default function ModalConfirmCloseDay({
  open,
  setOpen,
  onConfirm,
  children,
}: ModalConfirmCloseDayProps) {
  const handleConfirm = () => {
    onConfirm?.();
    setOpen(false);
  };

  return (
    <BaseModal
      isOpen={open}
      closeModal={() => setOpen(false)}
      title="Confirm Close the Day"
      description="Are you sure you want to close this day? Once confirmed, the day will be closed and you will not be able to make any changes."
      icon={<BsExclamation className="h-8 w-8 text-secondary-black" />}
      confirmText="Yes, Close Day"
      onConfirm={handleConfirm}
      onCancel={() => setOpen(false)}
      variant="warning"
    >
      {children}
    </BaseModal>
  );
}
