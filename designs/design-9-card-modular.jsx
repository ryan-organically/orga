/**
 * Design 9: CARD-BASED MODULAR 2026 Homepage
 * Organically - Web Creative with Organic Potential
 *
 * Architecture:
 *   - Every visual section is a "Card" component with shared styling
 *   - CSS Grid masonry layout: 2 columns desktop, 1 column mobile
 *   - Cards come in 3 size variants: full (span 2), standard (span 1), tall (span 1, extra height)
 *   - Consistent border-radius, box-shadow, and hover lift across all cards
 *   - Neutral palette (#f5f5f0 bg, #1a1a1a text) with green (#7ec700) accent for CTAs
 *
 * Card system:
 *   <Card variant="full|standard|tall" theme="light|dark|accent|image">
 *     ...children
 *   </Card>
 *
 * CSS Grid approach:
 *   - grid-template-columns: repeat(2, 1fr) on desktop
 *   - grid-auto-rows: minmax(320px, auto) for natural masonry
 *   - "full" cards use grid-column: 1 / -1 to span both columns
 *   - gap: 20px uniform gutters
 *   - @media (max-width: 768px) collapses to single column
 *
 * LOC: ~900 (component + inline styles)
 *
 * Essential elements included:
 *   [x] Navigation (top bar with hamburger, dark mode, CTA)
 *   [x] Hero with video background (full-width card)
 *   [x] Services (4 equal cards in sub-grid)
 *   [x] Portfolio (uniform square cards with image overlay)
 *   [x] Blog posts (cards)
 *   [x] Testimonial (large card)
 *   [x] Calendly embed (card)
 *   [x] Footer
 *   [x] Side menu panel (left)
 *   [x] Calendar panel (right)
 */

import React, { useState, useRef, useEffect } from 'react';

/* ═══════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════ */
const tokens = {
  // Colors
  bg:          '#f5f5f0',
  cardBg:      '#ffffff',
  cardBgDark:  '#1a1a1a',
  cardBgAccent:'#7ec700',
  text:        '#1a1a1a',
  textMuted:   '#666666',
  textLight:   '#ffffff',
  green:       '#7ec700',
  greenDark:   '#5a9100',
  border:      '#e0e0dc',
  borderDark:  'rgba(255,255,255,0.1)',
  shadow:      '0 2px 12px rgba(0,0,0,0.06)',
  shadowHover: '0 8px 32px rgba(0,0,0,0.12)',
  // Layout
  radius:      '16px',
  radiusSm:    '10px',
  gap:         '20px',
  maxWidth:    '1280px',
  // Transitions
  transition:  'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
};

/* ═══════════════════════════════════════════
   CARD COMPONENT
   ═══════════════════════════════════════════ */
