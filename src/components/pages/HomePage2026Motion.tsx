"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Script from "next/script";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  type Variants,
} from "framer-motion";

// ─────────────────────────────────────────────
// MOTION-HEAVY 2026 Homepage for Organically
// Built entirely with Framer Motion (no GSAP)
//
// Animation count: 14 distinct animations
//   1.  H1 letter cascade on load
//   2.  Green period scale-bounce
//   3.  Tagline scroll-reveal left-to-right
//   4.  Hero CTA fade-up entrance
//   5.  Ticker infinite scroll (2 rows)
//   6.  Services blur-in staggered
//   7.  Service arrow hover slide
//   8.  Portfolio tiles rotate-on-scroll
//   9.  Portfolio tile hover lift
//   10. CTA pulse animation
//   11. Footer text infinite wiggle
//   12. Dark mode smooth transition (all colors)
//   13. Social proof stars stagger-in
//   14. Section divider draw-in
//
// Estimated LOC: ~680
// ─────────────────────────────────────────────

// ═══════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════

const SERVICES = [
  {
    name: "Web Design",
    href: "/web-design/",
    description: "Custom sites that convert visitors into customers.",
  },
  {
    name: "SEO",
    href: "/seo/",
    description: "Organic traffic strategies that compound over time.",
  },
  {
    name: "Branding",
    href: "/branding/",
    description: "Visual identities that stick in people's minds.",
  },
  {
    name: "Front-End Dev",
    href: "/web-design/",
    description: "Performant, accessible interfaces built right.",
  },
] as const;

const PORTFOLIO = [
  {
    title: "IWC Cabinetry",
    category: "Web Design + SEO",
    color: "#7ec700",
  },
  {
    title: "Steel City Valet",
    category: "Branding + Web",
    color: "#009dff",
  },
  {
    title: "PGH Contracting",
    category: "SEO + Content",
    color: "#ffb612",
  },
  {
    title: "Bloom Therapy",
    category: "Full Rebrand",
    color: "#8138ff",
  },
  {
    title: "Riverview Labs",
    category: "Front-End Dev",
    color: "#ff4444",
  },
  {
    title: "Forge & Foundry",
    category: "Web Design",
    color: "#7ec700",
  },
] as const;

const TICKER_ITEMS = [
  "White Label Agency",
  "SEO + Design Unified",
  "Custom Development",
  "Zero Templates",
  "AI-Optimized Content",
  "Startup Branding",
  "Branding Strategy",
  "Technical SEO",
  "Performance First",
  "Conversion Focused",
  "Data-Driven Design",
  "Pittsburgh Based",
];

// ═══════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════

const letterVariants: Variants = {
  hidden: { y: 120, opacity: 0, rotateX: -80 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.04,
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
    },
  }),
};

const periodVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: [0, 1.6, 1],
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const taglineWordVariants: Variants = {
  hidden: { opacity: 0, x: -30, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const serviceVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(16px)", y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const starVariants: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      delay: 1.2 + i * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  }),
};

const dividerVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

function CascadingH1() {
  const letters = "Organically".split("");

  return (
    <h1
      className="font-[var(--font-coolvetica)] text-6xl font-normal tracking-tight sm:text-7xl lg:text-8xl"
      style={{ perspective: 600 }}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "inline-block",
            transformOrigin: "bottom center",
          }}
        >
          {letter}
        </motion.span>
      ))}
      <motion.span
        variants={periodVariants}
        initial="hidden"
        animate="visible"
        className="text-[#7ec700]"
        style={{ display: "inline-block" }}
      >
        .
      </motion.span>
    </h1>
  );
}

