"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import styles from "./HomePageTypography.module.css";

// ─────────────────────────────────────────────────────────────
// Design 8: TYPOGRAPHY-FOCUSED 2026 Homepage
//
// Font pairing: Crimson Pro (serif) + Inter (geometric sans)
// Philosophy: Typography IS the design. Massive scale contrasts,
// generous whitespace, zero images (except hero video bg).
// Every piece of information is scannable in seconds.
//
// Estimated LOC: ~850 (component ~400 + CSS ~450)
//
// Font pairing rationale:
//   Crimson Pro — An elegant, high-contrast serif with thin
//   hairlines and refined proportions. Its light/extralight
//   weights at massive sizes create dramatic negative space
//   within the letterforms themselves, turning the headline
//   into a visual element. The italic cuts add warmth to
//   pull quotes and CTAs without introducing a third typeface.
//
//   Inter — A geometric sans designed specifically for screens.
//   Its open apertures and tall x-height ensure legibility at
//   the tiny 10-12px sizes used for labels, navigation, and
//   metadata. The neutrality of Inter lets Crimson Pro command
//   attention without competition.
//
//   Together they create a classical editorial hierarchy:
//   serif for display/emotional, sans for utility/navigational.
// ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    name: "Web Design",
    href: "/web-design/",
    description:
      "Custom websites that convert visitors into customers. No templates. Every pixel intentional.",
  },
  {
    name: "SEO",
    href: "/seo/",
    description:
      "Organic search strategy that drives real traffic. Keywords, content, and technical optimization.",
  },
  {
    name: "Branding",
    href: "/branding/",
    description:
      "Visual identities that resonate. Logos, typography, and brand systems built from your vision.",
  },
  {
    name: "Front-End Dev",
    href: "/web-design/",
    description:
      "Responsive, performant interfaces with modern technologies. Speed and accessibility first.",
  },
  {
    name: "Digital PR",
    href: "/seo/",
    description:
      "Strategic storytelling and outreach that amplifies your message across digital channels.",
  },
] as const;

const PORTFOLIO = [
  { title: "IWC Cabinetry", tags: "Web Design \u00B7 Branding", href: "#" },
  {
    title: "Landscaping & Lawncare",
    tags: "SEO \u00B7 Web Design",
    href: "/landscaping-lawncare/",
  },
  {
    title: "Local Dental Practice",
    tags: "Local SEO \u00B7 Content",
    href: "/local-seo-dentists/",
  },
  {
    title: "Contractor Funnel",
    tags: "Web Design \u00B7 SEO \u00B7 Development",
    href: "/contractor-funnel/",
  },
] as const;

const INSIGHTS = [
  {
    title: "What is SEO?",
    category: "Marketing",
    date: "Updated April 2024",
    href: "/what-is-seo/",
  },
  {
    title: "Webflow Launch Checklist",
    category: "Design",
    date: "September 2024",
    href: "/webflow-launch-checklist/",
  },
  {
    title: "Basics of Branding: How to Build Your Own Brand",
    category: "Branding",
    date: "June 2024",
    href: "/branding-basics/",
  },
  {
    title: "Webflow vs. Figma",
    category: "Design",
    date: "July 2023",
    href: "/webflow-vs-figma/",
  },
] as const;

const STATS = [
  { value: "2.5M", label: "Impressions Generated" },
  { value: "100%", label: "Custom Built" },
  { value: "AI", label: "Search Optimized" },
] as const;

