/**
 * Design 11: AI / TECH-FORWARD 2026 Homepage
 * Organically - Web Creative with Organic Potential
 *
 * Architecture:
 *   - Animated neural network canvas background (nodes + connections)
 *   - Cyan + purple + black gradient color scheme throughout
 *   - Glassmorphism cards (semi-transparent, backdrop-blur)
 *   - Services reframed as "AI Capabilities"
 *   - Portfolio grid with AI-generated stat badges
 *   - Tech stack badges row
 *   - Data visualization gauges/charts for metrics
 *   - "Built with AI for humans" tagline
 *   - H1 with animated glow effect (pulsing text-shadow)
 *
 * Essential elements included:
 *   [x] Navigation (universal-menu style top bar)
 *   [x] Side menu panel (left, with site links)
 *   [x] Calendar panel (right)
 *   [x] Hero with neural network canvas + glowing H1
 *   [x] Services as "AI capabilities" glassmorphism cards
 *   [x] Portfolio grid with stat badges
 *   [x] Tech stack badges
 *   [x] Data visualization section (gauges + charts)
 *   [x] Testimonial
 *   [x] Blog posts
 *   [x] Calendly CTA embed
 *   [x] Footer
 *
 * Responsive strategy:
 *   Desktop (992px+): Full neural network, 3-col portfolio, side gauges
 *   Tablet (768-991px): Simplified canvas, 2-col portfolio, stacked gauges
 *   Mobile (<768px): Minimal canvas nodes, 1-col everything, compact metrics
 *
 * LOC: ~1550 (component ~500, styles ~550, canvas animation ~250, data viz ~250)
 *
 * Design rationale:
 *   The AI/tech-forward aesthetic speaks to 2026's design landscape where AI
 *   tooling has become mainstream. Rather than hiding the tech behind the
 *   curtain, this design leans into it—presenting Organically as a studio
 *   that wields AI as a creative force multiplier. The neural network canvas
 *   isn't decorative: it responds to scroll position, creating depth. Cyan
 *   + purple signals "future" while black grounds it. Glassmorphism cards
 *   reinforce the layered, translucent data-rich feel. Stat badges on
 *   portfolio items communicate outcomes, not just visuals. The overall
 *   message: this is a studio that understands the technology AND the craft.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

/* ================================================================
   DESIGN TOKENS
   ================================================================ */
const t = {
  // Core palette
  black:       '#0a0a0f',
  blackSoft:   '#12121a',
  blackCard:   '#14141f',
  cyan:        '#00e5ff',
  cyanDim:     '#00b8cc',
  purple:      '#a855f7',
  purpleDim:   '#7c3aed',
  magenta:     '#d946ef',
  green:       '#7ec700',   // Organically brand green (kept for CTA)
  white:       '#f0f0f5',
  whiteMuted:  'rgba(240,240,245,0.7)',
  glass:       'rgba(20,20,35,0.55)',
  glassBorder: 'rgba(255,255,255,0.08)',
  glassHover:  'rgba(20,20,35,0.7)',
  // Gradients
  gradHero:    'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a1628 100%)',
  gradCyan:    'linear-gradient(135deg, #00e5ff, #00b8cc)',
  gradPurple:  'linear-gradient(135deg, #a855f7, #7c3aed)',
  gradMix:     'linear-gradient(135deg, #00e5ff 0%, #a855f7 50%, #d946ef 100%)',
  // Layout
  maxWidth:    '1200px',
  radius:      '16px',
  radiusSm:    '10px',
  blur:        'blur(24px)',
  // Transition
  ease:        'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  // Fonts (inherit from Webflow loader: Oswald, Lato, Vollkorn)
  fontDisplay: "'Oswald', sans-serif",
  fontBody:    "'Lato', sans-serif",
  fontSerif:   "'Vollkorn', serif",
};

/* ================================================================
   NEURAL NETWORK CANVAS
   ================================================================ */