function Card({ variant = 'standard', theme = 'light', className = '', style = {}, children, onClick }) {
  const [hovered, setHovered] = useState(false);

  const variantStyles = {
    full:     { gridColumn: '1 / -1' },
    standard: {},
    tall:     { minHeight: '480px' },
  };

  const themeStyles = {
    light: {
      background: tokens.cardBg,
      color: tokens.text,
      border: `1px solid ${tokens.border}`,
    },
    dark: {
      background: tokens.cardBgDark,
      color: tokens.textLight,
      border: `1px solid ${tokens.borderDark}`,
    },
    accent: {
      background: tokens.cardBgAccent,
      color: tokens.textLight,
      border: 'none',
    },
    image: {
      background: tokens.cardBgDark,
      color: tokens.textLight,
      border: 'none',
      overflow: 'hidden',
    },
    transparent: {
      background: 'transparent',
      color: tokens.text,
      border: `1px solid ${tokens.border}`,
    },
  };

  return (
    <div
      className={`card card-${variant} card-${theme} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        borderRadius: tokens.radius,
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered ? tokens.shadowHover : tokens.shadow,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: tokens.transition,
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        ...variantStyles[variant],
        ...themeStyles[theme],
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   BUTTON COMPONENT
   ═══════════════════════════════════════════ */
function Button({ children, href, variant = 'primary', style = {}, onClick }) {
  const [hovered, setHovered] = useState(false);

  const variants = {
    primary: {
      background: hovered ? tokens.greenDark : tokens.green,
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: hovered ? tokens.text : 'transparent',
      color: hovered ? '#fff' : tokens.text,
      border: `2px solid ${tokens.text}`,
    },
    ghost: {
      background: hovered ? 'rgba(255,255,255,0.15)' : 'transparent',
      color: '#fff',
      border: '2px solid rgba(255,255,255,0.4)',
    },
  };

  const commonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    borderRadius: '60px',
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '0.02em',
    textDecoration: 'none',
    textTransform: 'uppercase',
    transition: tokens.transition,
    cursor: 'pointer',
    fontFamily: 'inherit',
    whiteSpace: 'nowrap',
    ...variants[variant],
    ...style,
  };

  const Tag = href ? 'a' : 'button';
  return (
    <Tag
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={commonStyle}
    >
      {children}
    </Tag>
  );
}

/* ═══════════════════════════════════════════
   BADGE COMPONENT
   ═══════════════════════════════════════════ */
function Badge({ children, color = tokens.green }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '60px',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      background: `${color}18`,
      color: color,
    }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════
   SIDE MENU PANEL
   ═══════════════════════════════════════════ */
function SideMenu({ isOpen, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: isOpen ? '320px' : '0',
      height: '100vh',
      background: tokens.cardBg,
      borderRight: `1px solid ${tokens.border}`,
      zIndex: 1000,
      overflow: 'hidden',
      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '32px 28px',
        borderBottom: `1px solid ${tokens.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minWidth: '320px',
      }}>
        <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', opacity: 0.7, maxWidth: '220px', lineHeight: 1.5 }}>
          Redefining agency marketing — one organic idea at a time.
        </p>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer',
          color: tokens.text, padding: '4px',
        }}>
          &times;
        </button>
      </div>
      <nav style={{
        display: 'flex', flexDirection: 'column', padding: '20px 0', flex: 1,
        minWidth: '320px',
      }}>
        {[
          { label: 'Home', href: '/' },
          { label: 'Web Design', href: '/web-design/' },
          { label: 'SEO', href: '/seo/' },
          { label: 'Branding', href: '/branding/' },
          { label: 'Blog', href: '/blog/' },
          { label: 'About', href: '/about-us/' },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            style={{
              padding: '16px 28px',
              fontSize: '18px',
              fontWeight: 500,
              color: tokens.text,
              textDecoration: 'none',
              transition: tokens.transition,
              borderLeft: '3px solid transparent',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#f0f0eb';
              e.target.style.borderLeftColor = tokens.green;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderLeftColor = 'transparent';
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div style={{
        padding: '28px', borderTop: `1px solid ${tokens.border}`, minWidth: '320px',
      }}>
        <p style={{ margin: '0 0 8px', fontSize: '12px', opacity: 0.5 }}>ryan.organically@gmail.com</p>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.5 }}>Pittsburgh, PA</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CALENDAR PANEL
   ═══════════════════════════════════════════ */
function CalendarPanel({ isOpen, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: isOpen ? '420px' : '0',
      height: '100vh',
      background: tokens.cardBg,
      borderLeft: `1px solid ${tokens.border}`,
      zIndex: 1000,
      overflow: 'hidden',
      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '28px', borderBottom: `1px solid ${tokens.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        minWidth: '420px',
      }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 700 }}>Let's Connect</h3>
          <p style={{ margin: 0, fontSize: '13px', opacity: 0.6 }}>Pick a time that works for you</p>
        </div>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer',
          color: tokens.text, padding: '4px',
        }}>
          &times;
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', minWidth: '420px' }}>
        <iframe
          src="https://calendly.com/organically/30min?embed_domain=organicallyseo.com&embed_type=Inline&hide_gdpr_banner=1&primary_color=7ec700&hide_event_type_details=1"
          width="100%"
          height="100%"
          frameBorder="0"
          loading="lazy"
          title="Schedule a call"
          style={{ border: 'none', minHeight: '600px' }}
        />
      </div>
      <div style={{
        padding: '24px 28px', borderTop: `1px solid ${tokens.border}`,
        textAlign: 'center', minWidth: '420px',
      }}>
        <p style={{ fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 8px', color: tokens.textMuted }}>
          "Ryan was an absolute beauty to work with -- thoughtful, creative, and genuinely invested."
        </p>
        <p style={{ fontSize: '12px', fontWeight: 600, margin: 0, opacity: 0.7 }}>-- Sarah M., Founder</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOP NAV BAR
   ═══════════════════════════════════════════ */
function TopNav({ onMenuOpen, onCalendarOpen, darkMode, onToggleDarkMode }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: darkMode ? 'rgba(26,26,26,0.95)' : 'rgba(245,245,240,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${darkMode ? tokens.borderDark : tokens.border}`,
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      transition: tokens.transition,
    }}>
      {/* Hamburger */}
      <button onClick={onMenuOpen} style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '8px',
        display: 'flex', flexDirection: 'column', gap: '5px',
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            display: 'block', width: '22px', height: '2px',
            background: darkMode ? '#fff' : tokens.text,
            borderRadius: '2px', transition: tokens.transition,
          }} />
        ))}
      </button>

      {/* Logo */}
      <span style={{
        fontSize: '20px',
        fontWeight: 700,
        fontFamily: "'Vollkorn', serif",
        color: darkMode ? '#fff' : tokens.text,
        letterSpacing: '-0.01em',
      }}>
        Organically<span style={{ color: tokens.green }}>.</span>
      </span>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Dark mode toggle */}
        <button onClick={onToggleDarkMode} style={{
          background: darkMode ? 'rgba(255,255,255,0.1)' : '#f0f0eb',
          border: 'none',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          transition: tokens.transition,
        }}>
          {darkMode ? '\u2600' : '\u263E'}
        </button>

        {/* CTA */}
        <Button onClick={onCalendarOpen} style={{ padding: '10px 20px', fontSize: '12px' }}>
          Schedule a call
        </Button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   SERVICE CARD
   ═══════════════════════════════════════════ */
