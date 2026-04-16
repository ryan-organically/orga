/**
 * Design 15: SECTION COMPARISON / SPLIT-SCREEN 2026 Homepage
 * Organically - Web Creative with Organic Potential
 *
 * Architecture:
 *   - Every content section uses a left-right split comparison format
 *   - Left side = "Without Organically" (desaturated, gray, broken)
 *   - Right side = "With Organically" (vibrant, green, optimized)
 *   - CSS Grid approach: 2-column grid on each split row, collapsing to stacked on mobile
 *   - Diagonal divider SVG between halves for visual flair
 *   - Hero remains full-width (H1, video, CTA) as a neutral anchor
 *   - Portfolio: "Before" thumbnails left, "After" right
 *   - Testimonial: quote left, stat/badge right
 *   - "Pick Your Starting Challenge": split problems (left) vs solutions (right)
 *
 * CSS Grid approach:
 *   - Each SplitSection uses grid-template-columns: 1fr 1fr
 *   - Diagonal divider overlay between columns via CSS pseudo-element
 *   - Left column gets desaturated filter + muted palette
 *   - Right column gets vibrant palette + green accents
 *   - @media (max-width: 768px) collapses to single column, stacks vertically
 *
 * LOC: ~1590 (component + inline styles)
 *
 * Essential elements included:
 *   [x] Navigation (top bar with hamburger, dark mode, CTA)
 *   [x] Hero with video background (full-width, neutral)
 *   [x] Services as split comparison (without vs with)
 *   [x] Portfolio split (Before vs After side-by-side)
 *   [x] Blog posts (Coffee Break section)
 *   [x] Testimonial split (quote left, stat right)
 *   [x] "Pick Your Starting Challenge" (problems vs solutions)
 *   [x] Calendly embed
 *   [x] Footer
 *   [x] Side menu panel (left)
 *   [x] Calendar panel (right)
 */

import React, { useState, useRef, useEffect } from 'react';

/* ===================================================
   DESIGN TOKENS
   =================================================== */
const tokens = {
  // Core palette
  bg:           '#f5f5f0',
  text:         '#1a1a1a',
  textMuted:    '#666666',
  textLight:    '#ffffff',
  green:        '#7ec700',
  greenDark:    '#5a9100',
  greenBg:      '#f1fae0',
  border:       '#e0e0dc',
  borderDark:   'rgba(255,255,255,0.1)',

  // Split-specific
  grayBg:       '#e8e8e4',       // "Without" side background
  grayText:     '#888888',       // "Without" side text
  grayAccent:   '#b0b0a8',       // "Without" side accent
  grayCard:     '#d8d8d4',       // "Without" side card bg
  vibrantBg:    '#ffffff',       // "With" side background
  vibrantCard:  '#f8fdf0',       // "With" side card bg
  negativeBg:   '#faf5f5',       // Problem side subtle bg
  negativeText: '#c0392b',       // Problem accent color
  solutionBg:   '#f5faf5',       // Solution side bg

  // Layout
  radius:       '16px',
  radiusSm:     '10px',
  gap:          '0px',           // No gap between split halves
  sectionGap:   '0px',          // Sections flush together
  maxWidth:     '1400px',
  navHeight:    '64px',

  // Transitions
  transition:   'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  slow:         'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
};

/* ===================================================
   RESPONSIVE HELPER (inline media query simulation)
   =================================================== */
const MOBILE_BREAK = 768;

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return width;
}

/* ===================================================
   SPLIT SECTION (core layout primitive)
   Each section is a 2-column grid: left "without" / right "with"
   =================================================== */
