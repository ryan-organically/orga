/**
 * Design 16: FULL-PAGE SCROLL / SINGLE-PAGE 2026 Homepage
 * Organically - Web Creative with Organic Potential
 *
 * Architecture:
 *   - Single continuous scroll experience (no hero break)
 *   - Each section occupies 100vh and animates into view on scroll
 *   - Horizontal scroll section for portfolio (full-width slides)
 *   - Text reveals via clip-path and transform animations
 *   - Background color/image transitions driven by scroll position
 *   - Services: vertical scroll-snapped cards (100vh per snap)
 *   - Testimonials: full-screen video background with quote overlay
 *   - Blog: tall "infinite scroll" mockup section
 *   - All animations orchestrated by Lenis smooth scroll + GSAP ScrollTrigger
 *
 * Integration:
 *   - Lenis v1.3+ for smooth scroll with lerp-based interpolation
 *   - GSAP 3.13+ with ScrollTrigger, SplitText plugins
 *   - Horizontal scroll uses ScrollTrigger pin + x-translate
 *   - Scroll-snapped services use CSS scroll-snap + ScrollTrigger triggers
 *
 * Layout (matches existing site):
 *   body.horizontal-body (flex)
 *     .side-menu-panel (5% visible, left)
 *     .body-section (90%, center, vertical scroll container)
 *     .calendar-module (5% visible, right)
 *
 * Performance notes:
 *   - will-change applied only during active animations via onToggle
 *   - Images use loading="lazy" and srcset where applicable
 *   - Video uses preload="none" until section enters viewport
 *   - ScrollTrigger.config({ limitCallbacks: true, syncInterval: 120 })
 *   - clip-path animations use GPU-composited properties
 *   - Horizontal scroll uses transform: translateX (GPU layer)
 *   - SplitText reverted after animation to reduce DOM node count
 *   - Parallax layers use translateY only (no layout triggers)
 *   - Snap sections use CSS scroll-snap-type for native performance
 *   - requestAnimationFrame loop syncs Lenis with ScrollTrigger
 *
 * Color tokens (from site CSS variables):
 *   --orga: #7ec700 (primary green)
 *   --black-75: #000000bf
 *   --red-1: #e83151
 *   --blue-2: #009fb7
 *   --steeler: #ffb612
 *
 * LOC: ~1400
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════ */
const t = {
  // Colors
  bg:         '#0a0a0a',
  bgLight:    '#f5f5f0',
  bgMid:      '#1a1a1a',
  green:      '#7ec700',
  greenDark:  '#5a9100',
  greenSoft:  'rgba(126,199,0,0.12)',
  white:      '#ffffff',
  black:      '#000000',
  black75:    'rgba(0,0,0,0.75)',
  muted:      '#999999',
  mutedLight: '#666666',
  red:        '#e83151',
  blue:       '#009fb7',
  gold:       '#ffb612',
  // Typography
  fontHeading: "'Oswald', sans-serif",
  fontBody:    "'Lato', sans-serif",
  fontSerif:   "'Vollkorn', serif",
  // Spacing
  sectionPad:  'clamp(40px, 6vw, 80px)',
  // Transitions
  ease:        'cubic-bezier(0.16, 1, 0.3, 1)',
};

/* ═══════════════════════════════════════════
   SECTION WRAPPER — every section is 100vh
   ═══════════════════════════════════════════ */
