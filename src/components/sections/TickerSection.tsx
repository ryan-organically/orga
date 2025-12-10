"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function TickerSection() {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current) return;

    const ctx = gsap.context(() => {
      const tickerWidth = tickerRef.current!.scrollWidth / 3;

      gsap.to(tickerRef.current, {
        x: -tickerWidth,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => `${parseFloat(x) % tickerWidth}px`,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const text = "Proven to move the needle Organically. ";

  return (
    <section className="py-8 bg-rich-black overflow-hidden">
      <div ref={tickerRef} className="whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className="inline-block text-4xl md:text-6xl font-coolvetica text-e2"
          >
            {text}
            <span className="text-orga">. </span>
          </span>
        ))}
      </div>
    </section>
  );
}
