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
      <div className="relative flex w-[200px] rounded-md py-0.5 bg-primary-black/5 border-primary-black/10">
        {/* Animated Indicator */}
        <motion.div
          aria-hidden="true"
          className="absolute top-0 left-0 h-full w-[calc(100%/2)] rounded-md bg-primary-red shadow-sm will-change-transform"
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
                  : "text-neutral-dark-grey"
              }`}
          >
            {segment.label}
          </button>
        ))}
      </div>
    </div>
  );
}
