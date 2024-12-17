export function Loading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-primary rounded-full"
        role="status"
        aria-label="loading"
      />
    </div>
  );
}
