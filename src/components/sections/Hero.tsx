"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

export function Hero() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const floatingTextRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!h1Ref.current) return;

    const ctx = gsap.context(() => {
      // Split H1 into characters
      const split = new SplitText(h1Ref.current, {
        type: "chars",
        charsClass: "char-inner",
      });

      // Wrap each character for mask effect
      split.chars.forEach((char) => {
        const charEl = char as HTMLElement;
        const wrapper = document.createElement("div");
        wrapper.style.display = "inline-block";
        wrapper.style.overflow = "hidden";
        wrapper.style.verticalAlign = "bottom";
        wrapper.style.paddingBottom = "0.15em";
        charEl.style.display = "inline-block";
        charEl.parentNode?.insertBefore(wrapper, charEl);
        wrapper.appendChild(charEl);
      });

      const innerChars = h1Ref.current?.querySelectorAll(".char-inner");
      if (!innerChars || innerChars.length === 0) return;

      // Set initial states
      gsap.set(Array.from(innerChars), { y: 150, opacity: 0 });
      if (taglineRef.current) gsap.set(taglineRef.current, { autoAlpha: 0 });
      if (buildingRef.current) gsap.set(buildingRef.current, { yPercent: 100, autoAlpha: 0 });
      if (videoRef.current) gsap.set(videoRef.current, { scale: 0, opacity: 0, rotation: -10 });

      // Animate H1 characters
      gsap.to(Array.from(innerChars), {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.02,
        onComplete: animateTagline,
      });

      function animateTagline() {
        if (!taglineRef.current) return;
        gsap.set(taglineRef.current, { autoAlpha: 1 });

        const taglineSplit = new SplitText(taglineRef.current, {
          type: "lines",
          linesClass: "tagline-line",
        });

        gsap.set(taglineSplit.lines, { yPercent: 110, opacity: 0 });
        gsap.to(taglineSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: animateBuilding,
        });
      }

      function animateBuilding() {
        // Building animation
        const tl = gsap.timeline();

        tl.to(buildingRef.current, {
          yPercent: 70,
          autoAlpha: 0.6,
          duration: 0.6,
          ease: "power2.out",
        }).to(buildingRef.current, {
          yPercent: 5,
          autoAlpha: 0.8,
          duration: 0.7,
          ease: "power3.out",
        });

        // Floating text animation
        if (floatingTextRef.current) {
          tl.fromTo(
            floatingTextRef.current,
            { opacity: 0, x: 200, y: -50, scale: 0.7, rotation: 15 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              duration: 1.5,
              ease: "back.out(1.7)",
              onComplete: () => {
                gsap.to(floatingTextRef.current, {
                  x: -30,
                  duration: 4,
                  ease: "sine.inOut",
                  yoyo: true,
                  repeat: -1,
                });
              },
            },
            "-=0.5"
          );
        }
      }

      // Video bounce-in
      gsap.to(videoRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.8,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-[80vh] px-8 py-12 overflow-hidden">
      {/* Floating text */}
      <p
        ref={floatingTextRef}
        className="absolute top-8 right-8 text-sm text-333/60 font-ltmuseum italic opacity-0"
      >
        Websites for all!
      </p>

      {/* Main content */}
      <div className="max-w-4xl">
        <h1
          ref={h1Ref}
          className="text-6xl md:text-8xl lg:text-9xl font-coolvetica text-333 mb-6"
        >
          Organically<span className="text-orga">.</span>
        </h1>

        <p
          ref={taglineRef}
          className="text-lg md:text-xl text-333/70 max-w-2xl font-ltmuseum leading-relaxed opacity-0"
        >
          Welcome to Organically: a vast space where stray ideas can wander,
          take root, and quietly grow bold. Combining web creative with organic
          potential.
        </p>
      </div>

      {/* Feature Ticker */}
      <FeatureTicker />

      {/* Social Proof */}
      <div className="mt-12 max-w-xs">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 text-orga fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <p className="text-xs text-333/60 font-ltmuseum italic mb-1">
          IWC Cabinetry
        </p>
        <p className="text-xs text-333/70 font-ltmuseum italic leading-relaxed">
          &quot;His adaptability, expertise, and willingness to collaborate made
          the project a creative experience that produced an asset for our
          company to use and build on for years to come.&quot;
        </p>
      </div>

      {/* Background Video */}
      <div
        ref={videoRef}
        className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-0 pointer-events-none"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover rounded-tl-3xl"
        >
          <source src="/videos/theme video compressed.webm" type="video/webm" />
        </video>
      </div>

      {/* Steel Building */}
      <div className="absolute bottom-0 right-[10%] w-[36vw] pointer-events-none">
        <Image
          ref={buildingRef as React.RefObject<HTMLImageElement>}
          src="/images/Steel-Building.png"
          alt="Pittsburgh Steel Building"
          width={2048}
          height={1000}
          className="w-full h-auto opacity-0"
          priority
        />
      </div>
    </section>
  );
}

function FeatureTicker() {
  const leftTrackRef = useRef<HTMLDivElement>(null);
  const rightTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left ticker (scroll left)
      if (leftTrackRef.current) {
        const width = leftTrackRef.current.scrollWidth / 2;
        gsap.to(leftTrackRef.current, {
          x: -width,
          duration: 20,
          ease: "none",
          repeat: -1,
        });
      }

      // Right ticker (scroll right)
      if (rightTrackRef.current) {
        const width = rightTrackRef.current.scrollWidth / 2;
        gsap.set(rightTrackRef.current, { x: -width });
        gsap.to(rightTrackRef.current, {
          x: 0,
          duration: 25,
          ease: "none",
          repeat: -1,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const leftItems = [
    "White Label Agency",
    "SEO + Design Unified",
    "Custom Development",
    "Zero Templates",
    "AI-Optimized Content",
    "Startup Branding",
  ];

  const rightItems = [
    "Branding Strategy",
    "Technical SEO",
    "Performance First",
    "Conversion Focused",
    "Data-Driven Design",
    "Pittsburgh Based",
    "Frontend for Startups",
  ];

  return (
    <div className="mt-8 space-y-2 overflow-hidden">
      {/* Left ticker */}
      <div className="overflow-hidden">
        <div ref={leftTrackRef} className="flex whitespace-nowrap">
          {[...leftItems, ...leftItems].map((item, i) => (
            <span
              key={i}
              className="inline-block px-4 py-1 mx-2 text-sm font-coolvetica text-333/60 border border-333/20 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Right ticker */}
      <div className="overflow-hidden">
        <div ref={rightTrackRef} className="flex whitespace-nowrap">
          {[...rightItems, ...rightItems].map((item, i) => (
            <span
              key={i}
              className="inline-block px-4 py-1 mx-2 text-sm font-coolvetica text-333/60 border border-333/20 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
