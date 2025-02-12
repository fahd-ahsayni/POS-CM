import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SegmentedControlProps {
  activeTab: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({
  activeTab,
  onChange,
}: SegmentedControlProps) {
  const segments = [
    { value: "cashiers", label: "Cashiers" },
    { value: "managers", label: "Managers" },
    { value: "waiters", label: "Waiters" },
  ];

  return (
    <div className="inline-flex h-9 rounded-lg bg-neutral-bright-grey p-0.5">
      <RadioGroup
        value={activeTab}
        onValueChange={onChange}
        className="group relative inline-grid grid-cols-[1fr_1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/3 after:rounded-md after:bg-primary-red after:shadow-sm after:shadow-black/5 after:outline-offset-2 after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 has-[:focus-visible]:after:outline-ring/70 data-[state=cashiers]:after:translate-x-0 data-[state=managers]:after:translate-x-[100%] data-[state=waiters]:after:translate-x-[200%]"
        data-state={activeTab}
      >
        {segments.map((segment) => (
          <label
            key={segment.value}
            className={`relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 ${
              activeTab === segment.value ? "text-white" : "text-primary-black"
            }`}
          >
            {segment.label}
            <RadioGroupItem value={segment.value} className="sr-only" />
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
