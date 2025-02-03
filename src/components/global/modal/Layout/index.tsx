import { useVirtualKeyboard } from "@/components/keyboard/VirtualKeyboardGlobalContext";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
        <DialogContent
          onPointerDownOutside={(event) => {
            if (showKeyboard) {
              event.preventDefault();
            }
          }}
          className={cn(className, "dark:bg-primary-black bg-secondary-white")}
        >
          {children}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