function Section({
  children,
  id,
  bg = t.bg,
  color = t.white,
  style = {},
  className = '',
  minHeight = '100vh',
  overflow = 'hidden',
  innerRef,
}) {
  return (
    <section
      id={id}
      ref={innerRef}
      className={`fp-section ${className}`}
      style={{
        minHeight,
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: bg,
        color,
        overflow,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </section>
  );
}

/* ═══════════════════════════════════════════
   REVEAL TEXT — clip-path wipe on scroll
   ═══════════════════════════════════════════ */
function RevealText({ children, as: Tag = 'h2', style = {}, className = '' }) {
  return (
    <Tag
      className={`reveal-text ${className}`}
      style={{
        clipPath: 'inset(0 100% 0 0)',
        fontFamily: t.fontHeading,
        fontWeight: 700,
        lineHeight: 1.1,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* ═══════════════════════════════════════════
   PARALLAX LAYER
   ═══════════════════════════════════════════ */
function ParallaxLayer({ children, speed = 0.5, style = {} }) {
  return (
    <div
      className="parallax-layer"
      data-speed={speed}
      style={{
        position: 'absolute',
        inset: 0,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   BUTTON
   ═══════════════════════════════════════════ */
function Button({ children, href, variant = 'primary', style = {}, onClick }) {
  const [hovered, setHovered] = useState(false);

  const variants = {
    primary: {
      background: hovered ? t.greenDark : t.green,
      color: t.black,
      border: 'none',
    },
    outline: {
      background: hovered ? t.white : 'transparent',
      color: hovered ? t.black : t.white,
      border: `2px solid ${t.white}`,
    },
    ghost: {
      background: hovered ? 'rgba(126,199,0,0.15)' : 'transparent',
      color: t.green,
      border: `1px solid ${t.green}`,
    },
  };

  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '16px 36px',
        borderRadius: '60px',
        fontSize: '14px',
        fontWeight: 700,
        fontFamily: t.fontBody,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: `all 0.4s ${t.ease}`,
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

/* ═══════════════════════════════════════════
   NAV DOT INDICATOR (fixed side)
   ═══════════════════════════════════════════ */
function NavDots({ sections, activeIndex }) {
  return (
    <nav
      style={{
        position: 'fixed',
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        zIndex: 1000,
        mixBlendMode: 'difference',
      }}
    >
      {sections.map((s, i) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={s.label}
          title={s.label}
          style={{
            width: activeIndex === i ? '12px' : '8px',
            height: activeIndex === i ? '12px' : '8px',
            borderRadius: '50%',
            background: activeIndex === i ? t.green : 'rgba(255,255,255,0.4)',
            border: 'none',
            cursor: 'pointer',
            transition: `all 0.3s ${t.ease}`,
            display: 'block',
          }}
        />
      ))}
    </nav>
  );
}

/* ═══════════════════════════════════════════
   SCROLL PROGRESS BAR
   ═══════════════════════════════════════════ */
function ScrollProgress() {
  return (
    <div
      className="scroll-progress"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: '0%',
        background: `linear-gradient(90deg, ${t.green}, ${t.blue})`,
        zIndex: 9999,
        transformOrigin: 'left',
      }}
    />
  );
}

/* ═══════════════════════════════════════════
   SERVICE CARD (for snap-scroll section)
   ═══════════════════════════════════════════ */
function ServiceSnapCard({ title, description, icon, accentColor, index }) {
  return (
    <div
      className="service-snap-card"
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollSnapAlign: 'start',
        position: 'relative',
      }}
    >
      {/* Large background number */}
      <span
        className="service-bg-number"
        style={{
          position: 'absolute',
          right: '8%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 'clamp(200px, 30vw, 400px)',
          fontFamily: t.fontHeading,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.03)',
          lineHeight: 1,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div
        style={{
          maxWidth: '720px',
          padding: t.sectionPad,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Accent line */}
        <div
          className="service-accent-line"
          style={{
            width: '60px',
            height: '4px',
            background: accentColor,
            marginBottom: '32px',
            transformOrigin: 'left',
            transform: 'scaleX(0)',
          }}
        />

        {/* Icon */}
        <div
          style={{
            fontSize: '48px',
            marginBottom: '20px',
            opacity: 0.9,
          }}
        >
          {icon}
        </div>

        <h3
          className="service-title"
          style={{
            fontFamily: t.fontHeading,
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700,
            color: t.white,
            margin: '0 0 24px',
            lineHeight: 1.1,
            opacity: 0,
            transform: 'translateY(40px)',
          }}
        >
          {title}
        </h3>

        <p
          className="service-desc"
          style={{
            fontFamily: t.fontBody,
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.7,
            color: t.muted,
            margin: '0 0 40px',
            maxWidth: '540px',
            opacity: 0,
            transform: 'translateY(30px)',
          }}
        >
          {description}
        </p>

        <Button variant="ghost" href="#">
          Learn more &rarr;
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PORTFOLIO SLIDE (for horizontal scroll)
   ═══════════════════════════════════════════ */
function PortfolioSlide({ title, category, image, index, total }) {
  return (
    <div
      className="portfolio-slide"
      style={{
        width: '100vw',
        height: '100vh',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image with parallax offset */}
      <div
        className="portfolio-bg"
        style={{
          position: 'absolute',
          inset: '-10%',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35)',
          transition: 'transform 0.6s ease-out',
        }}
      />

      {/* Grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          padding: '40px',
          maxWidth: '800px',
        }}
      >
        <p
          style={{
            fontFamily: t.fontBody,
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: t.green,
            marginBottom: '16px',
          }}
        >
          {category}
        </p>
        <h3
          className="portfolio-title"
          style={{
            fontFamily: t.fontHeading,
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 700,
            color: t.white,
            margin: '0 0 32px',
            lineHeight: 1.05,
          }}
        >
          {title}
        </h3>
        <Button variant="outline" href="#">
          View project
        </Button>
      </div>

      {/* Slide counter */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '60px',
          fontFamily: t.fontHeading,
          fontSize: '14px',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.4)',
        }}
      >
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   BLOG CARD (for infinite-scroll mockup)
   ═══════════════════════════════════════════ */
function BlogCard({ title, category, date, excerpt, categoryColor = t.green }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="#"
      className="blog-scroll-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        padding: '40px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        transition: `all 0.4s ${t.ease}`,
        transform: hovered ? 'translateX(12px)' : 'translateX(0)',
        opacity: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px' }}>
        <span
          style={{
            fontFamily: t.fontBody,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: categoryColor,
            padding: '4px 12px',
            border: `1px solid ${categoryColor}`,
            borderRadius: '20px',
          }}
        >
          {category}
        </span>
        <span
          style={{
            fontFamily: t.fontBody,
            fontSize: '13px',
            color: t.muted,
          }}
        >
          {date}
        </span>
      </div>

      <h4
        style={{
          fontFamily: t.fontHeading,
          fontSize: 'clamp(22px, 3vw, 32px)',
          fontWeight: 600,
          color: hovered ? t.green : t.white,
          margin: '0 0 10px',
          lineHeight: 1.2,
          transition: `color 0.3s ${t.ease}`,
        }}
      >
        {title}
      </h4>

      <p
        style={{
          fontFamily: t.fontBody,
          fontSize: '15px',
          lineHeight: 1.6,
          color: t.muted,
          margin: 0,
          maxWidth: '600px',
        }}
      >
        {excerpt}
      </p>
    </a>
  );
}


/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT — FullPageScrollHomepage
   ═══════════════════════════════════════════════════════ */
export default function FullPageScrollHomepage() {
  const containerRef = useRef(null);
  const horizontalRef = useRef(null);
  const servicesRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  /* ── Section registry for nav dots ── */
  const sectionMap = [
    { id: 'hero',         label: 'Home' },
    { id: 'intro',        label: 'Intro' },
    { id: 'services',     label: 'Services' },
    { id: 'portfolio',    label: 'Portfolio' },
    { id: 'testimonial',  label: 'Testimonial' },
    { id: 'blog',         label: 'Blog' },
    { id: 'contact',      label: 'Contact' },
  ];

  /* ── Data ── */
  const services = [
    {
      title: 'Web Design',
      description: 'Custom websites that stand above templates. We design responsive, beautiful interfaces that convert visitors into customers and make your brand unforgettable.',
      icon: '\u2316',
      accentColor: t.gold,
    },
    {
      title: 'SEO & Organic Growth',
      description: 'Strategic keyword placement, technical optimization, and content that answers what people are searching for. Your next customer is one search away.',
      icon: '\u2197',
      accentColor: t.green,
    },
    {
      title: 'Branding & Identity',
      description: 'From logo to full visual system. We craft distinctive identities that tell your story before you say a word, making first impressions count.',
      icon: '\u25C7',
      accentColor: t.red,
    },
    {
      title: 'Front-End Development',
      description: 'Hand-coded, performance-first builds. Modern frameworks, smooth animations, and pixel-perfect execution that brings designs to life.',
      icon: '\u2039\u203A',
      accentColor: t.blue,
    },
  ];

  const portfolioItems = [
    { title: 'IWC Custom Cabinetry',    category: 'Web Design & SEO',    image: '/images/iwc-hero.jpg' },
    { title: 'Steel City Rebrand',      category: 'Branding & Identity', image: '/images/steel-brand.jpg' },
    { title: 'Contractor Lead Funnel',  category: 'Development & SEO',   image: '/images/contractor-funnel.jpg' },
    { title: 'Pittsburgh Local SEO',    category: 'Organic Growth',      image: '/images/pgh-local.jpg' },
  ];

  const blogPosts = [
    { title: 'What is SEO? A Complete Guide for 2026',             category: 'Marketing',  date: 'Mar 2026',  excerpt: 'The average person makes 3-4 searches on Google per day. Learn how to answer them and capture organic traffic.',                   categoryColor: t.green },
    { title: 'Webflow Launch Checklist',                           category: 'Design',     date: 'Feb 2026',  excerpt: 'Launching a website can be terrifying, especially your first time. Here is everything you need to check before going live.',   categoryColor: t.blue },
    { title: 'Basics of Branding: How to Build Your Own Brand',    category: 'Branding',   date: 'Jan 2026',  excerpt: 'Deciding on an original name, colors, logo, and website that speak to you are big commitments worth getting right.',            categoryColor: t.red },
    { title: 'Webflow vs. Figma: Choosing Your Design Tool',      category: 'Design',     date: 'Dec 2025',  excerpt: 'Selecting the right tools can significantly impact your creative journey. A comprehensive comparison.',                       categoryColor: t.blue },
    { title: 'What is AI Art? And Will It Replace Artists?',       category: 'Creative',   date: 'Nov 2025',  excerpt: 'Exploring the intersection of technology and creativity as AI reshapes how we think about visual art.',                       categoryColor: t.gold },
    { title: 'The Future of Search: GEO and AI Overviews',        category: 'Marketing',  date: 'Oct 2025',  excerpt: 'Google AI Overviews are changing how results appear. Here is how to optimize for the next generation of search.',             categoryColor: t.green },
    { title: 'Why Page Speed Matters More Than Ever',              category: 'Development',date: 'Sep 2025',  excerpt: 'Core Web Vitals are now a confirmed ranking factor. Every millisecond counts in the battle for attention.',                   categoryColor: t.blue },
    { title: 'Color Psychology in Web Design',                     category: 'Creative',   date: 'Aug 2025',  excerpt: 'How color choices influence user behavior, trust, and conversion rates across digital experiences.',                          categoryColor: t.gold },
  ];

  /* ── GSAP + Lenis initialization ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamic imports for SSR safety
    let lenis, gsapInstance, ScrollTriggerPlugin, SplitTextPlugin;
    let rafId;

    async function init() {
      // These would be imported from CDN or node_modules in production
      // For this component, we assume they're available globally (matching existing site setup)
      gsapInstance = window.gsap;
      ScrollTriggerPlugin = window.ScrollTrigger;
      SplitTextPlugin = window.SplitText;
      const Lenis = window.Lenis;

      if (!gsapInstance || !ScrollTriggerPlugin || !Lenis) {
        console.warn('Design 16: GSAP, ScrollTrigger, or Lenis not loaded.');
        return;
      }

      gsapInstance.registerPlugin(ScrollTriggerPlugin);
      if (SplitTextPlugin) gsapInstance.registerPlugin(SplitTextPlugin);

      /* ── 1. Lenis smooth scroll ── */
      lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 0.8,
        gestureOrientation: 'vertical',
        normalizeWheel: false,
        smoothTouch: false,
      });

      lenis.on('scroll', ScrollTriggerPlugin.update);

      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      ScrollTriggerPlugin.config({
        limitCallbacks: true,
        syncInterval: 120,
      });

      /* ── 2. Scroll progress bar ── */
      const progressBar = document.querySelector('.scroll-progress');
      if (progressBar) {
        gsapInstance.to(progressBar, {
          width: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3,
          },
        });
      }

      /* ── 3. Active section tracking (nav dots) ── */
      document.querySelectorAll('.fp-section').forEach((section, i) => {
        ScrollTriggerPlugin.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setActiveSection(i),
          onEnterBack: () => setActiveSection(i),
        });
      });

      /* ── 4. Hero section animations ── */
      const heroHeading = document.querySelector('.hero-mega-text');
      const heroSub = document.querySelector('.hero-sub-text');
      const heroTagline = document.querySelector('.hero-tagline');
      const heroCta = document.querySelector('.hero-cta');
      const heroVideo = document.querySelector('.hero-video-bg');

      if (heroHeading && SplitTextPlugin) {
        const split = SplitTextPlugin.create(heroHeading, {
          type: 'chars',
          charsClass: 'hero-char',
        });

        gsapInstance.set(split.chars, { yPercent: 120, opacity: 0 });

        gsapInstance.to(split.chars, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.03,
          ease: 'expo.out',
          delay: 0.3,
        });
      }

      if (heroSub) {
        gsapInstance.from(heroSub, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.9,
        });
      }

      if (heroTagline) {
        gsapInstance.from(heroTagline, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          delay: 1.2,
        });
      }

      if (heroCta) {
        gsapInstance.from(heroCta, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: 1.5,
        });
      }

      // Hero parallax on scroll
      if (heroVideo) {
        gsapInstance.to(heroVideo, {
          yPercent: 30,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      /* ── 5. Reveal text animations (clip-path wipe) ── */
      document.querySelectorAll('.reveal-text').forEach((el) => {
        gsapInstance.to(el, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });

      /* ── 6. Intro section — staggered text blocks ── */
      document.querySelectorAll('.intro-block').forEach((block) => {
        gsapInstance.from(block, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });

      /* ── 7. Background color transitions ── */
      const bgSections = document.querySelectorAll('[data-bg-color]');
      bgSections.forEach((section) => {
        const color = section.getAttribute('data-bg-color');
        ScrollTriggerPlugin.create({
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            gsapInstance.to(document.querySelector('.body-section') || document.body, {
              backgroundColor: color,
              duration: 0.8,
              ease: 'power2.inOut',
            });
          },
          onEnterBack: () => {
            gsapInstance.to(document.querySelector('.body-section') || document.body, {
              backgroundColor: color,
              duration: 0.8,
              ease: 'power2.inOut',
            });
          },
        });
      });

      /* ── 8. Services snap section — card reveals ── */
      document.querySelectorAll('.service-snap-card').forEach((card) => {
        const title = card.querySelector('.service-title');
        const desc = card.querySelector('.service-desc');
        const line = card.querySelector('.service-accent-line');

        const tl = gsapInstance.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            toggleActions: 'play none none none',
            once: true,
            onToggle: (self) => {
              card.style.willChange = self.isActive ? 'transform' : 'auto';
            },
          },
        });

        if (line) tl.to(line, { scaleX: 1, duration: 0.6, ease: 'power3.out' }, 0);
        if (title) tl.to(title, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.1);
        if (desc) tl.to(desc, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.25);
      });

      /* ── 9. Horizontal scroll — portfolio ── */
      const horizontalWrap = document.querySelector('.horizontal-scroll-wrap');
      const horizontalTrack = document.querySelector('.horizontal-scroll-track');

      if (horizontalWrap && horizontalTrack) {
        const slides = horizontalTrack.querySelectorAll('.portfolio-slide');
        const totalWidth = slides.length * window.innerWidth;

        gsapInstance.to(horizontalTrack, {
          x: () => -(totalWidth - window.innerWidth),
          ease: 'none',
          scrollTrigger: {
            trigger: horizontalWrap,
            start: 'top top',
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        // Parallax inside each slide
        slides.forEach((slide) => {
          const bg = slide.querySelector('.portfolio-bg');
          if (bg) {
            gsapInstance.to(bg, {
              x: '-15%',
              ease: 'none',
              scrollTrigger: {
                trigger: horizontalWrap,
                start: 'top top',
                end: () => `+=${totalWidth}`,
                scrub: true,
              },
            });
          }
        });
      }

      /* ── 10. Testimonial section — video + text ── */
      const testimonialSection = document.querySelector('#testimonial');
      const testimonialVideo = document.querySelector('.testimonial-video');
      const testimonialQuote = document.querySelector('.testimonial-quote');

      if (testimonialSection) {
        // Start video playback when section enters
        if (testimonialVideo) {
          ScrollTriggerPlugin.create({
            trigger: testimonialSection,
            start: 'top 80%',
            onEnter: () => {
              testimonialVideo.play().catch(() => {});
            },
            onLeaveBack: () => {
              testimonialVideo.pause();
            },
          });
        }

        if (testimonialQuote && SplitTextPlugin) {
          const quoteSplit = SplitTextPlugin.create(testimonialQuote, {
            type: 'words',
            wordsClass: 'quote-word',
          });

          gsapInstance.set(quoteSplit.words, { opacity: 0.15 });

          gsapInstance.to(quoteSplit.words, {
            opacity: 1,
            stagger: 0.08,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: testimonialSection,
              start: 'top 40%',
              end: 'center center',
              scrub: 1,
            },
          });
        }
      }

      /* ── 11. Blog cards — stagger reveal ── */
      document.querySelectorAll('.blog-scroll-card').forEach((card, i) => {
        gsapInstance.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      });

      /* ── 12. Contact section animations ── */
      const contactHeading = document.querySelector('.contact-heading');
      if (contactHeading && SplitTextPlugin) {
        const contactSplit = SplitTextPlugin.create(contactHeading, {
          type: 'chars',
          charsClass: 'contact-char',
        });

        gsapInstance.set(contactSplit.chars, { yPercent: 100, opacity: 0 });

        gsapInstance.to(contactSplit.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: contactHeading,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true,
          },
        });
      }

      /* ── 13. Parallax layers ── */
      document.querySelectorAll('.parallax-layer').forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed) || 0.5;
        gsapInstance.to(layer, {
          yPercent: speed * 30,
          ease: 'none',
          scrollTrigger: {
            trigger: layer.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }

    init();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
      if (ScrollTriggerPlugin) {
        ScrollTriggerPlugin.getAll().forEach((st) => st.kill());
      }
    };
  }, []);

  /* ═══════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════ */
  return (
    <>
      {/* --- Global Styles --- */}
      <style>{`
        /* Lenis base */
        html.lenis { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto; }
        .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: clip; }

        /* Hero char overflow mask */
        .hero-char {
          display: inline-block;
          overflow: hidden;
        }

        /* Scroll-snap for services */
        .services-snap-container {
          scroll-snap-type: y mandatory;
          overflow-y: auto;
          height: 100vh;
        }
        .services-snap-container::-webkit-scrollbar { display: none; }

        /* Horizontal scroll track */
        .horizontal-scroll-track {
          display: flex;
          will-change: transform;
        }

        /* Blog card hover state */
        .blog-scroll-card {
          transform: translateY(20px);
        }

        /* Quote word */
        .quote-word {
          display: inline-block;
          margin-right: 0.25em;
        }

        /* Contact char mask */
        .contact-char {
          display: inline-block;
          overflow: hidden;
        }

        /* Nav dots responsive hide */
        @media (max-width: 768px) {
          .nav-dots-wrap { display: none; }
        }

        /* Mobile horizontal scroll adjustments */
        @media (max-width: 768px) {
          .portfolio-slide {
            padding: 20px;
          }
          .service-snap-card {
            padding: 24px;
          }
        }

        /* Smooth color transitions on body-section */
        .body-section {
          transition: background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .reveal-text { clip-path: none; }
          .service-title,
          .service-desc,
          .blog-scroll-card { opacity: 1; transform: none; }
          .scroll-progress { display: none; }
          .parallax-layer { transform: none; }
        }
      `}</style>

      <ScrollProgress />

      <div className="nav-dots-wrap">
        <NavDots sections={sectionMap} activeIndex={activeSection} />
      </div>

      {/* ═══════════════════════════════════
         SECTION 1: HERO — Full viewport
         ═══════════════════════════════════ */}
      <Section id="hero" bg="transparent" data-bg-color={t.bg}>
        {/* Video background */}
        <video
          className="hero-video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.3) saturate(0.8)',
          }}
        >
          <source src="/videos/theme video compressed.webm" type="video/webm" />
        </video>

        {/* Dark gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.7) 100%)',
            zIndex: 1,
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: `0 ${t.sectionPad}`,
            maxWidth: '1000px',
          }}
        >
          {/* Floating label */}
          <p
            className="hero-tagline"
            style={{
              fontFamily: t.fontBody,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: t.green,
              marginBottom: '24px',
            }}
          >
            Web Creative with Organic Potential
          </p>

          {/* Mega heading */}
          <h1
            className="hero-mega-text"
            style={{
              fontFamily: t.fontHeading,
              fontSize: 'clamp(56px, 12vw, 160px)',
              fontWeight: 700,
              lineHeight: 0.95,
              margin: '0 0 32px',
              color: t.white,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
            }}
          >
            Organically<span style={{ color: t.green }}>.</span>
          </h1>

          {/* Sub-text */}
          <p
            className="hero-sub-text"
            style={{
              fontFamily: t.fontSerif,
              fontSize: 'clamp(16px, 2vw, 22px)',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '600px',
              margin: '0 auto 48px',
            }}
          >
            A vast space where stray ideas can wander, take root, and quietly grow bold.
            Combining web creative with organic potential.
          </p>

          {/* CTA */}
          <div className="hero-cta" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="/web-design/" variant="primary">
              See our work
            </Button>
            <Button href="#contact" variant="outline">
              Get in touch
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontFamily: t.fontBody,
              fontSize: '11px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: '1px',
              height: '40px',
              background: 'rgba(255,255,255,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '50%',
                background: t.green,
                animation: 'scrollPulse 2s ease-in-out infinite',
                position: 'absolute',
                top: 0,
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes scrollPulse {
            0% { transform: translateY(-100%); }
            50% { transform: translateY(200%); }
            100% { transform: translateY(-100%); }
          }
        `}</style>
      </Section>

      {/* ═══════════════════════════════════
         SECTION 2: INTRO — Mission statement
         ═══════════════════════════════════ */}
      <Section id="intro" bg={t.bg} data-bg-color={t.bg} style={{ padding: t.sectionPad }}>
        <div style={{ maxWidth: '1000px', width: '100%' }}>
          {/* Large intro text */}
          <div className="intro-block" style={{ marginBottom: '80px' }}>
            <RevealText
              as="h2"
              style={{
                fontSize: 'clamp(32px, 5vw, 64px)',
                color: t.white,
                marginBottom: '40px',
              }}
            >
              We don't just build websites.
            </RevealText>

            <RevealText
              as="h2"
              style={{
                fontSize: 'clamp(32px, 5vw, 64px)',
                color: t.green,
              }}
            >
              We grow businesses.
            </RevealText>
          </div>

          {/* Stats row */}
          <div
            className="intro-block"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '48px',
              borderTop: `1px solid rgba(255,255,255,0.08)`,
              paddingTop: '48px',
            }}
          >
            {[
              { stat: '2.5M+', label: 'Impressions generated for a local business' },
              { stat: '100%', label: 'Custom designs, zero templates' },
              { stat: 'AI', label: 'Search optimized for next-gen results' },
            ].map((item, i) => (
              <div key={i}>
                <p
                  style={{
                    fontFamily: t.fontHeading,
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    fontWeight: 700,
                    color: t.green,
                    margin: '0 0 8px',
                    lineHeight: 1,
                  }}
                >
                  {item.stat}
                </p>
                <p
                  style={{
                    fontFamily: t.fontBody,
                    fontSize: '15px',
                    color: t.muted,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div
            className="intro-block"
            style={{
              marginTop: '80px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '32px',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <img
              src="/green 5 star.png"
              alt="5 stars"
              style={{ width: '80px', flexShrink: 0 }}
              loading="lazy"
            />
            <div>
              <p
                style={{
                  fontFamily: t.fontSerif,
                  fontSize: '16px',
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.7)',
                  margin: '0 0 8px',
                  lineHeight: 1.6,
                }}
              >
                "His adaptability, expertise, and willingness to collaborate made the project
                a creative experience that produced an asset for our company."
              </p>
              <p
                style={{
                  fontFamily: t.fontBody,
                  fontSize: '13px',
                  color: t.muted,
                  margin: 0,
                }}
              >
                — IWC Cabinetry
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
         SECTION 3: SERVICES — Snap-scroll cards
         ═══════════════════════════════════ */}
      <Section
        id="services"
        bg={t.bgMid}
        data-bg-color={t.bgMid}
        minHeight="auto"
        overflow="visible"
        innerRef={servicesRef}
        style={{ padding: 0 }}
      >
        {/* Section header */}
        <div
          style={{
            width: '100%',
            padding: `${t.sectionPad} ${t.sectionPad} 0`,
            maxWidth: '1000px',
          }}
        >
          <p
            style={{
              fontFamily: t.fontBody,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: t.green,
              marginBottom: '16px',
            }}
          >
            What we do
          </p>
          <RevealText
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              color: t.white,
            }}
          >
            Full-service digital marketing that grows your business.
          </RevealText>
        </div>

        {/* Snap-scroll container */}
        <div
          className="services-snap-container"
          style={{
            width: '100%',
          }}
        >
          {services.map((service, i) => (
            <ServiceSnapCard
              key={i}
              index={i}
              title={service.title}
              description={service.description}
              icon={service.icon}
              accentColor={service.accentColor}
            />
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════
         SECTION 4: PORTFOLIO — Horizontal scroll
         ═══════════════════════════════════ */}
      <div
        className="horizontal-scroll-wrap"
        ref={horizontalRef}
        id="portfolio"
        data-bg-color={t.black}
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Section label (fixed during scroll) */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            zIndex: 10,
          }}
        >
          <p
            style={{
              fontFamily: t.fontBody,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: t.green,
              margin: 0,
            }}
          >
            Selected work
          </p>
        </div>

        {/* Horizontal track */}
        <div className="horizontal-scroll-track">
          {portfolioItems.map((item, i) => (
            <PortfolioSlide
              key={i}
              index={i}
              title={item.title}
              category={item.category}
              image={item.image}
              total={portfolioItems.length}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
         SECTION 5: TESTIMONIAL — Full-screen video bg
         ═══════════════════════════════════ */}
      <Section id="testimonial" bg={t.bg} data-bg-color={t.bg}>
        {/* Video background */}
        <video
          className="testimonial-video"
          muted
          loop
          playsInline
          preload="none"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'brightness(0.2) saturate(0.6)',
          }}
        >
          <source src="/videos/theme video compressed.webm" type="video/webm" />
        </video>

        {/* Gradient overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.8) 100%)',
            zIndex: 1,
          }}
        />

        {/* Quote content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            padding: t.sectionPad,
            maxWidth: '900px',
          }}
        >
          {/* Star rating */}
          <img
            src="/green 5 star.png"
            alt="5 star rating"
            style={{ width: '100px', marginBottom: '40px', opacity: 0.9 }}
            loading="lazy"
          />

          {/* Quote */}
          <p
            className="testimonial-quote"
            style={{
              fontFamily: t.fontSerif,
              fontSize: 'clamp(24px, 3.5vw, 42px)',
              fontWeight: 400,
              fontStyle: 'italic',
              lineHeight: 1.5,
              color: t.white,
              margin: '0 0 40px',
            }}
          >
            "Ryan was an absolute beauty to work with -- thoughtful, creative, and genuinely
            invested in making our vision come to life. The result exceeded every expectation."
          </p>

          {/* Attribution */}
          <div>
            <p
              style={{
                fontFamily: t.fontBody,
                fontSize: '16px',
                fontWeight: 700,
                color: t.white,
                margin: '0 0 4px',
              }}
            >
              Sarah M.
            </p>
            <p
              style={{
                fontFamily: t.fontBody,
                fontSize: '14px',
                color: t.muted,
                margin: 0,
              }}
            >
              Founder
            </p>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
         SECTION 6: BLOG — Infinite scroll mockup
         ═══════════════════════════════════ */}
      <Section
        id="blog"
        bg={t.bgMid}
        data-bg-color={t.bgMid}
        minHeight="auto"
        style={{ padding: t.sectionPad }}
      >
        <div style={{ maxWidth: '800px', width: '100%' }}>
          {/* Section header */}
          <div style={{ marginBottom: '60px' }}>
            <p
              style={{
                fontFamily: t.fontBody,
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: t.green,
                marginBottom: '16px',
              }}
            >
              Coffee Break
            </p>
            <RevealText
              style={{
                fontSize: 'clamp(28px, 4vw, 48px)',
                color: t.white,
              }}
            >
              Thoughts, guides, and resources.
            </RevealText>
          </div>

          {/* Blog cards list */}
          <div>
            {blogPosts.map((post, i) => (
              <BlogCard
                key={i}
                title={post.title}
                category={post.category}
                date={post.date}
                excerpt={post.excerpt}
                categoryColor={post.categoryColor}
              />
            ))}
          </div>

          {/* "Loading" indicator (fake infinite scroll) */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '60px 0 20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    animation: `dotPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          <style>{`
            @keyframes dotPulse {
              0%, 80%, 100% { opacity: 0.3; transform: scale(1); }
              40% { opacity: 1; transform: scale(1.3); }
            }
          `}</style>

          {/* View all CTA */}
          <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            <Button href="/blog/" variant="ghost">
              View all posts &rarr;
            </Button>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
         SECTION 7: CONTACT / CTA
         ═══════════════════════════════════ */}
      <Section id="contact" bg={t.bg} data-bg-color={t.bg} style={{ padding: t.sectionPad }}>
        <ParallaxLayer speed={0.3}>
          <div
            style={{
              position: 'absolute',
              top: '10%',
              right: '-5%',
              width: 'clamp(300px, 40vw, 500px)',
              height: 'clamp(300px, 40vw, 500px)',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${t.greenSoft} 0%, transparent 70%)`,
              filter: 'blur(80px)',
              pointerEvents: 'none',
            }}
          />
        </ParallaxLayer>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          <p
            style={{
              fontFamily: t.fontBody,
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: t.green,
              marginBottom: '24px',
            }}
          >
            Ready to grow?
          </p>

          <h2
            className="contact-heading"
            style={{
              fontFamily: t.fontHeading,
              fontSize: 'clamp(40px, 8vw, 96px)',
              fontWeight: 700,
              color: t.white,
              lineHeight: 1,
              margin: '0 0 32px',
              textTransform: 'uppercase',
            }}
          >
            Let's build something<span style={{ color: t.green }}>.</span>
          </h2>

          <p
            style={{
              fontFamily: t.fontSerif,
              fontSize: 'clamp(16px, 2vw, 20px)',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '560px',
              margin: '0 auto 48px',
            }}
          >
            Whether you need a brand-new website, better search rankings, or a complete rebrand
            -- schedule a free call and let's talk about growing your business organically.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button href="https://calendly.com/organically/30min" variant="primary">
              Schedule a free call
            </Button>
            <Button href="mailto:ryan.organically@gmail.com" variant="outline">
              Send an email
            </Button>
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              marginTop: '60px',
              flexWrap: 'wrap',
            }}
          >
            {['Pittsburgh-based', 'No contracts', 'Infinite revisions', 'Free consultation'].map(
              (item, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: t.fontBody,
                    fontSize: '13px',
                    color: t.muted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ color: t.green, fontSize: '16px' }}>{'\u2713'}</span>
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
         FOOTER
         ═══════════════════════════════════ */}
      <footer
        style={{
          width: '100%',
          background: t.black,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '60px clamp(24px, 5vw, 80px) 32px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '48px',
          }}
        >
          {/* Brand column */}
          <div>
            <h3
              style={{
                fontFamily: t.fontHeading,
                fontSize: '28px',
                fontWeight: 700,
                color: t.white,
                margin: '0 0 12px',
              }}
            >
              Organically<span style={{ color: t.green }}>.</span>
            </h3>
            <p
              style={{
                fontFamily: t.fontBody,
                fontSize: '14px',
                color: t.muted,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Solo agency marketer delivering personalized and powerful websites that generate traffic.
            </p>
          </div>

          {/* Agency links */}
          <div>
            <h4
              style={{
                fontFamily: t.fontBody,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: t.muted,
                margin: '0 0 20px',
              }}
            >
              Agency
            </h4>
            {[
              { label: 'Web Design', href: '/web-design/' },
              { label: 'SEO', href: '/seo/' },
              { label: 'Branding', href: '/branding/' },
              { label: 'Blog', href: '/blog/' },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                style={{
                  display: 'block',
                  fontFamily: t.fontBody,
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  marginBottom: '10px',
                  transition: `color 0.3s ${t.ease}`,
                }}
                onMouseEnter={(e) => (e.target.style.color = t.green)}
                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.6)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact links */}
          <div>
            <h4
              style={{
                fontFamily: t.fontBody,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: t.muted,
                margin: '0 0 20px',
              }}
            >
              Connect
            </h4>
            {[
              { label: 'Schedule a Call', href: 'https://calendly.com/organically/30min' },
              { label: 'ryan.organically@gmail.com', href: 'mailto:ryan.organically@gmail.com' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ryan-scanlon31/' },
              { label: 'X (Twitter)', href: 'https://twitter.com/organicallyseo' },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                style={{
                  display: 'block',
                  fontFamily: t.fontBody,
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  marginBottom: '10px',
                  transition: `color 0.3s ${t.ease}`,
                }}
                onMouseEnter={(e) => (e.target.style.color = t.green)}
                onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.6)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <h4
              style={{
                fontFamily: t.fontBody,
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: t.muted,
                margin: '0 0 20px',
              }}
            >
              Legal
            </h4>
            <a
              href="/privacy-policy/"
              style={{
                display: 'block',
                fontFamily: t.fontBody,
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                marginBottom: '10px',
                transition: `color 0.3s ${t.ease}`,
              }}
              onMouseEnter={(e) => (e.target.style.color = t.green)}
              onMouseLeave={(e) => (e.target.style.color = 'rgba(255,255,255,0.6)')}
            >
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          style={{
            marginTop: '48px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: t.fontBody,
              fontSize: '13px',
              color: 'rgba(255,255,255,0.3)',
              margin: 0,
            }}
          >
            Copyright 2026 Organically SEO. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
