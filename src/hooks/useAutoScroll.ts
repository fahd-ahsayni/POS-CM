import { useEffect, useRef } from 'react';

/**
 * Hook to automatically scroll to bottom when dependencies change or when the element
 * is not in view
 * @param dependencies Array of dependencies that trigger auto-scroll when changed
 * @param options Scroll behavior options
 * @returns ref to attach to the target element
 */
export function useAutoScroll(
  dependencies: any[],
  options: { behavior?: ScrollBehavior; threshold?: number } = {}
) {
  const { behavior = 'smooth', threshold = 0.1 } = options;
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create an Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // If bottom element is not visible, scroll to it
        if (!entry.isIntersecting) {
          elementRef.current?.scrollIntoView({ behavior });
        }
      },
      { threshold } // Trigger when element visibility crosses this threshold
    );
    
    // Start observing the element
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    // Always scroll to element when dependencies change
    elementRef.current?.scrollIntoView({ behavior });
    
    // Clean up
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, dependencies);
  
  return elementRef;
}
