export default function HomePage() {
  return (
    <>
      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Main content */}
        <div className="flex flex-1 items-stretch overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {/* Primary column */}
            <section
              aria-labelledby="primary-heading"
              className="flex h-full min-w-0 bg-red-600 flex-1 flex-col lg:order-last"
            >
              <h1 id="primary-heading" className="sr-only">
                Photos
              </h1>
              {/* Your content */}
            </section>
          </main>

          {/* Secondary column (hidden on smaller screens) */}
          <aside className="hidden w-96 overflow-y-auto border-l border-gray-200 bg-white lg:block">
            {/* Your content */}
          </aside>
        </div>
      </div>
    </>
  );
}
