import LeftSection from "@/components/views/home/right-section/rightSection";
import { LeftViewProvider } from "@/components/views/home/left-section/contexts/leftViewContext";
import { RightViewProvider } from "@/components/views/home/right-section/contexts/rightViewContext";
import RightSection from "@/components/views/home/left-section/LeftSection";

export default function HomePage() {
  return (
    <>
      {/* Content area */}
      <div className="flex flex-1">
        {/* Main content */}
        <div className="w-full flex">
          <main className="flex-1 w-8/12">
            {/* Primary column */}
            <section className="flex h-full min-w-0 flex-1 flex-col lg:order-last px-4 sm:px-6">
              <RightSection />
            </section>
          </main>

          {/* Secondary column (hidden on smaller screens) */}
          <aside className="hidden w-4/12 overflow-y-hidden lg:block">
            <LeftSection />
          </aside>
        </div>
      </div>
    </>
  );
}
