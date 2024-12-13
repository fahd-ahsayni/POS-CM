import { motion } from "framer-motion";

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
  ];

  return (
    <div className="relative">
      <div className="relative flex w-[200px] rounded-lg py-0.5 bg-zinc-300/10 border-zinc-300/10">
        {/* Animated Indicator */}
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-0 h-full w-[calc(100%/2)] rounded-lg bg-red-600 shadow-sm will-change-transform"
          layout
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
            mass: 0.8,
          }}
          animate={{
            x: `${
              segments.findIndex((segment) => segment.value === activeTab) * 100
            }%`,
          }}
        />
        {/* Tab Triggers */}
        {segments.map((segment) => (
          <button
            key={segment.value}
            onClick={() => onChange(segment.value)}
            className={`relative z-10 flex-1 flex items-center justify-center h-8 text-sm
              transition-colors duration-200
              ${
                activeTab === segment.value
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
          >
            {segment.label}
          </button>
        ))}
      </div>
    </div>
  );
}
