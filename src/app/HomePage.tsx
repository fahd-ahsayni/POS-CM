import { useEffect, useState } from "react";
import LeftSection from "@/components/views/home/left-section/LeftSection";
import RightSection from "@/components/views/home/right-section/RightSection";
import { BeatLoader } from "react-spinners";

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStartLoading = () => {
      setLoading(true);
      setTimeout(() => setLoading(false), 250);
    };
    window.addEventListener("startLoading", handleStartLoading);
    return () => window.removeEventListener("startLoading", handleStartLoading);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 w-[calc(100vw-80px)] items-center justify-center relative">
        <BeatLoader color="#fB0000" size={10} />
      </div>
    );
  }
  
  return (
    <>
      <div className="flex flex-1 w-[calc(100vw-80px)] gap-x-4 h-full">
        <div className="lg:w-8/12 md:w-3/5 w-4/12 pl-6 pr-5 overflow-hidden relative bg-zinc-900">
          <LeftSection />
        </div>
        <div className="lg:w-4/12 md:w-2/5 w-8/12">
          <RightSection />
        </div>
      </div>
    </>
  );
}