/* ── Intersection Observer hook ── */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ── Arrow icon ── */
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/* ── Section label ── */
function SectionLabel({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${styles.sectionLabel} ${visible ? styles.visible : ""}`}
    >
      <span className={styles.sectionNumber}>{number}</span>
      {text}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function HomePageTypography() {
  /* ── Reveal refs for major sections ── */
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    // Hero is visible on mount (no scroll needed)
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <div className={styles.page}>
        {/* ─────────── NAVIGATION ─────────── */}
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLogo}>
            <span>Organically</span>
          </Link>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/web-design/">Web Design</Link>
            </li>
            <li>
              <Link href="/seo/">SEO</Link>
            </li>
            <li>
              <Link href="/branding/">Branding</Link>
            </li>
            <li>
              <Link href="/blog/">Blog</Link>
            </li>
            <li>
              <Link href="/about-us/">About</Link>
            </li>
          </ul>
          <a
            href="https://calendly.com/organically/30min"
            className={styles.navCta}
          >
            Schedule a Call
          </a>
        </nav>

        {/* ─────────── HERO ─────────── */}
        <section className={styles.hero}>
          <div className={styles.heroVideoWrap}>
            <video autoPlay loop muted playsInline>
              <source
                src="/videos/theme video compressed.webm"
                type="video/webm"
              />
            </video>
          </div>

          <div
            ref={heroRef}
            className={`${styles.heroContent} ${heroVisible ? styles.visible : ""}`}
          >
            <h1 className={styles.heroTitle}>
              Organically<span className={styles.period}>.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Web Creative with Organic Potential
            </p>
            <p className={styles.heroTagline}>
              Where stray ideas wander, take root, and quietly grow bold.
            </p>
          </div>

          <div className={styles.scrollIndicator}>
            <span>Scroll</span>
            <div className={styles.scrollLine} />
          </div>
        </section>

        {/* ─────────── SERVICES ─────────── */}
        <section className={styles.section}>
          <div className={styles.services}>
            <SectionLabel number="01" text="Services" />

            <ul className={styles.servicesList}>
              {SERVICES.map((svc, i) => (
                <ServiceItem key={svc.name} service={svc} index={i} />
              ))}
            </ul>
          </div>
        </section>

        {/* ─────────── STATEMENT ─────────── */}
        <section className={styles.section}>
          <StatementBlock />
        </section>

        <div className={styles.divider} />

        {/* ─────────── STATS ─────────── */}
        <section className={styles.section}>
          <SectionLabel number="02" text="Results" />
          <div className={styles.stats}>
            {STATS.map((stat) => (
              <StatItem key={stat.label} stat={stat} />
            ))}
          </div>
        </section>

        {/* ─────────── TESTIMONIAL ─────────── */}
        <section className={styles.section}>
          <TestimonialBlock />
        </section>

        <div className={styles.divider} />

        {/* ─────────── PORTFOLIO ─────────── */}
        <section className={styles.section}>
          <div className={styles.portfolio}>
            <SectionLabel number="03" text="Selected Work" />
            <ul className={styles.portfolioList}>
              {PORTFOLIO.map((item) => (
                <PortfolioItem key={item.title} item={item} />
              ))}
            </ul>
          </div>
        </section>

        {/* ─────────── INSIGHTS ─────────── */}
        <section className={styles.section}>
          <div className={styles.insights}>
            <SectionLabel number="04" text="Insights" />
            <ul className={styles.insightsList}>
              {INSIGHTS.map((item) => (
                <InsightItem key={item.title} item={item} />
              ))}
            </ul>
          </div>
        </section>

        <div className={styles.divider} />

        {/* ─────────── CTA ─────────── */}
        <section className={styles.section}>
          <CtaBlock />
        </section>

        {/* ─────────── FOOTER ─────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerLeft}>
              <Link href="/" className={styles.footerMark}>
                Organically
              </Link>
              <span className={styles.footerCopy}>
                &copy; 2026 Organically SEO. All rights reserved.
              </span>
            </div>
            <div className={styles.footerRight}>
              <div className={styles.footerCol}>
                <span className={styles.footerColTitle}>Agency</span>
                <Link href="/web-design/">Web Design</Link>
                <Link href="/seo/">SEO</Link>
                <Link href="/branding/">Branding</Link>
                <Link href="/blog/">Blog</Link>
              </div>
              <div className={styles.footerCol}>
                <span className={styles.footerColTitle}>Contact</span>
                <a href="mailto:ryan.organically@gmail.com">Email</a>
                <a href="https://twitter.com/organicallyseo">Twitter / X</a>
                <a href="https://www.linkedin.com/in/ryan-scanlon31/">
                  LinkedIn
                </a>
              </div>
              <div className={styles.footerCol}>
                <span className={styles.footerColTitle}>Legal</span>
                <Link href="/privacy-policy/">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════ */

function ServiceItem({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const { ref, visible } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`${styles.serviceItem} ${visible ? styles.visible : ""}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <Link
        href={service.href}
        className={styles.serviceName}
        data-rank={index + 1}
      >
        {service.name}
      </Link>
      <div className={styles.serviceDetail}>
        <p className={styles.serviceDescription}>{service.description}</p>
        <span className={styles.serviceArrow}>
          Explore
          <ArrowRight className={styles.serviceArrowIcon} />
        </span>
      </div>
    </li>
  );
}