function SplitSection({
  leftContent,
  rightContent,
  leftBg = tokens.grayBg,
  rightBg = tokens.vibrantBg,
  minHeight = '500px',
  showDivider = true,
  leftLabel = 'Without Organically',
  rightLabel = 'With Organically',
  showLabels = true,
  id,
  style = {},
}) {
  const width = useWindowWidth();
  const isMobile = width <= MOBILE_BREAK;

  return (
    <section id={id} style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      minHeight: isMobile ? 'auto' : minHeight,
      position: 'relative',
      ...style,
    }}>
      {/* ── LEFT HALF ── */}
      <div style={{
        background: leftBg,
        padding: isMobile ? '48px 24px' : '64px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        filter: leftBg === tokens.grayBg ? 'saturate(0.3)' : 'none',
      }}>
        {showLabels && (
          <div style={{
            position: 'absolute',
            top: isMobile ? '16px' : '24px',
            left: isMobile ? '24px' : '48px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: tokens.grayAccent,
            background: 'rgba(0,0,0,0.04)',
            padding: '6px 14px',
            borderRadius: '60px',
          }}>
            {leftLabel}
          </div>
        )}
        {leftContent}
      </div>

      {/* ── DIAGONAL DIVIDER ── */}
      {showDivider && !isMobile && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '100%',
          zIndex: 5,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}>
          <svg width="60" height="100%" viewBox="0 0 60 100" preserveAspectRatio="none"
            style={{ width: '100%', height: '100%' }}>
            <polygon points="0,0 60,0 60,100 0,100" fill={rightBg} />
            <polygon points="0,0 30,0 0,100" fill={leftBg} />
            <line x1="30" y1="0" x2="0" y2="100" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* ── RIGHT HALF ── */}
      <div style={{
        background: rightBg,
        padding: isMobile ? '48px 24px' : '64px 48px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {showLabels && (
          <div style={{
            position: 'absolute',
            top: isMobile ? '16px' : '24px',
            right: isMobile ? '24px' : '48px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: tokens.green,
            background: `${tokens.green}15`,
            padding: '6px 14px',
            borderRadius: '60px',
          }}>
            {rightLabel}
          </div>
        )}
        {rightContent}
      </div>
    </section>
  );
}

/* ===================================================
   BUTTON COMPONENT
   =================================================== */
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
    disabled: {
      background: '#ccc',
      color: '#999',
      border: 'none',
      cursor: 'not-allowed',
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
      }}
    >
      {children}
    </Tag>
  );
}

/* ===================================================
   BADGE COMPONENT
   =================================================== */
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

/* ===================================================
   COMPARISON METRIC (for service split)
   =================================================== */
function ComparisonMetric({ icon, label, badValue, goodValue, isBad = false }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      marginBottom: '28px',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: isBad ? 'rgba(192,57,43,0.08)' : `${tokens.green}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        flexShrink: 0,
        filter: isBad ? 'saturate(0.3)' : 'none',
      }}>
        {icon}
      </div>
      <div>
        <p style={{
          margin: '0 0 4px',
          fontSize: '14px',
          fontWeight: 700,
          color: isBad ? tokens.grayText : tokens.text,
          fontFamily: "'Vollkorn', serif",
        }}>
          {label}
        </p>
        <p style={{
          margin: 0,
          fontSize: '13px',
          lineHeight: 1.6,
          color: isBad ? tokens.grayAccent : tokens.textMuted,
        }}>
          {isBad ? badValue : goodValue}
        </p>
      </div>
    </div>
  );
}

/* ===================================================
   SIDE MENU PANEL
   =================================================== */
function SideMenu({ isOpen, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: isOpen ? '320px' : '0',
      height: '100vh',
      background: '#fff',
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
          Redefining agency marketing -- one organic idea at a time.
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

/* ===================================================
   CALENDAR PANEL
   =================================================== */
function CalendarPanel({ isOpen, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: isOpen ? '420px' : '0',
      height: '100vh',
      background: '#fff',
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

/* ===================================================
   TOP NAV BAR
   =================================================== */
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
      height: tokens.navHeight,
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
        <Button onClick={onCalendarOpen} style={{ padding: '10px 20px', fontSize: '12px' }}>
          Schedule a call
        </Button>
      </div>
    </nav>
  );
}

/* ===================================================
   PORTFOLIO THUMBNAIL PAIR
   =================================================== */
function PortfolioPair({ title, category, beforeSrc, afterSrc }) {
  const [hovered, setHovered] = useState(false);
  const width = useWindowWidth();
  const isMobile = width <= MOBILE_BREAK;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        borderRadius: tokens.radius,
        overflow: 'hidden',
        border: `1px solid ${tokens.border}`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.04)',
        transition: tokens.transition,
      }}
    >
      {/* Before */}
      <div style={{
        position: 'relative',
        aspectRatio: '16 / 10',
        background: tokens.grayBg,
        overflow: 'hidden',
      }}>
        <img
          src={beforeSrc}
          alt={`${title} - Before`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'grayscale(100%) contrast(0.85)',
            opacity: 0.7,
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '4px 10px',
          borderRadius: '4px',
        }}>
          Before
        </div>
      </div>

      {/* After */}
      <div style={{
        position: 'relative',
        aspectRatio: '16 / 10',
        background: tokens.vibrantCard,
        overflow: 'hidden',
      }}>
        <img
          src={afterSrc}
          alt={`${title} - After`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
            transition: tokens.slow,
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: tokens.green,
          color: '#fff',
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '4px 10px',
          borderRadius: '4px',
        }}>
          After
        </div>
      </div>

      {/* Title bar */}
      <div style={{
        gridColumn: isMobile ? '1' : '1 / -1',
        padding: '16px 20px',
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${tokens.border}`,
      }}>
        <div>
          <h4 style={{
            margin: '0 0 2px',
            fontSize: '16px',
            fontWeight: 700,
            fontFamily: "'Vollkorn', serif",
          }}>
            {title}
          </h4>
          <Badge color={tokens.green}>{category}</Badge>
        </div>
        <span style={{
          color: tokens.green,
          fontSize: '20px',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: tokens.transition,
        }}>
          &rarr;
        </span>
      </div>
    </div>
  );
}

