"use client";

import { useRef, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGSAP(
  callback?: () => gsap.core.Timeline | void,
  deps: React.DependencyList = []
) {
  const ctx = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    ctx.current = gsap.context(() => {
      callback?.();
    });

    return () => ctx.current?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const contextSafe = useCallback(
    <T extends (...args: unknown[]) => void>(fn: T): T => {
      return ((...args: unknown[]) => {
        ctx.current?.add(() => fn(...args));
      }) as T;
    },
    []
  );

  return { context: ctx.current, contextSafe };
}
