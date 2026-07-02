"use client";

import { useEffect, useState, useRef } from "react";

interface UseCounterAnimationOptions {
  end: number;
  duration?: number;
  start?: number;
  enabled?: boolean;
}

export function useCounterAnimation({
  end,
  duration = 2000,
  start = 0,
  enabled = true,
}: UseCounterAnimationOptions) {
  const [value, setValue] = useState(start);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(end);
      return;
    }

    startTimeRef.current = null;
    const range = end - start;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + range * eased));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, start, enabled]);

  return value;
}
