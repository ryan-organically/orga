"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const shrunkPRef = useRef<HTMLParagraphElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const floatingTextRef = useRef<HTMLParagraphElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const selfieWrapperRef = useRef<HTMLDivElement>(null);
  const heroCTARef = useRef<HTMLAnchorElement>(null);

  const initAnimations = useCallback(() => {
    const h1 = h1Ref.current;
    const shrunkP = shrunkPRef.current;
    const building = buildingRef.current;
    const selfieWrapper = selfieWrapperRef.current;

    if (!h1) return;

    // Hide h1 before split animation
    gsap.set(h1, { opacity: 0 });

    if (shrunkP) gsap.set(shrunkP, { autoAlpha: 0 });
    if (building) gsap.set(building, { autoAlpha: 0 });

    const socialProofChecks = heroRef.current?.querySelectorAll(
      ".hero-social-proof-checks > div"
    );
    if (socialProofChecks?.length) {
      gsap.set(Array.from(socialProofChecks), {
        autoAlpha: 0,
        x: -100,
        rotation: -15,
        scale: 0.5,
      });
    }

    if (selfieWrapper) gsap.set(selfieWrapper, { autoAlpha: 0, x: 100 });

    // Split H1 into words and characters (matching Jekyll)
    const split = SplitText.create(h1, {
      type: "words, chars",
      wordsClass: "word-wrapper",
      charsClass: "char-inner",
    });

    // Wrap each character for mask effect
    split.chars.forEach((char: HTMLElement) => {
      const wrapper = document.createElement("div");
      wrapper.style.cssText =
        "display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.15em";
      char.style.display = "inline-block";
      char.parentNode?.insertBefore(wrapper, char);
      wrapper.appendChild(char);
    });

    const innerChars = h1.querySelectorAll(".char-inner");

    window.scrollTo(0, 0);
    ScrollTrigger.refresh(true);
    gsap.set(h1, { opacity: 1 });
    gsap.set(Array.from(innerChars), { y: 150, opacity: 0 });

    // Animate H1 characters (duration 0.1 matches Jekyll)
    gsap.to(Array.from(innerChars), {
      y: 0,
      opacity: 1,
      duration: 0.1,
      ease: "expo.out",
      stagger: 0.02,
      onComplete: animateShrunkP,
    });

    function animateShrunkP() {
      if (shrunkP) {
        gsap.set(shrunkP, { autoAlpha: 1 });
        const shrunkPSplit = SplitText.create(shrunkP, {
          type: "lines",
          linesClass: "shrunk-p-line",
        });
        gsap.set(shrunkPSplit.lines, { yPercent: 110, opacity: 0 });
        gsap.to(shrunkPSplit.lines, {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: animateSocialProof,
        });
      } else {
        animateSocialProof();
      }
    }

    function animateSocialProof() {
      const checks = heroRef.current?.querySelectorAll(
        ".hero-social-proof-checks > div"
      );

      if (selfieWrapper) {
        gsap.to(selfieWrapper, {
          autoAlpha: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          onComplete: () => {
            const typer = selfieWrapper.querySelector(".selfie-typer");
            if (!typer) return;
            const text =
              "Hello! You're finally awake. Welcome to Organically. I'm Ryan.";
            let i = 0;
            (function type() {
              if (i < text.length) {
                typer.textContent = text.slice(0, i + 1);
                i++;
                setTimeout(type, 50);
              }
            })();
          },
        });
      }

      if (checks?.length) {
        gsap.to(Array.from(checks), {
          autoAlpha: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "elastic.out(1, 0.5)",
          onComplete: animateBuilding,
        });
      } else {
        animateBuilding();
      }
    }

    function animateBuilding() {
      if (!building) return;
      const tl = gsap.timeline();

      tl.to(building, {
        yPercent: 70,
        autoAlpha: 0.6,
        duration: 0.6,
        ease: "power2.out",
      }).to(building, {
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
    if (videoRef.current) {
      gsap.to(videoRef.current, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.8,
      });
    }
  }, []);

  useEffect(() => {
    // Wait for fonts to load before running animations
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        initAnimations();
      });
    } else {
      // Fallback: run after a short delay
      setTimeout(initAnimations, 500);
    }
  }, [initAnimations]);

  // Magnetic CTA effect
  useEffect(() => {
    const cta = heroCTARef.current;
    if (!cta) return;

    const strength = 35;
    const range = 150;

    function onMouseMove(e: MouseEvent) {
      const rect = cta!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < range) {
        const pull = (1 - dist / range) * strength;
        gsap.to(cta, {
          x: (dx / dist) * pull,
          y: (dy / dist) * pull,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(cta, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      }
    }

    function onMouseLeave() {
      gsap.to(cta, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    }

    document.addEventListener("mousemove", onMouseMove);
    cta.addEventListener("mouseleave", onMouseLeave);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      cta.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={heroRef}
      id="home-hero-section"
      className="hero-section home-hero"
      style={{
        paddingBottom: "3vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <p ref={floatingTextRef} className="p2 hero-floating-text">
        Websites for all!
      </p>

      <div
        className="hero-div"
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <h1 ref={h1Ref} className="h1 h1-home">
          Organically<span className="green-span h1-period">.</span>
        </h1>

        <p ref={shrunkPRef} className="shrunk-p">
          Developing sleek, powerful websites that generate search traffic{" "}
          <em>organically.</em>
        </p>

        {/* Social Proof Checkmarks */}
        <div
          className="hero-social-proof-checks"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            marginTop: "1.5rem",
            marginBottom: "1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--orga)", fontWeight: "bold", fontSize: "1.2rem" }}>
              ✓
            </span>
            <span style={{ fontSize: "0.95rem", color: "var(--black-75)" }}>
              SEO-optimized from day one
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--orga)", fontWeight: "bold", fontSize: "1.2rem" }}>
              ✓
            </span>
            <span style={{ fontSize: "0.95rem", color: "var(--black-75)" }}>
              Fast, mobile-first designs
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--orga)", fontWeight: "bold", fontSize: "1.2rem" }}>
              ✓
            </span>
            <span style={{ fontSize: "0.95rem", color: "var(--black-75)" }}>
              Transparent monthly pricing
            </span>
          </div>
        </div>

        {/* Hero CTA Button */}
        <a
          ref={heroCTARef}
          href="/form/"
          className="hero-magnetic-cta"
          style={{
            display: "inline-block",
            marginTop: "1.5rem",
            padding: "1.25rem 3rem",
            fontSize: "1.25rem",
            fontFamily: "Coolvetica Rg, sans-serif",
            fontWeight: 400,
            background: "var(--orga)",
            color: "var(--black-90)",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 0.3s ease",
          }}
        >
          Get Your Free Website Audit
        </a>
      </div>

      {/* Selfie Wrapper */}
      <div
        ref={selfieWrapperRef}
        className="hero-selfie-wrapper"
      >
        <div className="hero-selfie-tile">
          <img
            className="selfie-light"
            src="/darkmode/light duotone selfie.png"
            alt="Ryan Scanlon"
          />
          <img
            className="selfie-dark"
            src="/darkmode/dark duotone selfie.png"
            alt="Ryan Scanlon"
            style={{ display: "none" }}
          />
        </div>
        <p className="selfie-typer" />
      </div>

      {/* Social Proof Review */}
      <div
        className="hero-social-proof"
        style={{ width: "300px", maxWidth: "300px" }}
      >
        <img
          className="hero-social-proof-stars"
          src="/green 5 star.png"
          alt="5 stars"
          style={{ width: "80px" }}
        />
        <p
          style={{
            fontStyle: "italic",
            fontSize: "11px",
            color: "var(--666)",
            marginTop: "0.25rem",
          }}
        >
          &quot;His adaptability, expertise, and willingness to collaborate made
          the project a creative experience that produced an asset for our company
          to use and build on for years to come.&quot;
        </p>
        <p style={{ fontSize: "10px", color: "var(--black-60)", marginTop: "0.25rem" }}>
          — IWC Cabinetry
        </p>
      </div>

      {/* Background Video */}
      <div
        ref={videoRef}
        className="home-hero-vid w-background-video w-background-video-atom"
        style={{ scale: 0, opacity: 0 }}
      >
        <video autoPlay loop muted playsInline style={{ objectFit: "cover" }}>
          <source src="/videos/theme video compressed.webm" type="video/webm" />
        </video>
      </div>

      {/* Steel Building */}
      <img
        ref={buildingRef}
        src="/images/Steel-Building.png"
        alt="Pittsburgh Steel Building"
        className="hero-steel-building"
        srcSet="/images/Steel-Building-p-500.png 500w, /images/Steel-Building-p-800.png 800w, /images/Steel-Building-p-1080.png 1080w, /images/Steel-Building.png 2048w"
        sizes="(max-width: 479px) 60vw, 36vw"
        loading="eager"
      />
    </div>
  );
}
