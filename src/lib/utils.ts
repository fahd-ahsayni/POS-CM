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

export const handleFullScreen = () => {
  if (!document.fullscreenElement) {
    // Try the standard method first
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      // Fallbacks for different browsers
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if ((document.documentElement as any).webkitRequestFullscreen) {
      (document.documentElement as any).webkitRequestFullscreen();
    } else if ((document.documentElement as any).msRequestFullscreen) {
      (document.documentElement as any).msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }
};
