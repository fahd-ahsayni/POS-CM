import Categories from "@/components/views/home/Categories";
import TypeOfOrder from "@/components/views/home/TypeOfOrder";

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
              <Categories />
            </section>
          </main>

          {/* Secondary column (hidden on smaller screens) */}
          <aside className="hidden w-4/12 overflow-y-hidden lg:block">
            <TypeOfOrder />
          </aside>
        </div>
      </div>
    </>
  );
}
