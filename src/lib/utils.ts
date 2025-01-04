import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatAddress = (address: string): string => {
  // Replace occurrences of "\n" with a space and trim whitespace
  return address.replace(/\n/g, " ").trim();
};

export const truncateName = (name: string, maxLength: number = 18) => {
  return name.length > maxLength
    ? `${name.toLowerCase().slice(0, maxLength)}...`
    : name.toLowerCase();
};
