"use client";
import { useEffect, useCallback, type RefObject } from "react";

type EventType =
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "focusin"
  | "focusout";

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  refs: RefObject<T | null> | RefObject<T | null>[],
  handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = "mousedown",
  eventListenerOptions: AddEventListenerOptions = {}
): void {
  // Memoized event handler to avoid unnecessary re-renders
  const handleClickOutside = useCallback(
    (event: MouseEvent | TouchEvent | FocusEvent) => {
      const target = event.target as Node;

      if (!target?.isConnected) return;

      // Ignore clicks inside an input, textarea, or select
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      const isOutside = Array.isArray(refs)
        ? refs
            .filter((r) => Boolean(r.current))
            .every((r) => r.current && !r.current.contains(target))
        : refs.current && !refs.current.contains(target);

      if (isOutside) {
        handler(event);
      }
    },
    [refs, handler]
  );

  useEffect(() => {
    document.addEventListener(
      eventType,
      handleClickOutside,
      eventListenerOptions
    );

    return () => {
      document.removeEventListener(
        eventType,
        handleClickOutside,
        eventListenerOptions
      );
    };
  }, [eventType, handleClickOutside, eventListenerOptions]);
}