function ScrollRevealTagline() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const words =
    "Solo marketing studio in Pittsburgh. We build websites that rank and bring you customers through organic search.".split(
      " "
    );

  return (
    <p
      ref={ref}
      className="mt-6 max-w-xl text-lg leading-relaxed sm:text-xl"
      style={{ color: "var(--tagline-color)" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={taglineWordVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          style={{ display: "inline-block", marginRight: "0.3em" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

function InfiniteTickerRow({
  items,
  direction = "left",
  speed = 25,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-2 inline-block rounded-full border px-4 py-1 text-sm"
            style={{
              fontFamily: "var(--font-coolvetica)",
              borderColor: "var(--ticker-border)",
              color: "var(--ticker-text)",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function PortfolioTile({
  project,
  index,
}: {
  project: (typeof PORTFOLIO)[number];
  index: number;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Each tile rotates differently based on index
  const rotateBase = index % 2 === 0 ? 8 : -8;
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [rotateBase, 0, -rotateBase]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [60, 0, -60]);

  return (
    <motion.div
      ref={ref}
      style={{ rotate, scale, y }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        transition: { duration: 0.3 },
      }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl"
    >
      <div
        className="flex aspect-[4/3] flex-col items-center justify-center p-8"
        style={{ backgroundColor: `${project.color}15` }}
      >
        <div
          className="mb-4 h-16 w-16 rounded-full"
          style={{ backgroundColor: project.color, opacity: 0.6 }}
        />
        <h3
          className="text-center text-xl font-normal tracking-tight sm:text-2xl"
          style={{
            fontFamily: "var(--font-coolvetica)",
            color: "var(--heading-color)",
          }}
        >
          {project.title}
        </h3>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--muted-color)" }}
        >
          {project.category}
        </p>
      </div>
      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center rounded-2xl opacity-0 group-hover:opacity-100"
        style={{ backgroundColor: project.color }}
        initial={false}
        whileHover={{ opacity: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <span
          className="text-lg font-medium text-white"
          style={{ fontFamily: "var(--font-coolvetica)" }}
        >
          View Project
        </span>
      </motion.div>
    </motion.div>
  );
}

function PulseCTA() {
  return (
    <motion.div
      className="mt-10 inline-block"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
    >
      <Link href="/form/">
        <motion.span
          className="relative inline-block border-b-2 border-[#7ec700] pb-1 text-base font-medium tracking-wide sm:text-lg"
          style={{ color: "var(--heading-color)" }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(126, 199, 0, 0)",
              "0 0 0 12px rgba(126, 199, 0, 0.25)",
              "0 0 0 0 rgba(126, 199, 0, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Get a free audit
        </motion.span>
      </Link>
    </motion.div>
  );
}

function WigglyFooterText({ children }: { children: string }) {
  const letters = children.split("");

  return (
    <span>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          animate={{
            y: [0, -2, 0, 2, 0],
            rotate: [0, -1, 0, 1, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.06,
            ease: "easeInOut",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

function SocialProofStars() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          custom={i}
          variants={starVariants}
          initial="hidden"
          animate="visible"
          className="h-4 w-4 fill-current text-[#7ec700]"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </motion.svg>
      ))}
    </div>
  );
}

function AnimatedDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      variants={dividerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="h-px w-full origin-left"
      style={{ backgroundColor: "var(--divider-color)" }}
    />
  );
}

// ═══════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════

export default function HomePage2026Motion() {
  const [isDark, setIsDark] = useState(false);
  const servicesRef = useRef(null);
  const servicesInView = useInView(servicesRef, {
    once: true,
    margin: "-80px",
  });

  // Persist dark mode preference
  useEffect(() => {
    const stored = localStorage.getItem("orga-dark");
    if (stored === "true") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDark = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("orga-dark", String(next));
      return next;
    });
  }, []);

  // CSS custom properties for dark mode smooth transitions
  const themeStyles = {
    "--bg-color": isDark ? "#0a0a0a" : "#ffffff",
    "--heading-color": isDark ? "#f5f5f5" : "#1a1a1a",
    "--body-color": isDark ? "#a3a3a3" : "#525252",
    "--muted-color": isDark ? "#737373" : "#a3a3a3",
    "--tagline-color": isDark ? "#a3a3a3" : "#737373",
    "--divider-color": isDark ? "#262626" : "#e5e5e5",
    "--card-bg": isDark ? "#141414" : "#fafafa",
    "--ticker-border": isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
    "--ticker-text": isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
    "--footer-bg": isDark ? "#0e0f19" : "#1a1a1a",
    "--toggle-bg": isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    "--toggle-border": isDark ? "#404040" : "#d4d4d4",
  } as React.CSSProperties;

  return (
    <motion.div
      className="min-h-screen"
      style={{
        ...themeStyles,
        backgroundColor: "var(--bg-color)",
        color: "var(--body-color)",
        transition:
          "background-color 0.6s cubic-bezier(0.4, 0, 0.2, 1), color 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* ── Dark mode toggle ── */}
      <motion.button
        onClick={toggleDark}
        aria-label="Toggle dark mode"
        className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur"
        style={{
          backgroundColor: "var(--toggle-bg)",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "var(--toggle-border)",
          transition:
            "background-color 0.6s ease, border-color 0.6s ease",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.svg
              key="sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
              style={{ color: "var(--heading-color)" }}
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
              style={{ color: "var(--heading-color)" }}
              initial={{ rotate: 90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <main className="flex min-h-screen flex-col justify-center px-6 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-3xl py-32">
          <CascadingH1 />
          <ScrollRevealTagline />
          <PulseCTA />

          {/* Social proof */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <SocialProofStars />
            <p
              className="mt-2 text-xs italic"
              style={{
                fontFamily: "var(--font-ltmuseum)",
                color: "var(--muted-color)",
              }}
            >
              IWC Cabinetry
            </p>
            <p
              className="mt-1 max-w-xs text-xs italic leading-relaxed"
              style={{
                fontFamily: "var(--font-ltmuseum)",
                color: "var(--body-color)",
              }}
            >
              &quot;His adaptability, expertise, and willingness to collaborate
              made the project a creative experience that produced an asset for
              our company to use and build on for years to come.&quot;
            </p>
          </motion.div>
        </div>
      </main>

      {/* ── Ticker ── */}
      <section className="overflow-hidden py-6" style={{ backgroundColor: "var(--card-bg)" }}>
        <div className="space-y-3">
          <InfiniteTickerRow
            items={TICKER_ITEMS.slice(0, 6)}
            direction="left"
            speed={30}
          />
          <InfiniteTickerRow
            items={TICKER_ITEMS.slice(6)}
            direction="right"
            speed={35}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVICES (blur-in staggered)
          ══════════════════════════════════════════ */}
      <section
        aria-labelledby="services-heading"
        className="px-6 py-28 sm:px-12 sm:py-36 lg:px-24"
      >
        <AnimatedDivider />
        <div ref={servicesRef} className="mx-auto mt-16 w-full max-w-3xl">
          <motion.h2
            id="services-heading"
            className="mb-16 text-sm font-medium uppercase tracking-widest"
            style={{ color: "var(--muted-color)" }}
            initial={{ opacity: 0, x: -20 }}
            animate={servicesInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Services
          </motion.h2>

          <ul className="space-y-8">
            {SERVICES.map((s, i) => (
              <motion.li
                key={s.name}
                custom={i}
                variants={serviceVariants}
                initial="hidden"
                animate={servicesInView ? "visible" : "hidden"}
              >
                <Link
                  href={s.href}
                  className="group flex items-center justify-between pb-8"
                  style={{
                    borderBottomWidth: 1,
                    borderBottomStyle: "solid",
                    borderBottomColor: "var(--divider-color)",
                  }}
                >
                  <div>
                    <span
                      className="text-2xl font-normal tracking-tight sm:text-3xl lg:text-4xl"
                      style={{
                        fontFamily: "var(--font-coolvetica)",
                        color: "var(--heading-color)",
                      }}
                    >
                      {s.name}
                    </span>
                    <span
                      className="mt-1 block text-sm"
                      style={{ color: "var(--muted-color)" }}
                    >
                      {s.description}
                    </span>
                  </div>
                  <motion.span
                    aria-hidden="true"
                    className="text-xl"
                    style={{ color: "var(--muted-color)" }}
                    whileHover={{ x: 6, color: "#7ec700" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    &rarr;
                  </motion.span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PORTFOLIO (rotate on scroll)
          ══════════════════════════════════════════ */}
      <section
        aria-labelledby="portfolio-heading"
        className="px-6 py-28 sm:px-12 sm:py-36 lg:px-24"
      >
        <AnimatedDivider />
        <div className="mx-auto mt-16 w-full max-w-5xl">
          <PortfolioHeader />

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO.map((project, i) => (
              <PortfolioTile key={project.title} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CALENDLY (CTA with pulse)
          ══════════════════════════════════════════ */}
      <section
        aria-labelledby="schedule-heading"
        className="px-6 py-28 sm:px-12 sm:py-36 lg:px-24"
      >
        <AnimatedDivider />
        <CalendlySection />
      </section>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      {/* ══════════════════════════════════════════
          FOOTER (infinite wiggle text)
          ══════════════════════════════════════════ */}
      <footer
        className="px-6 py-16 sm:px-12 lg:px-24"
        style={{
          backgroundColor: "var(--footer-bg)",
          transition: "background-color 0.6s ease",
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          {/* Left */}
          <div>
            <p
              className="text-2xl font-normal tracking-tight text-white"
              style={{ fontFamily: "var(--font-coolvetica)" }}
            >
              <WigglyFooterText>Organically</WigglyFooterText>
              <span className="text-[#7ec700]">.</span>
            </p>
            <motion.p
              className="mt-2 text-sm text-neutral-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Pittsburgh, PA
            </motion.p>
          </div>

          {/* Right */}
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-400"
          >
            {[
              { href: "/seo/", label: "SEO" },
              { href: "/web-design/", label: "Web Design" },
              { href: "/blog/", label: "Blog" },
              { href: "/privacy-policy/", label: "Privacy" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-3xl items-center justify-between text-xs text-neutral-500">
          <span>&copy; {new Date().getFullYear()} Organically SEO</span>
          <div className="flex gap-4">
            <a
              href="https://twitter.com/organicallyseo"
              aria-label="X (Twitter)"
              className="transition-colors hover:text-white"
            >
              X
            </a>
            <a
              href="https://www.linkedin.com/in/ryan-scanlon31/"
              aria-label="LinkedIn"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════
// SUB-SECTIONS (kept separate for clarity)
// ═══════════════════════════════════════════════

function PortfolioHeader() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.h2
      ref={ref}
      id="portfolio-heading"
      className="text-sm font-medium uppercase tracking-widest"
      style={{ color: "var(--muted-color)" }}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      Selected Work
    </motion.h2>
  );
}

function CalendlySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="mx-auto mt-16 w-full max-w-3xl">
      <motion.h2
        id="schedule-heading"
        className="mb-4 text-sm font-medium uppercase tracking-widest"
        style={{ color: "var(--muted-color)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        Let&rsquo;s talk
      </motion.h2>
      <motion.p
        className="mb-8 max-w-md"
        style={{ color: "var(--body-color)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        Pick a time that works. No pressure, no pitch deck &mdash; just a
        conversation about what you need.
      </motion.p>

      {/* Pulsing CTA button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
      >
        <motion.a
          href="https://calendly.com/ryan-organically/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-medium text-black"
          style={{
            backgroundColor: "#7ec700",
            fontFamily: "var(--font-coolvetica)",
          }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(126, 199, 0, 0)",
              "0 0 0 16px rgba(126, 199, 0, 0.2)",
              "0 0 0 0 rgba(126, 199, 0, 0)",
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          Schedule a Call
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            &rarr;
          </motion.span>
        </motion.a>
      </motion.div>

      {/* Calendly embed */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div
          className="calendly-inline-widget min-h-[660px] w-full"
          data-url="https://calendly.com/ryan-organically/30min"
        />
      </motion.div>
    </div>
  );
}
