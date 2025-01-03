import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
}

export function BlurImage({
  src,
  alt,
  className,
  loadingClassName,
  ...props
}: BlurImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div {...props} className="relative overflow-hidden w-full h-full">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Skeleton className={cn("w-full h-full", loadingClassName)} />
          </motion.div>
        )}
      </AnimatePresence>

      {!error && (
        <motion.img
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          className={cn(
            "w-full h-full object-cover",
            isLoading
              ? "scale-110 blur-2xl opacity-0"
              : "scale-100 blur-0 opacity-100",
            className
          )}
          style={{ transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)" }}
          onLoad={(e) => {
            if ((e.target as HTMLImageElement).complete) {
              setIsLoading(false);
            }
          }}
          onError={() => setError(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