function StatItem({ stat }: { stat: (typeof STATS)[number] }) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${styles.statItem} ${visible ? styles.visible : ""}`}
    >
      <div className={styles.statNumber}>{stat.value}</div>
      <div className={styles.statLabel}>{stat.label}</div>
    </div>
  );
}

function StatementBlock() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${styles.statement} ${visible ? styles.visible : ""}`}
    >
      <p className={styles.statementText}>
        Solo agency marketer delivering businesses with{" "}
        <em>personalized</em> and <em>powerful</em> websites that generate
        traffic.
      </p>
      <p className={styles.statementAttribution}>Pittsburgh, PA</p>
    </div>
  );
}

function TestimonialBlock() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${styles.testimonial} ${visible ? styles.visible : ""}`}
    >
      <blockquote className={styles.testimonialQuote}>
        His adaptability, expertise, and willingness to collaborate made the
        project a creative experience that produced an asset for our company
        to use and build on for years to come.
      </blockquote>
      <div className={styles.testimonialSource}>
        <span className={styles.testimonialName}>IWC Cabinetry</span>
        <span className={styles.testimonialRole}>Client</span>
        <div className={styles.testimonialStars}>
          {"\u2605\u2605\u2605\u2605\u2605"}
        </div>
      </div>
    </div>
  );
}

function PortfolioItem({
  item,
}: {
  item: (typeof PORTFOLIO)[number];
}) {
  const { ref, visible } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`${styles.portfolioItem} ${visible ? styles.visible : ""}`}
    >
      <Link href={item.href} className={styles.portfolioLink}>
        <div className={styles.portfolioTitleGroup}>
          <span className={styles.portfolioTitle}>{item.title}</span>
          <span className={styles.portfolioMeta}>{item.tags}</span>
        </div>
        <span className={styles.portfolioArrow}>{"\u2197"}</span>
      </Link>
    </li>
  );
}

function InsightItem({
  item,
}: {
  item: (typeof INSIGHTS)[number];
}) {
  const { ref, visible } = useReveal<HTMLLIElement>();

  return (
    <li
      ref={ref}
      className={`${styles.insightItem} ${visible ? styles.visible : ""}`}
    >
      <Link href={item.href}>
        <span className={styles.insightCategory}>{item.category}</span>
        <h3 className={styles.insightTitle}>{item.title}</h3>
        <span className={styles.insightDate}>{item.date}</span>
      </Link>
    </li>
  );
}

function CtaBlock() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${styles.ctaSection} ${visible ? styles.visible : ""}`}
    >
      <h2 className={styles.ctaHeadline}>
        Let&rsquo;s <em>grow</em>
        <br />
        together.
      </h2>
      <p className={styles.ctaSubtext}>
        Whether you need a website, organic traffic, or a brand identity, it
        starts with a conversation. No pitch decks. Just real talk.
      </p>
      <a
        href="https://calendly.com/organically/30min"
        className={styles.ctaButton}
      >
        Schedule a Free Call
      </a>
      <br />
      <a
        href="mailto:ryan.organically@gmail.com"
        className={styles.ctaEmail}
      >
        ryan.organically@gmail.com
      </a>
    </div>
  );
}