/* ===================================================
   CHALLENGE CARD (for "Pick Your Starting Challenge")
   =================================================== */
function ChallengeCard({ icon, problem, solution, href, color = tokens.green }) {
  const [hovered, setHovered] = useState(false);
  const width = useWindowWidth();
  const isMobile = width <= MOBILE_BREAK;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        borderRadius: tokens.radius,
        overflow: 'hidden',
        border: `1px solid ${hovered ? tokens.green : tokens.border}`,
        transition: tokens.transition,
        cursor: 'pointer',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.08)' : '0 1px 6px rgba(0,0,0,0.03)',
      }}
    >
      {/* Problem side */}
      <div style={{
        padding: '28px',
        background: tokens.negativeBg,
        borderRight: isMobile ? 'none' : `1px solid ${tokens.border}`,
        borderBottom: isMobile ? `1px solid ${tokens.border}` : 'none',
      }}>
        <div style={{
          fontSize: '28px',
          marginBottom: '12px',
          filter: 'grayscale(100%)',
          opacity: 0.5,
        }}>
          {icon}
        </div>
        <p style={{
          margin: 0,
          fontSize: '15px',
          lineHeight: 1.6,
          color: tokens.grayText,
          fontStyle: 'italic',
        }}>
          "{problem}"
        </p>
        <div style={{
          marginTop: '14px',
          width: '28px',
          height: '3px',
          background: tokens.negativeText,
          borderRadius: '2px',
          opacity: 0.4,
        }} />
      </div>

      {/* Solution side */}
      <div style={{
        padding: '28px',
        background: tokens.solutionBg,
      }}>
        <div style={{
          fontSize: '28px',
          marginBottom: '12px',
        }}>
          {'\u2714'}
        </div>
        <p style={{
          margin: '0 0 16px',
          fontSize: '15px',
          lineHeight: 1.6,
          color: tokens.text,
          fontWeight: 500,
        }}>
          {solution}
        </p>
        <a href={href} style={{
          fontSize: '13px',
          fontWeight: 600,
          color: color,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          Learn more
          <span style={{
            transform: hovered ? 'translateX(4px)' : 'translateX(0)',
            transition: tokens.transition,
            display: 'inline-block',
          }}>
            &rarr;
          </span>
        </a>
      </div>
    </div>
  );
}

/* ===================================================
   BLOG CARD
   =================================================== */
function BlogCard({ title, date, category, excerpt, href, categoryColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{
      background: '#fff',
      borderRadius: tokens.radius,
      border: `1px solid ${tokens.border}`,
      padding: '28px',
      boxShadow: hovered ? '0 8px 28px rgba(0,0,0,0.08)' : '0 1px 6px rgba(0,0,0,0.03)',
      transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      transition: tokens.transition,
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        margin: 0,
      }}>
        {excerpt}
      </p>
    </div>
  );
}

/* ===================================================
   MAIN HOMEPAGE COMPONENT
   =================================================== */
