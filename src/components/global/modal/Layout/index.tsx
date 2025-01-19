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
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogPortal>
        <DialogOverlay className="bg-black/30" />
        <DialogContent className={className}>{children}</DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
