import LeftSection from "@/components/views/home/left-section/LeftSection";
import RightSection from "@/components/views/home/right-section/RightSection";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-1 w-[calc(100vw-80px)]">
        <div className="w-8/12 px-4 sm:px-6 scrollbar-hide left-section">
          <LeftSection />
        </div>
        <div className="w-4/12">
          <RightSection />
        </div>
      </div>
    </>
  );
}