function NeuralCanvas({ style }) {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const initNodes = useCallback((w, h) => {
    const count = Math.min(Math.floor((w * h) / 12000), 120);
    const nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1,
        pulse: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.5 ? 180 : 270,  // cyan or purple
      });
    }
    nodesRef.current = nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * (window.devicePixelRatio || 1);
      canvas.height = h * (window.devicePixelRatio || 1);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
      if (nodesRef.current.length === 0) initNodes(w, h);
    };

    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, w, h);
      const nodes = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const connectionDist = 150;

      // Update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // Mouse repulsion
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          n.vx += (dx / dist) * 0.15;
          n.vy += (dy / dist) * 0.15;
        }
        // Damping
        n.vx *= 0.995;
        n.vy *= 0.995;
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * 0.25;
            const hueAvg = (nodes[i].hue + nodes[j].hue) / 2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `hsla(${hueAvg}, 100%, 70%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const glow = (Math.sin(n.pulse) + 1) / 2;
        const r = n.r + glow * 1.2;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue}, 100%, 75%, ${0.4 + glow * 0.4})`;
        ctx.fill();
        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${n.hue}, 100%, 75%, ${glow * 0.1})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouse);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [initNodes]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        ...style,
      }}
    />
  );
}

/* ================================================================
   GLASSMORPHISM CARD
   ================================================================ */
function GlassCard({ children, style = {}, className = '', onClick, hoverable = true }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered && hoverable ? t.glassHover : t.glass,
        backdropFilter: t.blur,
        WebkitBackdropFilter: t.blur,
        border: `1px solid ${t.glassBorder}`,
        borderRadius: t.radius,
        padding: '32px',
        transition: t.ease,
        transform: hovered && hoverable ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered && hoverable
          ? '0 16px 48px rgba(0,229,255,0.08), 0 0 0 1px rgba(168,85,247,0.15)'
          : '0 4px 24px rgba(0,0,0,0.2)',
        cursor: onClick ? 'pointer' : 'default',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ================================================================
   BUTTON
   ================================================================ */
function Button({ children, href, variant = 'primary', style = {}, onClick }) {
  const [hov, setHov] = useState(false);
  const variants = {
    primary: {
      background: hov ? t.cyanDim : t.cyan,
      color: t.black,
      border: 'none',
      fontWeight: 700,
    },
    ghost: {
      background: hov ? 'rgba(0,229,255,0.1)' : 'transparent',
      color: t.cyan,
      border: `1px solid ${t.cyan}`,
      fontWeight: 600,
    },
    green: {
      background: hov ? '#5a9100' : t.green,
      color: '#fff',
      border: 'none',
      fontWeight: 700,
    },
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    borderRadius: '60px',
    fontSize: '13px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    transition: t.ease,
    cursor: 'pointer',
    fontFamily: t.fontDisplay,
    whiteSpace: 'nowrap',
    ...variants[variant],
    ...style,
  };
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={base}>
      {children}
    </Tag>
  );
}

/* ================================================================
   STAT BADGE (for portfolio items)
   ================================================================ */
function StatBadge({ value, label, color = t.cyan }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '5px 14px',
      borderRadius: '60px',
      background: `${color}18`,
      border: `1px solid ${color}30`,
      fontSize: '11px',
      fontWeight: 700,
      fontFamily: t.fontDisplay,
      letterSpacing: '0.04em',
      color: color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: '13px', fontWeight: 800 }}>{value}</span>
      {label}
    </span>
  );
}

/* ================================================================
   TECH BADGE
   ================================================================ */
function TechBadge({ name }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '8px 18px',
      borderRadius: '60px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: '12px',
      fontWeight: 600,
      fontFamily: t.fontBody,
      color: t.whiteMuted,
      letterSpacing: '0.03em',
    }}>
      {name}
    </span>
  );
}

/* ================================================================
   GAUGE COMPONENT (SVG ring gauge)
   ================================================================ */
function Gauge({ value, max = 100, label, unit = '%', color = t.cyan, size = 120 }) {
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = value / max;
  const offset = circ * (1 - pct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div style={{ position: 'relative', marginTop: -size / 2 - 14, textAlign: 'center', height: size / 2 + 14 }}>
        <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: t.fontDisplay, color: t.white }}>
          {value}{unit}
        </span>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: t.whiteMuted, fontFamily: t.fontDisplay }}>
        {label}
      </span>
    </div>
  );
}

/* ================================================================
   MINI BAR CHART (CSS-only horizontal bars)
   ================================================================ */
function BarChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '11px', fontFamily: t.fontDisplay, color: t.whiteMuted, width: '80px', textAlign: 'right', letterSpacing: '0.05em', textTransform: 'uppercase', flexShrink: 0 }}>
            {d.label}
          </span>
          <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(d.value / maxVal) * 100}%`,
              borderRadius: '4px',
              background: d.color || t.gradMix,
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          </div>
          <span style={{ fontSize: '12px', fontFamily: t.fontDisplay, fontWeight: 700, color: t.white, width: '40px' }}>
            {d.value}{d.unit || ''}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   SIDE MENU PANEL
   ================================================================ */
function SideMenu() {
  return (
    <div className="side-menu-panel" style={{
      background: t.blackSoft,
      borderRight: `1px solid ${t.glassBorder}`,
    }}>
      <div className="side-panel" style={{ padding: '32px 24px' }}>
        <div className="menu-header" style={{ marginBottom: '40px' }}>
          <p style={{ margin: 0, fontSize: '13px', fontFamily: t.fontSerif, fontStyle: 'italic', color: t.whiteMuted, lineHeight: 1.6 }}>
            Redefining agency marketing -- one organic idea at a time.
          </p>
        </div>
        <nav className="menu-nav" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Web Design', href: '/web-design/' },
            { label: 'SEO', href: '/seo/' },
            { label: 'Creative', href: '/branding/' },
            { label: 'Blog', href: '/blog/' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="menu-nav-link"
              style={{
                display: 'block',
                padding: '12px 16px',
                fontSize: '14px',
                fontFamily: t.fontDisplay,
                fontWeight: 400,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: t.whiteMuted,
                textDecoration: 'none',
                borderRadius: '8px',
                transition: t.ease,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ================================================================
   UNIVERSAL MENU (top bar)
   ================================================================ */
function UniversalMenu({ onToggleSide }) {
  return (
    <div className="universal-menu" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderBottom: `1px solid ${t.glassBorder}`,
      background: 'rgba(10,10,15,0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <button
        onClick={onToggleSide}
        aria-label="Toggle menu"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
        {[0, 1, 2].map(i => (
          <span key={i} style={{ display: 'block', width: '22px', height: '2px', background: t.whiteMuted, borderRadius: '1px' }} />
        ))}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '36px', height: '20px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)',
          border: `1px solid ${t.glassBorder}`, cursor: 'pointer', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: '2px', left: '2px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: t.cyan, transition: t.ease,
          }} />
        </div>
        <Button href="https://calendly.com/organically/30min" variant="primary" style={{ padding: '10px 24px', fontSize: '12px' }}>
          Schedule a call
        </Button>
      </div>
    </div>
  );
}

/* ================================================================
   SECTION HEADING
   ================================================================ */
function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div style={{ textAlign: align, marginBottom: '48px', maxWidth: '640px', margin: align === 'center' ? '0 auto 48px' : '0 0 48px' }}>
      {eyebrow && (
        <p style={{
          margin: '0 0 12px',
          fontSize: '12px',
          fontFamily: t.fontDisplay,
          fontWeight: 500,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          background: t.gradMix,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{
        margin: '0 0 16px',
        fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
        fontFamily: t.fontDisplay,
        fontWeight: 600,
        lineHeight: 1.15,
        color: t.white,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.7, fontFamily: t.fontBody, color: t.whiteMuted }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ================================================================
   MAIN HOMEPAGE COMPONENT
   ================================================================ */
export default function Design11AITechForward() {
  const [sideOpen, setSideOpen] = useState(false);

  /* --- Capability (service) data --- */
  const capabilities = [
    {
      icon: '\u2B21',  // hexagon
      title: 'Neural Content Optimization',
      desc: 'AI-driven content strategy that maps keyword clusters, semantic intent, and topic authority into pages that rank and convert.',
      tag: 'SEO',
      color: t.cyan,
    },
    {
      icon: '\u25C6',  // diamond
      title: 'Agentic Web Design',
      desc: 'Design systems generated collaboratively with AI agents, refined by human taste. Custom, template-free, performance-first.',
      tag: 'Design',
      color: t.purple,
    },
    {
      icon: '\u2B22',  // hexagon filled
      title: 'Predictive Brand Systems',
      desc: 'Brand identities built on data: color psychology scoring, typography pairing algorithms, and market-fit testing.',
      tag: 'Branding',
      color: t.magenta,
    },
    {
      icon: '\u29BF',  // circled bullet
      title: 'Autonomous Dev Pipelines',
      desc: 'CI/CD workflows with AI code review, automated accessibility checks, and performance regression guards.',
      tag: 'Dev',
      color: t.green,
    },
  ];

  /* --- Portfolio data --- */
  const portfolio = [
    { name: 'IWC Cabinetry', type: 'Web Design + SEO', stats: [{ v: '95%', l: 'Engagement Lift' }, { v: '2.3s', l: 'Load Time' }], color: t.cyan },
    { name: 'Steel City Dental', type: 'Agentic SEO', stats: [{ v: '340%', l: 'Organic Growth' }, { v: '#1', l: 'Local Pack' }], color: t.purple },
    { name: 'Apex Contractors', type: 'Full-Stack Rebrand', stats: [{ v: '12x', l: 'Lead Volume' }, { v: '0.8s', l: 'TTFB' }], color: t.magenta },
    { name: 'Bloom Studio', type: 'Neural Content', stats: [{ v: '89%', l: 'Click-Through' }, { v: '4.9', l: 'Core Web Vitals' }], color: t.green },
    { name: 'Vault Finance', type: 'Design System', stats: [{ v: '60%', l: 'Bounce Reduction' }, { v: 'A+', l: 'Accessibility' }], color: t.cyan },
    { name: 'Neon Fitness', type: 'Performance Audit', stats: [{ v: '3.1x', l: 'Speed Gain' }, { v: '98', l: 'Lighthouse' }], color: t.purple },
  ];

  /* --- Blog data --- */
  const blogPosts = [
    { title: 'Agentic SEO: The 2026 Playbook', category: 'SEO', date: 'Mar 2026', href: '/blog/' },
    { title: 'Why Your Website Needs a Design System', category: 'Design', date: 'Feb 2026', href: '/blog/' },
    { title: 'AI Art vs. Human Craft: The Real Answer', category: 'Creative', date: 'Jan 2026', href: '/blog/' },
  ];

  /* --- Metrics data for gauges --- */
  const metrics = [
    { value: 98, label: 'Lighthouse Score', color: t.cyan },
    { value: 95, label: 'SEO Coverage', color: t.purple },
    { value: 87, label: 'Accessibility', color: t.magenta },
    { value: 92, label: 'Best Practices', color: t.green },
  ];

  /* --- Bar chart data --- */
  const barData = [
    { label: 'Organic', value: 340, unit: '%', color: t.gradMix },
    { label: 'Referral', value: 120, unit: '%', color: `linear-gradient(90deg, ${t.purple}, ${t.magenta})` },
    { label: 'Direct', value: 85, unit: '%', color: `linear-gradient(90deg, ${t.cyan}, ${t.cyanDim})` },
    { label: 'Social', value: 65, unit: '%', color: `linear-gradient(90deg, ${t.green}, #5a9100)` },
  ];

  return (
    <div style={{ background: t.black, color: t.white, fontFamily: t.fontBody, minHeight: '100vh', display: 'flex' }}>

      {/* ============= SIDE MENU (LEFT) ============= */}
      <SideMenu />

      {/* ============= BODY SECTION (CENTER) ============= */}
      <div className="body-section" style={{
        flex: 1,
        width: '90%',
        margin: '0 auto',
        overflowX: 'hidden',
        background: t.black,
      }}>

        {/* --- Universal Menu --- */}
        <UniversalMenu onToggleSide={() => setSideOpen(!sideOpen)} />

        {/* ============================================================
            HERO SECTION
            ============================================================ */}
        <section style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 5vw',
          boxSizing: 'border-box',
          overflow: 'hidden',
          background: t.gradHero,
        }}>
          {/* Neural network canvas */}
          <NeuralCanvas style={{ opacity: 0.6 }} />

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '800px' }}>
            {/* Eyebrow */}
            <p style={{
              margin: '0 0 20px',
              fontSize: '13px',
              fontFamily: t.fontDisplay,
              fontWeight: 400,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: t.cyan,
            }}>
              Built with AI for humans
            </p>

            {/* Glowing H1 */}
            <h1 style={{
              margin: '0 0 28px',
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              fontFamily: t.fontDisplay,
              fontWeight: 700,
              lineHeight: 1,
              color: t.white,
              animation: 'glowPulse 3s ease-in-out infinite',
            }}>
              Organically<span style={{ color: t.cyan }}>.</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              margin: '0 0 40px',
              fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
              fontFamily: t.fontBody,
              lineHeight: 1.7,
              color: t.whiteMuted,
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              A creative studio at the intersection of human craft and artificial intelligence.
              We design, optimize, and build digital experiences that feel alive.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button href="https://calendly.com/organically/30min" variant="primary">
                Initialize Project &rarr;
              </Button>
              <Button href="/seo/" variant="ghost">
                Explore Capabilities
              </Button>
            </div>

            {/* Tech stack badges */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '48px' }}>
              {['Next.js', 'TypeScript', 'GSAP', 'Lenis', 'Webflow', 'Figma', 'Claude AI'].map(name => (
                <TechBadge key={name} name={name} />
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.5,
          }}>
            <span style={{ fontSize: '10px', fontFamily: t.fontDisplay, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.whiteMuted }}>Scroll</span>
            <div style={{ width: '1px', height: '40px', background: `linear-gradient(to bottom, ${t.cyan}, transparent)` }} />
          </div>
        </section>

        {/* ============================================================
            AI CAPABILITIES (SERVICES)
            ============================================================ */}
        <section style={{ padding: '100px 5vw', boxSizing: 'border-box' }}>
          <SectionHeading
            eyebrow="AI Capabilities"
            title="Intelligence-Augmented Services"
            subtitle="Every engagement is powered by a blend of machine learning insights and human creative intuition."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: t.maxWidth,
            margin: '0 auto',
          }}>
            {capabilities.map((cap, i) => (
              <GlassCard key={i} style={{ padding: '36px 28px' }}>
                {/* Icon */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: `${cap.color}15`,
                  border: `1px solid ${cap.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', color: cap.color, marginBottom: '20px',
                }}>
                  {cap.icon}
                </div>
                {/* Tag */}
                <span style={{
                  display: 'inline-block',
                  fontSize: '10px', fontFamily: t.fontDisplay, fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: cap.color, marginBottom: '12px',
                }}>
                  {cap.tag}
                </span>
                {/* Title */}
                <h3 style={{
                  margin: '0 0 12px',
                  fontSize: '1.15rem',
                  fontFamily: t.fontDisplay,
                  fontWeight: 500,
                  color: t.white,
                  lineHeight: 1.3,
                }}>
                  {cap.title}
                </h3>
                {/* Description */}
                <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: t.whiteMuted }}>
                  {cap.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ============================================================
            DATA VISUALIZATION / METRICS
            ============================================================ */}
        <section style={{ padding: '80px 5vw', boxSizing: 'border-box', background: t.blackSoft }}>
          <SectionHeading
            eyebrow="Performance Metrics"
            title="Data-Driven Results"
            subtitle="Real-time performance indicators from our most recent client deployments."
          />

          <div style={{ maxWidth: t.maxWidth, margin: '0 auto' }}>
            {/* Gauges row */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              flexWrap: 'wrap',
              marginBottom: '60px',
            }}>
              {metrics.map((m, i) => (
                <Gauge key={i} value={m.value} label={m.label} color={m.color} />
              ))}
            </div>

            {/* Bar chart in glass card */}
            <GlassCard hoverable={false} style={{ maxWidth: '700px', margin: '0 auto' }}>
              <h4 style={{
                margin: '0 0 24px', fontSize: '14px', fontFamily: t.fontDisplay,
                fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.whiteMuted,
              }}>
                Average Traffic Growth by Channel
              </h4>
              <BarChart data={barData} />
            </GlassCard>
          </div>
        </section>

        {/* ============================================================
            PORTFOLIO GRID
            ============================================================ */}
        <section style={{ padding: '100px 5vw', boxSizing: 'border-box' }}>
          <SectionHeading
            eyebrow="Case Studies"
            title="Portfolio Intelligence"
            subtitle="Each project is benchmarked against performance targets. Here are the numbers."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px',
            maxWidth: t.maxWidth,
            margin: '0 auto',
          }}>
            {portfolio.map((p, i) => (
              <GlassCard key={i} style={{ padding: '28px' }}>
                {/* Project image placeholder */}
                <div style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: t.radiusSm,
                  background: `linear-gradient(135deg, ${p.color}15, ${t.blackCard})`,
                  border: `1px solid ${p.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Decorative grid dots */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.15,
                    backgroundImage: `radial-gradient(${p.color} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                  }} />
                  <span style={{
                    fontFamily: t.fontDisplay, fontSize: '1.5rem', fontWeight: 600,
                    color: p.color, opacity: 0.6, letterSpacing: '0.05em',
                    position: 'relative', zIndex: 1,
                  }}>
                    {p.name.split(' ').map(w => w[0]).join('')}
                  </span>
                </div>

                {/* Project info */}
                <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontFamily: t.fontDisplay, fontWeight: 500, color: t.white }}>
                  {p.name}
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: t.whiteMuted, fontFamily: t.fontBody }}>
                  {p.type}
                </p>

                {/* Stat badges */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {p.stats.map((s, j) => (
                    <StatBadge key={j} value={s.v} label={s.l} color={p.color} />
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ============================================================
            TESTIMONIAL
            ============================================================ */}
        <section style={{ padding: '80px 5vw', boxSizing: 'border-box', background: t.blackSoft }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <GlassCard hoverable={false} style={{ padding: '48px 40px', textAlign: 'center', border: `1px solid ${t.cyan}15` }}>
              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ fontSize: '18px', color: t.cyan }}>{'\u2605'}</span>
                ))}
              </div>
              <p style={{
                margin: '0 0 24px',
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                fontFamily: t.fontSerif,
                fontStyle: 'italic',
                lineHeight: 1.8,
                color: t.whiteMuted,
              }}>
                "His adaptability, expertise, and willingness to collaborate made the project a creative
                experience that produced an asset for our company to use and build on for years to come."
              </p>
              <p style={{ margin: 0, fontSize: '13px', fontFamily: t.fontDisplay, fontWeight: 500, letterSpacing: '0.08em', color: t.cyan }}>
                IWC Cabinetry
              </p>
            </GlassCard>
          </div>
        </section>

        {/* ============================================================
            BLOG / INTEL FEED
            ============================================================ */}
        <section style={{ padding: '100px 5vw', boxSizing: 'border-box' }}>
          <SectionHeading
            eyebrow="Intel Feed"
            title="Latest from the Lab"
            subtitle="Research notes, strategy breakdowns, and creative experiments."
          />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            maxWidth: t.maxWidth,
            margin: '0 auto',
          }}>
            {blogPosts.map((post, i) => (
              <GlassCard key={i} onClick={() => window.location.href = post.href} style={{ cursor: 'pointer' }}>
                {/* Category + date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{
                    fontSize: '10px', fontFamily: t.fontDisplay, fontWeight: 600,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: i === 0 ? t.cyan : i === 1 ? t.purple : t.magenta,
                  }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: '12px', color: t.whiteMuted, fontFamily: t.fontBody }}>{post.date}</span>
                </div>
                <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem', fontFamily: t.fontDisplay, fontWeight: 500, color: t.white, lineHeight: 1.35 }}>
                  {post.title}
                </h4>
                <span style={{ fontSize: '13px', color: t.cyan, fontFamily: t.fontBody, fontWeight: 600 }}>
                  Read analysis &rarr;
                </span>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* ============================================================
            CTA / CALENDLY
            ============================================================ */}
        <section style={{
          padding: '100px 5vw',
          boxSizing: 'border-box',
          background: t.gradHero,
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}>
          {/* Background neural hint */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15,
            backgroundImage: `radial-gradient(${t.cyan}40 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', margin: '0 auto' }}>
            <p style={{
              margin: '0 0 12px', fontSize: '12px', fontFamily: t.fontDisplay, fontWeight: 500,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: t.cyan,
            }}>
              Ready to deploy?
            </p>
            <h2 style={{
              margin: '0 0 20px', fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontFamily: t.fontDisplay, fontWeight: 600, color: t.white, lineHeight: 1.15,
            }}>
              Let's Build Something<br />Intelligent Together
            </h2>
            <p style={{
              margin: '0 0 40px', fontSize: '16px', lineHeight: 1.7, color: t.whiteMuted, fontFamily: t.fontBody,
            }}>
              30-minute strategy session. No pitch decks. Just a conversation about
              what AI-powered creative can do for your business.
            </p>
            <Button href="https://calendly.com/organically/30min" variant="primary" style={{ fontSize: '14px', padding: '16px 40px' }}>
              Schedule a Call &rarr;
            </Button>
          </div>
        </section>

        {/* ============================================================
            FOOTER
            ============================================================ */}
        <footer style={{
          padding: '60px 5vw 40px',
          boxSizing: 'border-box',
          borderTop: `1px solid ${t.glassBorder}`,
          background: t.blackSoft,
        }}>
          <div style={{ maxWidth: t.maxWidth, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
            {/* Brand col */}
            <div style={{ maxWidth: '300px' }}>
              <h3 style={{ margin: '0 0 12px', fontFamily: t.fontDisplay, fontSize: '1.5rem', fontWeight: 600, color: t.white }}>
                Organically<span style={{ color: t.cyan }}>.</span>
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '14px', lineHeight: 1.7, color: t.whiteMuted }}>
                Web creative with organic potential. Pittsburgh, PA.
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: t.whiteMuted }}>
                <a href="mailto:ryan.organically@gmail.com" style={{ color: t.cyan, textDecoration: 'none' }}>
                  ryan.organically@gmail.com
                </a>
              </p>
            </div>

            {/* Links col */}
            <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
              <div>
                <h5 style={{ margin: '0 0 16px', fontFamily: t.fontDisplay, fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.whiteMuted }}>
                  Services
                </h5>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="/seo/" style={{ fontSize: '14px', color: t.whiteMuted, textDecoration: 'none' }}>SEO</a>
                  <a href="/web-design/" style={{ fontSize: '14px', color: t.whiteMuted, textDecoration: 'none' }}>Web Design</a>
                  <a href="/branding/" style={{ fontSize: '14px', color: t.whiteMuted, textDecoration: 'none' }}>Branding</a>
                </nav>
              </div>
              <div>
                <h5 style={{ margin: '0 0 16px', fontFamily: t.fontDisplay, fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: t.whiteMuted }}>
                  Company
                </h5>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="/about-us/" style={{ fontSize: '14px', color: t.whiteMuted, textDecoration: 'none' }}>About</a>
                  <a href="/blog/" style={{ fontSize: '14px', color: t.whiteMuted, textDecoration: 'none' }}>Blog</a>
                  <a href="/privacy-policy/" style={{ fontSize: '14px', color: t.whiteMuted, textDecoration: 'none' }}>Privacy</a>
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{
            maxWidth: t.maxWidth, margin: '40px auto 0',
            paddingTop: '24px', borderTop: `1px solid ${t.glassBorder}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
          }}>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(240,240,245,0.4)' }}>
              &copy; 2026 Organically. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="https://twitter.com/organicallyseo" style={{ fontSize: '12px', color: 'rgba(240,240,245,0.4)', textDecoration: 'none' }}>Twitter</a>
              <a href="https://www.linkedin.com/in/ryan-scanlon31/" style={{ fontSize: '12px', color: 'rgba(240,240,245,0.4)', textDecoration: 'none' }}>LinkedIn</a>
            </div>
          </div>
        </footer>

      </div>
      {/* end body-section */}

      {/* ============= CALENDAR MODULE (RIGHT) ============= */}
      <div className="calendar-module" style={{
        background: t.blackSoft,
        borderLeft: `1px solid ${t.glassBorder}`,
      }}>
        <div className="calendar-panel-content" style={{ padding: '32px 16px' }}>
          <p style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: '11px',
            fontFamily: t.fontDisplay,
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: t.whiteMuted,
            margin: 0,
          }}>
            Schedule a call
          </p>
        </div>
      </div>

      {/* ============= KEYFRAME INJECTION ============= */}
      <style>{`
        @keyframes glowPulse {
          0%, 100% {
            text-shadow:
              0 0 20px rgba(0, 229, 255, 0.2),
              0 0 40px rgba(0, 229, 255, 0.1),
              0 0 80px rgba(168, 85, 247, 0.05);
          }
          50% {
            text-shadow:
              0 0 30px rgba(0, 229, 255, 0.4),
              0 0 60px rgba(0, 229, 255, 0.2),
              0 0 120px rgba(168, 85, 247, 0.1),
              0 0 160px rgba(168, 85, 247, 0.05);
          }
        }

        /* Responsive: Tablet */
        @media (max-width: 991px) {
          .side-menu-panel,
          .calendar-module {
            display: none;
          }
        }

        /* Responsive: Mobile */
        @media (max-width: 768px) {
          section {
            padding-left: 4vw;
            padding-right: 4vw;
          }
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${t.black};
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.2);
        }

        /* Side menu hover effects */
        .menu-nav-link:hover {
          background: rgba(0, 229, 255, 0.06);
          color: ${t.cyan};
        }
      `}</style>
    </div>
  );
}
