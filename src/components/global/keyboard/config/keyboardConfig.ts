import { Delete, ChevronDownIcon } from "lucide-react";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { BsShift } from "react-icons/bs";

export interface KeyboardKey {
  label: string;
  color?: string;
  isIcon?: boolean; // Optional
  icon?: React.FC<React.SVGProps<SVGSVGElement>>; // Optional
}

export interface KeyboardRow {
  keys: KeyboardKey[];
}

interface KeyboardConfig {
  layout: KeyboardRow[];
  grid: {
    bgColor: string;
    padding: number;
    gap: number;
    cols: number;
    maxWidth: string;
  };
}

export const keyboardConfig: KeyboardConfig = {
  layout: [
    {
      keys: [
        { label: "q" },
        { label: "w" },
        { label: "e" },
        { label: "r" },
        { label: "t" },
        { label: "y" },
        { label: "u" },
        { label: "i" },
        { label: "o" },
        { label: "p" },
        { label: "delete", isIcon: true, icon: Delete, color: "bg-[#3F4042]" },
      ],
    },
    {
      keys: [
        { label: "a" },
        { label: "s" },
        { label: "d" },
        { label: "f" },
        { label: "g" },
        { label: "h" },
        { label: "j" },
        { label: "k" },
        { label: "l" },
        {
          label: "enter",
          isIcon: true,
          icon: IoReturnDownBackOutline,
          color: "bg-red-600 text-white col-span-2",
        },
      ],
    },
    {
      keys: [
        {
          label: "Shift",
          color: "bg-[#3F4042] col-span-2",
          isIcon: true,
          icon: BsShift,
        },
        { label: "z" },
        { label: "x" },
        { label: "c" },
        { label: "v" },
        { label: "b" },
        { label: "n" },
        { label: "m" },
        { label: "," },
        { label: "." },
      ],
    },
    {
      keys: [
        { label: "123", color: "bg-[#3F4042] col-span-2" },
        { label: "space", color: "col-span-7 bg-[#646567]" },
        {
          label: "toggle",
          isIcon: true,
          icon: ChevronDownIcon,
          color: "bg-[#3F4042] col-span-2",
        },
      ],
    },
  ],
  grid: {
    cols: 11,
    gap: 2,
    maxWidth: "700px",
    padding: 4,
    bgColor: "bg-secondary-black",
  },
};

export const numbersRow: KeyboardRow = {
  keys: [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "0" },
    { label: "-", color: "bg-[#3F4042]" },
  ],
};
