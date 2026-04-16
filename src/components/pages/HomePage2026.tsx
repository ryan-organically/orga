"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";

// ─────────────────────────────────────────────
// Minimalist 2026 Homepage for Organically
// Design rationale: Radical white space and typographic
// restraint let the brand name carry the page. Every
// element earns its place; nothing decorates.
// Estimated LOC: ~280
// ─────────────────────────────────────────────

const SERVICES = [
  { name: "Web Design", href: "/web-design/" },
  { name: "SEO", href: "/seo/" },
  { name: "Branding", href: "/branding/" },
  { name: "Front-End Dev", href: "/web-design/" },
] as const;

export default function HomePage2026() {
  const [isDark, setIsDark] = useState(false);

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

  return (
    <div className="min-h-screen bg-white text-neutral-900 transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100">
      {/* ── Dark mode toggle (fixed) ── */}
      <button
        onClick={toggleDark}
        aria-label="Toggle dark mode"
        className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-sm backdrop-blur transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/80 dark:hover:border-neutral-500"
      >
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-5 w-5"
          >
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>

      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <main className="flex min-h-screen flex-col justify-center px-6 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-3xl py-32">
          <h1 className="font-[var(--font-coolvetica)] text-6xl font-normal tracking-tight sm:text-7xl lg:text-8xl">
            Organically
            <span className="text-[#7ec700]">.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-xl">
            Solo marketing studio in Pittsburgh. We build websites that rank
            and bring you customers through organic search.
          </p>

          <Link
            href="/form/"
            className="mt-10 inline-block border-b-2 border-[#7ec700] pb-1 text-base font-medium tracking-wide text-neutral-900 transition-colors hover:text-[#7ec700] dark:text-neutral-100 dark:hover:text-[#7ec700] sm:text-lg"
          >
            Get a free audit
          </Link>
        </div>
      </main>

      {/* ══════════════════════════════════════════
          SERVICES
          ══════════════════════════════════════════ */}
      <section
        aria-labelledby="services-heading"
        className="border-t border-neutral-200 px-6 py-28 dark:border-neutral-800 sm:px-12 sm:py-36 lg:px-24"
      >
        <div className="mx-auto w-full max-w-3xl">
          <h2
            id="services-heading"
            className="mb-16 text-sm font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
          >
            Services
          </h2>

          <ul className="space-y-8">
            {SERVICES.map((s) => (
              <li key={s.name}>
                <Link
                  href={s.href}
                  className="group flex items-center justify-between border-b border-neutral-100 pb-8 transition-colors dark:border-neutral-800"
                >
                  <span className="text-2xl font-normal tracking-tight sm:text-3xl lg:text-4xl">
                    {s.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-neutral-300 transition-transform group-hover:translate-x-1 dark:text-neutral-600"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CALENDLY
          ══════════════════════════════════════════ */}
      <section
        aria-labelledby="schedule-heading"
        className="border-t border-neutral-200 px-6 py-28 dark:border-neutral-800 sm:px-12 sm:py-36 lg:px-24"
      >
        <div className="mx-auto w-full max-w-3xl">
          <h2
            id="schedule-heading"
            className="mb-4 text-sm font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
          >
            Let&rsquo;s talk
          </h2>
          <p className="mb-12 max-w-md text-neutral-500 dark:text-neutral-400">
            Pick a time that works. No pressure, no pitch deck &mdash; just
            a conversation about what you need.
          </p>

          <div
            className="calendly-inline-widget min-h-[660px] w-full"
            data-url="https://calendly.com/ryan-organically/30min"
          />
        </div>
      </section>

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      {/* ══════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════ */}
      <footer className="border-t border-neutral-200 px-6 py-16 dark:border-neutral-800 sm:px-12 lg:px-24">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          {/* Left */}
          <div>
            <p className="text-2xl font-normal tracking-tight">
              Organically<span className="text-[#7ec700]">.</span>
            </p>
            <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500">
              Pittsburgh, PA
            </p>
          </div>

          {/* Right */}
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Link href="/seo/" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">SEO</Link>
            <Link href="/web-design/" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">Web Design</Link>
            <Link href="/blog/" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">Blog</Link>
            <Link href="/privacy-policy/" className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100">Privacy</Link>
          </nav>
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-3xl items-center justify-between text-xs text-neutral-400 dark:text-neutral-600">
          <span>&copy; {new Date().getFullYear()} Organically SEO</span>
          <div className="flex gap-4">
            <a
              href="https://twitter.com/organicallyseo"
              aria-label="X (Twitter)"
              className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              X
            </a>
            <a
              href="https://www.linkedin.com/in/ryan-scanlon31/"
              aria-label="LinkedIn"
              className="transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
