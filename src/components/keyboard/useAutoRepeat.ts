// src/hooks/useAutoRepeat.ts
import { useRef, useCallback } from "react";

export const useAutoRepeat = (callback: () => void, initialDelay = 500, interval = 100) => {
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    callback();
    timeoutRef.current = window.setTimeout(() => {
      intervalRef.current = window.setInterval(() => {
        callback();
      }, interval);
    }, initialDelay);
  }, [callback, initialDelay, interval]);

  const stop = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  return { start, stop };
};
