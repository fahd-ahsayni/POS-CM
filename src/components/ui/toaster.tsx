import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastViewport
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