export default function Design15SplitScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const videoRef = useRef(null);
  const width = useWindowWidth();
  const isMobile = width <= MOBILE_BREAK;

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

  /* -- DATA -- */
  const serviceComparisons = [
    {
      icon: '\u{1F3F7}',
      label: 'Website Speed',
      badValue: '8+ second load time. Visitors bounce before the page renders. Template bloat everywhere.',
      goodValue: 'Sub-2-second loads. Performance-first builds with optimized assets and clean code.',
    },
    {
      icon: '\u{1F50D}',
      label: 'Search Visibility',
      badValue: 'Page 5 of Google. No keyword strategy, no meta tags, no structured data.',
      goodValue: 'Page 1 rankings. Strategic keyword targeting, technical SEO, and content that earns traffic.',
    },
    {
      icon: '\u{1F3A8}',
      label: 'Design Quality',
      badValue: 'Generic template. Looks like every other site in your industry. No brand identity.',
      goodValue: 'Custom-designed from scratch. Zero templates. A visual identity that stands apart.',
    },
    {
      icon: '\u{1F4CA}',
      label: 'Conversion Rate',
      badValue: 'No clear CTAs. Visitors browse and leave. No tracking, no funnel, no strategy.',
      goodValue: 'Conversion-focused layouts with clear user journeys, A/B-tested CTAs, and analytics.',
    },
  ];

  const portfolioItems = [
    { title: 'IWC Cabinetry', category: 'Web Design', beforeSrc: '/images/IWC-project-cover.png', afterSrc: '/images/IWC-project-cover.png' },
    { title: 'Landscaping Brand', category: 'Branding', beforeSrc: '/images/landscaping-cover.png', afterSrc: '/images/landscaping-cover.png' },
  ];

  const challenges = [
    {
      icon: '\u{1F6AB}',
      problem: 'I have no brand identity. My business looks invisible next to competitors.',
      solution: 'We create distinctive logos, typography, and visual systems that make your brand unmistakable. Custom identity from ideation to final assets.',
      href: '/branding/',
      color: '#e83151',
    },
    {
      icon: '\u{1F4BB}',
      problem: 'My website looks outdated and doesn\'t convert any visitors to customers.',
      solution: 'Custom-built websites designed for conversions. Performance-first, mobile-ready, and crafted to turn visitors into leads.',
      href: '/web-design/',
      color: '#ffb612',
    },
    {
      icon: '\u{1F4C9}',
      problem: 'I\'m getting zero organic traffic. My competitors outrank me on everything.',
      solution: 'Strategic SEO that targets the right keywords, fixes technical issues, and creates content that earns rankings organically.',
      href: '/seo/',
      color: tokens.green,
    },
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

  return (
    <div style={{
      minHeight: '100vh',
      background: tokens.bg,
      color: tokens.text,
      fontFamily: "'Lato', 'Helvetica Neue', sans-serif",
      overflowX: 'hidden',
    }}>
      {/* -- SIDE MENU -- */}
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      {/* -- CALENDAR PANEL -- */}
      <CalendarPanel isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} />

      {/* -- OVERLAY -- */}
      {(menuOpen || calendarOpen) && (
        <div
          onClick={() => { setMenuOpen(false); setCalendarOpen(false); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 999, cursor: 'pointer',
          }}
        />
      )}

      {/* -- TOP NAV -- */}
      <TopNav
        onMenuOpen={() => setMenuOpen(true)}
        onCalendarOpen={() => setCalendarOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* ============================================
          1. HERO SECTION (Full-width, neutral)
          ============================================ */}
      <section style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'flex-end',
        background: '#1a1a1a',
        overflow: 'hidden',
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
            opacity: 0.3,
          }}
        >
          <source src="/videos/theme video compressed.webm" type="video/webm" />
        </video>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.3) 50%, transparent 100%)',
        }} />

        {/* Hero content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: tokens.maxWidth,
          margin: '0 auto',
          width: '100%',
          padding: isMobile ? '48px 24px' : '80px 48px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: '40px',
        }}>
          {/* Left hero text */}
          <div style={{ maxWidth: '640px' }}>
            <p style={{
              fontSize: '13px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.12em', color: tokens.green, margin: '0 0 16px',
            }}>
              Web Creative with Organic Potential
            </p>
            <h1 style={{
              fontSize: 'clamp(48px, 7vw, 96px)',
              fontWeight: 700,
              fontFamily: "'Vollkorn', serif",
              lineHeight: 1.05,
              margin: '0 0 24px',
              color: '#fff',
            }}>
              Organically<span style={{ color: tokens.green }}>.</span>
            </h1>
            <p style={{
              fontSize: '18px', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)',
              margin: '0 0 36px', maxWidth: '500px',
            }}>
              A vast space where stray ideas can wander, take root, and quietly grow bold. Combining web creative with organic potential.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Button onClick={() => setCalendarOpen(true)}>Get Your Free Website Review</Button>
              <Button variant="ghost" href="/about-us/">Learn More</Button>
            </div>
          </div>

          {/* Right hero social proof */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '300px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: tokens.green, fontSize: '14px' }}>{'\u2605'}</span>
              ))}
            </div>
            <p style={{
              fontSize: '13px', fontStyle: 'italic', lineHeight: 1.6,
              color: 'rgba(255,255,255,0.8)', margin: '0 0 10px',
            }}>
              "His adaptability, expertise, and willingness to collaborate made the project a creative experience."
            </p>
            <p style={{ fontSize: '11px', fontWeight: 600, margin: 0, color: 'rgba(255,255,255,0.5)' }}>
              -- IWC Cabinetry
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          2. SECTION DIVIDER: "See the difference"
          ============================================ */}
      <div style={{
        background: '#fff',
        padding: '48px 24px',
        textAlign: 'center',
        borderBottom: `1px solid ${tokens.border}`,
      }}>
        <p style={{
          fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.15em', color: tokens.green, margin: '0 0 8px',
        }}>
          Compare
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 700,
          fontFamily: "'Vollkorn', serif",
          margin: '0 0 12px',
          color: tokens.text,
          lineHeight: 1.2,
        }}>
          See the difference Organically makes<span style={{ color: tokens.green }}>.</span>
        </h2>
        <p style={{
          fontSize: '16px', color: tokens.textMuted, margin: 0, maxWidth: '520px',
          marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6,
        }}>
          Every section below compares the typical approach with what we deliver. The contrast speaks for itself.
        </p>
      </div>

      {/* ============================================
          3. SERVICES SPLIT: Without vs With
          ============================================ */}
      <SplitSection
        id="services-comparison"
        minHeight="auto"
        leftContent={
          <div style={{ paddingTop: '32px' }}>
            <h3 style={{
              fontSize: '24px', fontWeight: 700, margin: '0 0 8px',
              fontFamily: "'Vollkorn', serif",
              color: tokens.grayText,
            }}>
              The Typical Agency Experience
            </h3>
            <p style={{
              fontSize: '14px', color: tokens.grayAccent, margin: '0 0 32px',
              lineHeight: 1.6,
            }}>
              Generic templates, set-and-forget strategies, and results that never materialize.
            </p>
            {serviceComparisons.map((item) => (
              <ComparisonMetric
                key={item.label}
                icon={item.icon}
                label={item.label}
                badValue={item.badValue}
                goodValue={item.goodValue}
                isBad={true}
              />
            ))}
            <Button variant="disabled" style={{ pointerEvents: 'none', opacity: 0.5, filter: 'grayscale(100%)' }}>
              Settle for less
            </Button>
          </div>
        }
        rightContent={
          <div style={{ paddingTop: '32px' }}>
            <h3 style={{
              fontSize: '24px', fontWeight: 700, margin: '0 0 8px',
              fontFamily: "'Vollkorn', serif",
              color: tokens.text,
            }}>
              The Organically Difference
            </h3>
            <p style={{
              fontSize: '14px', color: tokens.textMuted, margin: '0 0 32px',
              lineHeight: 1.6,
            }}>
              Custom-built solutions, ongoing optimization, and measurable growth.
            </p>
            {serviceComparisons.map((item) => (
              <ComparisonMetric
                key={item.label}
                icon={item.icon}
                label={item.label}
                badValue={item.badValue}
                goodValue={item.goodValue}
                isBad={false}
              />
            ))}
            <Button onClick={() => setCalendarOpen(true)}>
              Get Your Free Review
            </Button>
          </div>
        }
      />

      {/* ============================================
          4. STATS BAR (Full-width green accent)
          ============================================ */}
      <section style={{
        background: tokens.green,
        padding: isMobile ? '40px 24px' : '48px',
        display: 'flex',
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
          <div key={item.stat} style={{ textAlign: 'center', minWidth: '120px' }}>
            <div style={{
              fontSize: isMobile ? '32px' : '42px',
              fontWeight: 800,
              fontFamily: "'Vollkorn', serif",
              color: '#fff',
              marginBottom: '4px',
            }}>
              {item.stat}
            </div>
            <div style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.4, maxWidth: '160px', margin: '0 auto',
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </section>

      {/* ============================================
          5. PORTFOLIO SPLIT: Before vs After
          ============================================ */}
      <section style={{
        background: '#fff',
        padding: isMobile ? '48px 24px' : '80px 48px',
      }}>
        <div style={{ maxWidth: tokens.maxWidth, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{
              fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.15em', color: tokens.green, margin: '0 0 8px',
            }}>
              Portfolio
            </p>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              fontFamily: "'Vollkorn', serif",
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}>
              Before &amp; After<span style={{ color: tokens.green }}>.</span>
            </h2>
            <p style={{
              fontSize: '15px', color: tokens.textMuted, margin: 0, maxWidth: '460px',
              marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6,
            }}>
              Side-by-side comparisons showing the transformation from concept to launch.
            </p>
          </div>

          {/* Portfolio pairs */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            maxWidth: '960px',
            margin: '0 auto',
          }}>
            {portfolioItems.map((item) => (
              <PortfolioPair key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          6. TESTIMONIAL SPLIT: Quote vs Stat
          ============================================ */}
      <SplitSection
        id="testimonial-split"
        leftBg="#1a1a1a"
        rightBg={tokens.green}
        showDivider={true}
        showLabels={false}
        minHeight="400px"
        leftContent={
          <div style={{ textAlign: 'center', maxWidth: '420px', margin: '0 auto' }}>
            {/* Stars */}
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '20px' }}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{ color: tokens.green, fontSize: '18px' }}>{'\u2605'}</span>
              ))}
            </div>
            <blockquote style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              fontFamily: "'Vollkorn', serif",
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.9)',
              margin: '0 0 20px',
              filter: 'none',
            }}>
              "His adaptability, expertise, and willingness to collaborate made the project a creative experience that produced an asset for our company to use and build on for years to come."
            </blockquote>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
              IWC Cabinetry
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Web Design &amp; SEO Client
            </p>
          </div>
        }
        rightContent={
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '20px',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ fontSize: '36px', color: '#fff' }}>{'\u2605'}</span>
            </div>
            <div style={{
              fontSize: '64px',
              fontWeight: 800,
              fontFamily: "'Vollkorn', serif",
              color: '#fff',
              lineHeight: 1,
            }}>
              5.0
            </div>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.85)',
              margin: 0,
              fontWeight: 500,
            }}>
              Client satisfaction rating
            </p>
            <div style={{
              marginTop: '8px',
              padding: '8px 20px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '60px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              Verified Reviews
            </div>
          </div>
        }
      />

      {/* ============================================
          7. "PICK YOUR STARTING CHALLENGE" SPLIT
          ============================================ */}
      <section style={{
        background: tokens.bg,
        padding: isMobile ? '48px 24px' : '80px 48px',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{
              fontSize: '13px', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.15em', color: tokens.green, margin: '0 0 8px',
            }}>
              Your Move
            </p>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              fontFamily: "'Vollkorn', serif",
              margin: '0 0 12px',
              lineHeight: 1.2,
            }}>
              Pick Your Starting Challenge<span style={{ color: tokens.green }}>.</span>
            </h2>
            <p style={{
              fontSize: '15px', color: tokens.textMuted, margin: 0, maxWidth: '500px',
              marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6,
            }}>
              Every business faces obstacles. Each card shows the problem on the left and how Organically solves it on the right.
            </p>
          </div>

          {/* Challenge cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {challenges.map((ch) => (
              <ChallengeCard key={ch.problem} {...ch} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          8. COFFEE BREAK (Blog section)
          ============================================ */}
      <section style={{
        background: '#fff',
        padding: isMobile ? '48px 24px' : '80px 48px',
        borderTop: `1px solid ${tokens.border}`,
      }}>
        <div style={{ maxWidth: tokens.maxWidth, margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px',
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
          </div>

          {/* Blog grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '20px',
          }}>
            {blogPosts.map((post) => (
              <BlogCard key={post.title} {...post} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          9. CALENDLY SPLIT (CTA left, embed right)
          ============================================ */}
      <SplitSection
        id="calendly-section"
        leftBg="#fff"
        rightBg="#fafaf5"
        showDivider={false}
        showLabels={false}
        minHeight="600px"
        style={{ borderTop: `1px solid ${tokens.border}` }}
        leftContent={
          <div style={{ maxWidth: '400px' }}>
            <img
              src="/images/monstera-icon.png"
              alt="Monstera"
              style={{ width: '60px', height: '60px', marginBottom: '20px', opacity: 0.9 }}
            />
            <h2 style={{
              fontSize: '32px', fontWeight: 700, margin: '0 0 16px',
              fontFamily: "'Vollkorn', serif", lineHeight: 1.2,
            }}>
              Ready to see the difference?
            </h2>
            <p style={{
              fontSize: '15px', lineHeight: 1.7, color: tokens.textMuted,
              margin: '0 0 28px',
            }}>
              Book a free 30-minute consultation. We will walk through your current website, identify the gaps, and show you exactly what "with Organically" looks like for your business.
            </p>
            <Button href="https://calendly.com/organically/30min">
              Book a Free Call
            </Button>
          </div>
        }
        rightContent={
          <iframe
            src="https://calendly.com/organically/30min?embed_domain=organicallyseo.com&embed_type=Inline&hide_gdpr_banner=1&primary_color=7ec700&hide_event_type_details=1"
            width="100%"
            height="100%"
            frameBorder="0"
            loading="lazy"
            title="Schedule a call"
            style={{ border: 'none', minHeight: '550px', borderRadius: tokens.radiusSm }}
          />
        }
      />

      {/* ============================================
          10. FOOTER
          ============================================ */}
      <footer style={{
        background: '#1a1a1a',
        color: '#fff',
        padding: isMobile ? '48px 24px' : '64px 48px',
      }}>
        <div style={{
          maxWidth: tokens.maxWidth,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
          gap: '40px',
        }}>
          {/* Brand column */}
          <div>
            <a href="/" style={{
              fontSize: '28px', fontWeight: 700, fontFamily: "'Vollkorn', serif",
              color: '#fff', textDecoration: 'none',
            }}>
              Organically<span style={{ color: tokens.green }}>.</span>
            </a>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <a href="https://twitter.com/organicallyseo" style={{ opacity: 0.6, transition: tokens.transition }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.6'}>
                <img src="/images/X-black.png" alt="Twitter" style={{ width: '24px', filter: 'invert(1)' }} />
              </a>
              <a href="https://www.linkedin.com/in/ryan-scanlon31/" style={{ opacity: 0.6, transition: tokens.transition }}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.6'}>
                <img src="/images/LinkedIn-Black.png" alt="LinkedIn" style={{ width: '24px', filter: 'invert(1)' }} />
              </a>
            </div>
            <p style={{ fontSize: '12px', opacity: 0.4, marginTop: '24px' }}>
              Copyright 2025 Organically SEO. All rights reserved.
            </p>
          </div>

          {/* Agency links */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px', opacity: 0.5 }}>
              Agency
            </h4>
            {[
              { label: 'Web Design', href: '/web-design/' },
              { label: 'SEO', href: '/seo/' },
              { label: 'Branding', href: '/branding/' },
              { label: 'Blog', href: '/blog/' },
            ].map((link) => (
              <a key={link.label} href={link.href} style={{
                display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none', marginBottom: '10px', transition: tokens.transition,
              }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px', opacity: 0.5 }}>
              Contact
            </h4>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>
              ryan.organically@gmail.com
            </p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
              Pittsburgh, PA
            </p>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px', opacity: 0.5 }}>
              Legal
            </h4>
            <a href="/privacy-policy/" style={{
              display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)',
              textDecoration: 'none', transition: tokens.transition,
            }}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
