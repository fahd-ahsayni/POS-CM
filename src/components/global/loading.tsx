import Logo from "../Layout/components/Logo";
import Ripple from "../ui/ripple";

export function LoadingFullScreen() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="absolute w-96 h-96 bg-primary-red rounded-full blur-3xl opacity-10 animate-pulse" />
      <Logo size="lg" />
      <Ripple />
    </div>
  );
}
