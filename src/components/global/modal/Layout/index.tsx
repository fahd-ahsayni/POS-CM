import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";

interface ModalLayoutProps {
  children: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
  className?: string;
}

export default function ModalLayout({
  children,
  isOpen,
  closeModal,
  className,
}: ModalLayoutProps) {
  const { showKeyboard } = useVirtualKeyboard();
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30" />
        <DialogContent onPointerDownOutside={(event) => {
          if (showKeyboard) {
            event.preventDefault();
          }
        }} className={className}>{children}</DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
