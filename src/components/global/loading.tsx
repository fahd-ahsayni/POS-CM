import TrueFocus from "../design/TrueFocus";
import Logo from "../Layout/components/Logo";

export function LoadingFullScreen() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <div className="fixed top-8 left-0 w-full flex items-center justify-center">
        <Logo />
      </div>
      <div className="absolute opacity-25">
        <div className="w-96 h-96 bg-primary-red rounded-full blur-3xl opacity-10 animate-pulse" />
      </div>{" "}
      {/* <Ripple /> */}
      <TrueFocus
        sentence="Caisse Manager"
        manualMode={false}
        blurAmount={5}
        pauseBetweenAnimations={1}
        borderColor="#FB0000"
      />
    </div>
  );
}
