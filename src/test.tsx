
export default function Component() {
  return (
    <div className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
      <div className="flex grow items-start gap-3">
        <img src="/images/products/1.png" alt="" width={34} height={24} />
        <div className="grid gap-2">
          <p>
            Product Name
          </p>
          <p className="text-xs text-muted-foreground">24 MAD</p>
        </div>
      </div>
    </div>
  );
}