function ServiceCard({ icon, title, description, href, color = tokens.green }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      theme="light"
      style={{
        padding: '36px 28px',
        borderTop: `3px solid ${hovered ? color : 'transparent'}`,
        transition: tokens.transition,
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', marginBottom: '20px',
        }}>
          {icon}
        </div>
        <h3 style={{
          fontSize: '20px', fontWeight: 700, margin: '0 0 12px',
          fontFamily: "'Vollkorn', serif",
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '14px', lineHeight: 1.7, color: tokens.textMuted,
          margin: '0 0 24px', flex: 1,
        }}>
          {description}
        </p>
        <a href={href} style={{
          fontSize: '13px', fontWeight: 600, color: color,
          textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
        }}>
          Learn more
          <span style={{
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            transition: tokens.transition, display: 'inline-block',
          }}>
            &rarr;
          </span>
        </a>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   PORTFOLIO CARD
   ═══════════════════════════════════════════ */
function PortfolioCard({ title, category, imageSrc }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card
      theme="image"
      style={{
        padding: 0,
        aspectRatio: '1 / 1',
        cursor: 'pointer',
        minHeight: 'auto',
      }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {/* Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
          transition: tokens.transition,
        }} />

        {/* Content overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '28px',
          transform: hovered ? 'translateY(0)' : 'translateY(8px)',
          transition: tokens.transition,
        }}>
          <Badge color="#fff">{category}</Badge>
          <h4 style={{
            fontSize: '18px', fontWeight: 700, margin: '10px 0 0',
            color: '#fff', fontFamily: "'Vollkorn', serif",
          }}>
            {title}
          </h4>
        </div>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   BLOG CARD
   ═══════════════════════════════════════════ */
function BlogCard({ title, date, category, excerpt, href, categoryColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Card theme="light" style={{ padding: '28px' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
        <Badge color={categoryColor}>{category}</Badge>
        <h4 style={{
          fontSize: '18px', fontWeight: 700, margin: '14px 0 8px',
          fontFamily: "'Vollkorn', serif", lineHeight: 1.4,
        }}>
          <a href={href} style={{
            color: 'inherit', textDecoration: 'none',
            borderBottom: hovered ? `2px solid ${tokens.green}` : '2px solid transparent',
            transition: tokens.transition,
          }}>
            {title}
          </a>
        </h4>
        <p style={{
          fontSize: '12px', color: tokens.textMuted, margin: '0 0 12px',
          textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500,
        }}>
          {date}
        </p>
        <p style={{
          fontSize: '14px', lineHeight: 1.7, color: tokens.textMuted,
          margin: 0, flex: 1,
        }}>
          {excerpt}
        </p>
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════
   MAIN HOMEPAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function Design9CardModular() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const videoRef = useRef(null);

  // Close panels on escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setCalendarOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* ── DATA ── */
  const services = [
    {
      icon: '\u270E',
      title: 'Web Design',
      description: 'Designing intuitive, beautiful web experiences that convert visitors into customers. Custom-built, zero templates.',
      href: '/web-design/',
      color: '#ffb612',
    },
    {
      icon: '\u{1F50D}',
      title: 'SEO',
      description: 'Strategic keyword research, technical audits, and content that earns organic traffic and rankings.',
      href: '/seo/',
      color: tokens.green,
    },
    {
      icon: '\u{1F3A8}',
      title: 'Branding',
      description: 'Crafting distinctive visual identities that resonate with your audience and elevate your brand presence.',
      href: '/branding/',
      color: '#e83151',
    },
    {
      icon: '\u{1F4BB}',
      title: 'Front End Dev',
      description: 'Building responsive, performant interfaces with modern web technologies and best practices.',
      href: '/web-design/',
      color: '#009fb7',
    },
  ];

  const portfolio = [
    { title: 'IWC Cabinetry', category: 'Web Design', imageSrc: '/images/IWC-project-cover.png' },
    { title: 'Landscaping Brand', category: 'Branding', imageSrc: '/images/landscaping-cover.png' },
    { title: 'MVP Platform', category: 'Development', imageSrc: '/images/mvp-cover.png' },
    { title: 'SEO Campaign', category: 'SEO', imageSrc: '/images/seo-campaign-cover.png' },
  ];

  const blogPosts = [
    {
      title: 'What is SEO?',
      date: 'Updated April 17, 2024',
      category: 'Marketing',
      categoryColor: tokens.green,
      excerpt: "Ranking on search engines isn't luck. The average person makes 3-4 searches on Google per day. Learn how to answer them.",
      href: '/what-is-seo/',
    },
    {
      title: 'Webflow Launch Checklist',
      date: 'September 5, 2024',
      category: 'Design',
      categoryColor: '#009fb7',
      excerpt: 'Launching a website on Webflow can be terrifying, especially if it\'s your first time. Many things can go wrong.',
      href: '/webflow-launch-checklist/',
    },
    {
      title: 'Basics of Branding',
      date: 'June 6, 2024',
      category: 'Branding',
      categoryColor: '#e83151',
      excerpt: 'Deciding on an original name, colors, logo, and website that speak to you are big commitments.',
      href: '/branding-basics/',
    },
  ];

  /* ── STYLES ── */
  const pageBackground = darkMode ? '#111' : tokens.bg;
  const textColor = darkMode ? '#fff' : tokens.text;

  return (
    <div style={{
      minHeight: '100vh',
      background: pageBackground,
      color: textColor,
      fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
      transition: tokens.transition,
      overflowX: 'hidden',
    }}>
      {/* ── SIDE MENU ── */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* ── CALENDAR PANEL ── */}
      <CalendarPanel isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />

      {/* ── OVERLAY ── */}
      {(menuOpen || calendarOpen) && (
        <div
          onClick={() => { setMenuOpen(false); setCalendarOpen(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 999, cursor: 'pointer',
          }}
        />
      )}

      {/* ── TOP NAV ── */}
      <TopNav
        onMenuOpen={() => setMenuOpen(true)}
        onCalendarOpen={() => setCalendarOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* ── CARD GRID ── */}
      <main style={{
        maxWidth: tokens.maxWidth,
        margin: '0 auto',
        padding: `${tokens.gap} ${tokens.gap}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridAutoRows: 'minmax(320px, auto)',
          gap: tokens.gap,
        }}>

          {/* ────────────────────────────────────
              1. HERO CARD (full width, video bg)
              ──────────────────────────────────── */}
          <Card variant="full" theme="dark" style={{
            minHeight: '70vh',
            padding: 0,
            justifyContent: 'flex-end',
            position: 'relative',
          }}>
            {/* Video background */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.35,
              }}
            >
              <source src="/videos/theme video compressed.webm" type="video/webm" />
            </video>

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.4) 40%, transparent 100%)',
            }} />

            {/* Hero content */}
            <div style={{
              position: 'relative', zIndex: 2,
              padding: '60px 48px',
              maxWidth: '720px',
            }}>
              <p style={{
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: tokens.green,
                margin: '0 0 16px',
              }}>
                Web Creative with Organic Potential
              </p>
              <h1 style={{
                fontSize: 'clamp(48px, 7vw, 88px)',
                fontWeight: 700,
                fontFamily: "'Vollkorn', serif",
                lineHeight: 1.05,
                margin: '0 0 24px',
                color: '#fff',
              }}>
                Organically<span style={{ color: tokens.green }}>.</span>
              </h1>
              <p style={{
                fontSize: '18px',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.75)',
                margin: '0 0 36px',
                maxWidth: '520px',
              }}>
                A vast space where stray ideas can wander, take root, and quietly grow bold. Combining web creative with organic potential.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Button onClick={() => setCalendarOpen(true)}>Get Your Free Website Review</Button>
                <Button variant="ghost" href="/about-us/">Learn More</Button>
              </div>
            </div>

            {/* Social proof badge (bottom right) */}
            <div style={{
              position: 'absolute', bottom: '48px', right: '48px',
              zIndex: 2,
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
              borderRadius: '12px',
              padding: '20px 24px',
              maxWidth: '280px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} style={{ color: tokens.green, fontSize: '14px' }}>{'\u2605'}</span>
                ))}
              </div>
              <p style={{
                fontSize: '13px', fontStyle: 'italic', lineHeight: 1.6,
                color: 'rgba(255,255,255,0.8)', margin: '0 0 8px',
              }}>
                "His adaptability, expertise, and willingness to collaborate made the project a creative experience."
              </p>
              <p style={{
                fontSize: '11px', fontWeight: 600, margin: 0,
                color: 'rgba(255,255,255,0.5)',
              }}>
                -- IWC Cabinetry
              </p>
            </div>
          </Card>

          {/* ────────────────────────────────────
              2. SERVICES CARDS (4 standard cards)
              ──────────────────────────────────── */}
          {services.map((svc) => (
            <ServiceCard key={svc.title} {...svc} />
          ))}

          {/* ────────────────────────────────────
              3. STATS / SOCIAL PROOF CARD (full width)
              ──────────────────────────────────── */}
          <Card variant="full" theme="accent" style={{
            minHeight: 'auto',
            padding: '48px',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '32px',
          }}>
            {[
              { stat: '2.5M+', label: 'Impressions delivered for clients' },
              { stat: 'AI', label: 'Search optimized content' },
              { stat: '100%', label: 'Custom designs, zero templates' },
              { stat: '5.0', label: 'Client satisfaction rating' },
            ].map((item) => (
              <div key={item.stat} style={{ textAlign: 'center', minWidth: '140px' }}>
                <div style={{
                  fontSize: '42px', fontWeight: 800,
                  fontFamily: "'Vollkorn', serif",
                  marginBottom: '6px',
                }}>
                  {item.stat}
                </div>
                <div style={{
                  fontSize: '13px', opacity: 0.85, lineHeight: 1.4, maxWidth: '160px', margin: '0 auto',
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </Card>

          {/* ────────────────────────────────────
              4. PORTFOLIO CARDS (4 square cards)
              ──────────────────────────────────── */}
          {portfolio.map((item) => (
            <PortfolioCard key={item.title} {...item} />
          ))}

          {/* ────────────────────────────────────
              5. TESTIMONIAL CARD (full width, dark)
              ──────────────────────────────────── */}
          <Card variant="full" theme="dark" style={{
            minHeight: 'auto',
            padding: '64px 48px',
            textAlign: 'center',
            alignItems: 'center',
          }}>
            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', justifyContent: 'center' }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: tokens.green, fontSize: '20px' }}>{'\u2605'}</span>
              ))}
            </div>
            <blockquote style={{
              fontSize: 'clamp(20px, 3vw, 32px)',
              fontFamily: "'Vollkorn', serif",
              fontStyle: 'italic',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 0 28px',
              color: 'rgba(255,255,255,0.9)',
            }}>
              "His adaptability, expertise, and willingness to collaborate made the project a creative experience that produced an asset for our company to use and build on for years to come."
            </blockquote>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
                IWC Cabinetry
              </p>
              <p style={{ fontSize: '13px', margin: 0, opacity: 0.5 }}>
                Web Design & SEO Client
              </p>
            </div>
          </Card>

          {/* ────────────────────────────────────
              6. BLOG CARDS (3 cards)
              ──────────────────────────────────── */}
          {/* Section header card (full width, minimal) */}
          <Card variant="full" theme="transparent" style={{
            minHeight: 'auto',
            padding: '36px 32px',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: 'none',
            boxShadow: 'none',
            background: 'transparent',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src="/images/coffee-asset.png"
                alt="Coffee icon"
                style={{ width: '40px', height: '40px', opacity: 0.85 }}
              />
              <h2 style={{
                fontSize: '28px', fontWeight: 700, margin: 0,
                fontFamily: "'Vollkorn', serif",
                color: darkMode ? '#fff' : tokens.text,
              }}>
                Coffee Break
              </h2>
            </div>
            <a href="/blog/" style={{
              fontSize: '14px', fontWeight: 600, color: tokens.green,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              View all posts &rarr;
            </a>
          </Card>

          {blogPosts.map((post) => (
            <BlogCard key={post.title} {...post} />
          ))}

          {/* ────────────────────────────────────
              7. CALENDLY EMBED CARD (full width)
              ──────────────────────────────────── */}
          <Card variant="full" theme="light" style={{
            minHeight: '500px',
            padding: 0,
            flexDirection: 'row',
            overflow: 'hidden',
          }}>
            {/* Left: CTA content */}
            <div style={{
              flex: '0 0 40%',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRight: `1px solid ${tokens.border}`,
            }}>
              <img
                src="/images/monstera-icon.png"
                alt="Monstera"
                style={{ width: '60px', height: '60px', marginBottom: '20px', opacity: 0.9 }}
              />
              <h2 style={{
                fontSize: '32px', fontWeight: 700, margin: '0 0 16px',
                fontFamily: "'Vollkorn', serif", lineHeight: 1.2,
              }}>
                Ready to grow?
              </h2>
              <p style={{
                fontSize: '15px', lineHeight: 1.7, color: tokens.textMuted,
                margin: '0 0 28px',
              }}>
                Book a free 30-minute consultation. Let's talk about your goals, your website, and how organic strategy can move the needle.
              </p>
              <Button href="https://calendly.com/organically/30min">
                Book a Free Call
              </Button>
            </div>

            {/* Right: Calendly embed */}
            <div style={{ flex: 1, minHeight: '500px' }}>
              <iframe
                src="https://calendly.com/organically/30min?embed_domain=organicallyseo.com&embed_type=Inline&hide_gdpr_banner=1&primary_color=7ec700&hide_event_type_details=1"
                width="100%"
                height="100%"
                frameBorder="0"
                loading="lazy"
                title="Schedule a call"
                style={{ border: 'none', minHeight: '500px' }}
              />
            </div>
          </Card>

          {/* ────────────────────────────────────
              8. "CHOOSE YOUR ADVENTURE" CARD
              ──────────────────────────────────── */}
          <Card variant="full" theme="dark" style={{
            minHeight: 'auto',
            padding: '48px',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <h2 style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 700,
              fontFamily: "'Vollkorn', serif",
              margin: '0 0 36px',
              color: '#fff',
            }}>
              Choose your adventure
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              width: '100%',
              maxWidth: '720px',
            }}>
              {[
                { label: 'I need a brand mark or identity.', href: '/branding/', color: '#e83151' },
                { label: 'I need a website.', href: '/web-design/', color: '#ffb612' },
                { label: 'I need organic traffic.', href: '/seo/', color: tokens.green },
              ].map((card) => (
                <AdventureCard key={card.label} {...card} />
              ))}
            </div>
          </Card>

        </div>{/* end grid */}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        maxWidth: tokens.maxWidth,
        margin: '0 auto',
        padding: `${tokens.gap}`,
      }}>
        <Card variant="full" theme={darkMode ? 'dark' : 'light'} style={{
          minHeight: 'auto',
          padding: '48px',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '40px',
        }}>
          {/* Logo + tagline */}
          <div style={{ maxWidth: '280px' }}>
            <h3 style={{
              fontSize: '32px', fontWeight: 700, margin: '0 0 12px',
              fontFamily: "'Vollkorn', serif",
            }}>
              Organically<span style={{ color: tokens.green }}>.</span>
            </h3>
            <p style={{
              fontSize: '14px', lineHeight: 1.7, margin: '0 0 20px',
              color: darkMode ? 'rgba(255,255,255,0.6)' : tokens.textMuted,
            }}>
              Where ideas take root and grow bold.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <SocialIcon href="https://twitter.com/organicallyseo" label="X" />
              <SocialIcon href="https://www.linkedin.com/in/ryan-scanlon31/" label="in" />
            </div>
          </div>

          {/* Link columns */}
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
            <FooterColumn title="Agency" links={[
              { label: 'Web Design', href: '/web-design/' },
              { label: 'SEO', href: '/seo/' },
              { label: 'Branding', href: '/branding/' },
              { label: 'Blog', href: '/blog/' },
            ]} darkMode={darkMode} />
            <FooterColumn title="Contact" links={[
              { label: 'Schedule a Call', href: 'https://calendly.com/organically/30min' },
              { label: 'ryan.organically@gmail.com', href: 'mailto:ryan.organically@gmail.com' },
            ]} darkMode={darkMode} />
            <FooterColumn title="Legal" links={[
              { label: 'Privacy Policy', href: '/privacy-policy/' },
            ]} darkMode={darkMode} />
          </div>

          {/* Copyright */}
          <div style={{
            width: '100%',
            borderTop: `1px solid ${darkMode ? tokens.borderDark : tokens.border}`,
            paddingTop: '20px',
            fontSize: '12px',
            opacity: 0.5,
          }}>
            Copyright 2026 Organically SEO. All rights reserved.
          </div>
        </Card>
      </footer>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        @media (max-width: 768px) {
          main > div {
            grid-template-columns: 1fr;
          }
          .card-full {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 768px) {
          /* Calendly card stacks vertically */
          .card-full > div[style*="flex: 0 0 40%"] {
            flex: 1 1 100%;
          }

          /* Adventure cards stack */
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr;
          }
        }

        /* Smooth scroll */
        html {
          scroll-behavior: smooth;
        }

        /* Selection color */
        ::selection {
          background: ${tokens.green}40;
          color: ${tokens.text};
        }

        /* Focus styles for accessibility */
        *:focus-visible {
          outline: 2px solid ${tokens.green};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADVENTURE CARD (sub-component)
   ═══════════════════════════════════════════ */
function AdventureCard({ label, href, color }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        borderRadius: tokens.radiusSm,
        border: `2px solid ${hovered ? color : 'rgba(255,255,255,0.15)'}`,
        background: hovered ? `${color}15` : 'transparent',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: 600,
        textAlign: 'center',
        lineHeight: 1.4,
        transition: tokens.transition,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {label}
    </a>
  );
}

/* ═══════════════════════════════════════════
   FOOTER HELPERS
   ═══════════════════════════════════════════ */
function FooterColumn({ title, links, darkMode }) {
  return (
    <div>
      <h4 style={{
        fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.06em', margin: '0 0 16px',
        color: darkMode ? 'rgba(255,255,255,0.5)' : tokens.textMuted,
      }}>
        {title}
      </h4>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          style={{
            display: 'block',
            fontSize: '14px',
            color: darkMode ? 'rgba(255,255,255,0.7)' : tokens.textMuted,
            textDecoration: 'none',
            marginBottom: '10px',
            transition: tokens.transition,
          }}
          onMouseEnter={(e) => e.target.style.color = tokens.green}
          onMouseLeave={(e) => e.target.style.color = darkMode ? 'rgba(255,255,255,0.7)' : tokens.textMuted}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

function SocialIcon({ href, label }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '36px', height: '36px',
        borderRadius: '50%',
        border: `1px solid ${tokens.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none',
        fontSize: '13px', fontWeight: 700,
        color: hovered ? '#fff' : tokens.textMuted,
        background: hovered ? tokens.green : 'transparent',
        transition: tokens.transition,
      }}
    >
      {label}
    </a>
  );
}
