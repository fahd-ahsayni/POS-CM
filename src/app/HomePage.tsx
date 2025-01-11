import LeftSection from "@/components/views/home/left-section/LeftSection";
import RightSection from "@/components/views/home/right-section/RightSection";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-1 w-[calc(100vw-80px)]">
        <div className="lg:w-8/12 md:w-3/5 2 w-4/12 pr-8 pl-6 overflow-hidden relative">
          <LeftSection />
        </div>
        <div className="lg:w-4/12 md:w-2/5 w-8/12">
          <RightSection />
        </div>
      </div>
    </>
  );
}
