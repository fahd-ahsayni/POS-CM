import React from "react";
import { motion } from "framer-motion";

interface KeyProps {
  label?: string;
  color?: string;
  isWide?: boolean;
  isIcon?: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

const Key: React.FC<KeyProps> = ({
  label,
  color = "bg-[#646567]",
  isWide,
  isIcon = false,
  icon: Icon,
  onClick,
}) => {
  const baseClasses =
    "flex items-center justify-center rounded-md p-3 text-lg transition-shadow border border-black/20 text-white";

  const displayLabel = label === "space" ? "" : label;

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      transition={{ duration: 0.15 }}
      aria-label={label}
      className={`${baseClasses} ${color} ${
        isWide ? "col-span-6" : "w-full h-12"
      }`}
      onClick={onClick}
    >
      {isIcon && Icon ? <Icon className="w-5 h-5" /> : displayLabel}
    </motion.button>
  );
};

export default React.memo(Key);
