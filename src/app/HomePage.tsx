import LeftSection from "@/components/views/home/left-section/LeftSection";
import RightSection from "@/components/views/home/right-section/rightSection";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-1 w-[calc(100vw-80px)]">
        <div className="w-8/12 px-4 sm:px-6">
          <LeftSection />
        </div>
        <div className="w-4/12 px-4 sm:px-6">
          <RightSection />
        </div>
      </div>
    </>
  );
}
