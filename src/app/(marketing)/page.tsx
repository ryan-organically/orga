"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/dist/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger, Draggable, InertiaPlugin);
}

export default function HomePage() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const shrunkPRef = useRef<HTMLParagraphElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const floatingTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // H1 Animation
      const h1 = h1Ref.current;
      const shrunkP = shrunkPRef.current;
      const building = buildingRef.current;
      const heroVideo = videoRef.current;

      if (shrunkP) gsap.set(shrunkP, { autoAlpha: 0 });
      if (building) gsap.set(building, { autoAlpha: 0 });

      if (h1) {
        const split = new SplitText(h1, {
          type: "words, chars",
          wordsClass: "word-wrapper",
          charsClass: "char-inner",
        });

        split.chars.forEach((char) => {
          const wrapper = document.createElement("div");
          wrapper.style.display = "inline-block";
          wrapper.style.overflow = "hidden";
          wrapper.style.verticalAlign = "bottom";
          wrapper.style.paddingBottom = "0.15em";
          (char as HTMLElement).style.display = "inline-block";
          char.parentNode?.insertBefore(wrapper, char);
          wrapper.appendChild(char);
        });

        const innerChars = h1.querySelectorAll(".char-inner");
        gsap.set(h1, { opacity: 1 });
        gsap.set(innerChars, { y: 150, opacity: 0, willChange: "transform, opacity" });

        gsap.to(innerChars, {
          y: 0,
          opacity: 1,
          duration: 0.1,
          ease: "expo.out",
          stagger: 0.02,
          onComplete: () => {
            // Animate shrunk-p
            if (shrunkP) {
              gsap.set(shrunkP, { autoAlpha: 1 });
              const shrunkPSplit = new SplitText(shrunkP, { type: "lines", linesClass: "shrunk-p-line" });
              gsap.set(shrunkPSplit.lines, { yPercent: 110, opacity: 0 });
              gsap.to(shrunkPSplit.lines, {
                yPercent: 0,
                opacity: 1,
                duration: 0.7,
                stagger: 0.1,
                ease: "power3.out",
                onComplete: () => {
                  // Animate building
                  if (building) {
                    const tl = gsap.timeline();
                    tl.fromTo(building, { yPercent: 100 }, { yPercent: 70, autoAlpha: 0.6, duration: 0.6, ease: "power2.out" })
                      .to(building, { yPercent: 5, autoAlpha: 0.8, duration: 0.7, ease: "power3.out" });

                    const floatingText = floatingTextRef.current;
                    if (floatingText) {
                      tl.fromTo(
                        floatingText,
                        { opacity: 0, x: 200, y: -50, scale: 0.7, rotation: 15 },
                        {
                          opacity: 1, x: 0, y: 0, scale: 1, rotation: 0,
                          duration: 1.5, ease: "back.out(1.7)",
                          onComplete: () => {
                            gsap.to(floatingText, { x: -30, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1 });
                          },
                        },
                        "-=0.5"
                      );
                    }
                  }
                },
              });
            }
          },
        });
      }

      // Video bounce-in
      if (heroVideo) {
        gsap.set(heroVideo, { scale: 0, opacity: 0, rotationZ: -10 });
        gsap.to(heroVideo, { scale: 1, opacity: 1, rotationZ: 0, duration: 1.2, ease: "back.out(1.7)", delay: 0.8 });
      }

      // Feature ticker animations
      const leftTrack = document.querySelector(".feature-ticker-left .feature-ticker-track");
      const rightTrack = document.querySelector(".feature-ticker-right .feature-ticker-track");

      if (leftTrack) {
        const width = (leftTrack as HTMLElement).scrollWidth / 2;
        gsap.to(leftTrack, { x: -width, duration: 20, ease: "none", repeat: -1 });
      }
      if (rightTrack) {
        const width = (rightTrack as HTMLElement).scrollWidth / 2;
        gsap.set(rightTrack, { x: -width });
        gsap.to(rightTrack, { x: 0, duration: 25, ease: "none", repeat: -1 });
      }

      // Ticking text animation
      const ticker = document.querySelector(".ticking-text");
      if (ticker) {
        const tickerWidth = (ticker as HTMLElement).scrollWidth / 3;
        gsap.to(ticker, {
          x: -tickerWidth,
          duration: 30,
          ease: "none",
          repeat: -1,
          modifiers: { x: (x) => `${parseFloat(x) % tickerWidth}px` },
        });
      }

      // Blog carousel
      const cardsTrack = document.querySelector(".blog-cards-track") as HTMLElement;
      if (cardsTrack && typeof Draggable !== "undefined") {
        const cards = cardsTrack.querySelectorAll(".blog-card-1");
        const cardWidth = 300 + 20; // width + margin
        const maxScroll = (cards.length - 1) * cardWidth;

        Draggable.create(cardsTrack, {
          type: "x",
          bounds: { minX: -maxScroll, maxX: 0 },
          inertia: true,
          edgeResistance: 0.85,
          snap: {
            x: (endValue) => {
              const snapPoints = Array.from(cards).map((_, i) => -i * cardWidth);
              let closest = snapPoints[0];
              let minDistance = Math.abs(endValue - closest);
              snapPoints.forEach((point) => {
                const distance = Math.abs(endValue - point);
                if (distance < minDistance) {
                  minDistance = distance;
                  closest = point;
                }
              });
              return closest;
            },
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Services showcase state
  useEffect(() => {
    const cards = document.querySelectorAll(".services-showcase-card");
    const descriptions = document.querySelectorAll(".services-showcase-description");
    let currentIndex = 0;
    let isHovered = false;

    function setActive(index: number) {
      cards.forEach((card) => card.classList.remove("active"));
      descriptions.forEach((desc) => desc.classList.remove("active"));
      cards[index]?.classList.add("active");
      descriptions[index]?.classList.add("active");
      currentIndex = index;
    }

    const interval = setInterval(() => {
      if (!isHovered) {
        currentIndex = (currentIndex + 1) % cards.length;
        setActive(currentIndex);
      }
    }, 10000);

    cards.forEach((card, index) => {
      card.addEventListener("click", () => setActive(index));
      card.addEventListener("mouseenter", () => (isHovered = true));
      card.addEventListener("mouseleave", () => (isHovered = false));
    });

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div id="home-hero-section" className="hero-section home-hero" style={{ paddingBottom: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
        <p ref={floatingTextRef} className="p2 hero-floating-text">Websites for all!</p>
        <div className="hero-div" style={{ width: "100%", maxWidth: "100%" }}>
          <h1 ref={h1Ref} className="h1 h1-home" style={{ opacity: 0 }}>
            Organically<span className="green-span h1-period">.</span>
          </h1>
          <p ref={shrunkPRef} className="shrunk-p">
            Welcome to Organically: a vast space where stray ideas can wander, take root, and quietly grow bold. Combining web creative with organic potential.
          </p>

          {/* Feature Tickers */}
          <div className="feature-ticker-container">
            <div className="feature-ticker feature-ticker-left">
              <div className="feature-ticker-track">
                {["White Label Agency", "SEO + Design Unified", "Custom Development", "Zero Templates", "AI-Optimized Content", "Startup Branding"].map((item, i) => (
                  <span key={i} className="feature-item">{item}</span>
                ))}
                {["White Label Agency", "SEO + Design Unified", "Custom Development", "Zero Templates", "AI-Optimized Content", "Startup Branding"].map((item, i) => (
                  <span key={`dup-${i}`} className="feature-item">{item}</span>
                ))}
              </div>
            </div>
            <div className="feature-ticker feature-ticker-right">
              <div className="feature-ticker-track">
                {["Branding Strategy", "Technical SEO", "Performance First", "Conversion Focused", "Data-Driven Design", "Pittsburgh Based", "Frontend for Startups"].map((item, i) => (
                  <span key={i} className="feature-item">{item}</span>
                ))}
                {["Branding Strategy", "Technical SEO", "Performance First", "Conversion Focused", "Data-Driven Design", "Pittsburgh Based", "Frontend for Startups"].map((item, i) => (
                  <span key={`dup-${i}`} className="feature-item">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="hero-social-proof" style={{ width: 300, maxWidth: 300 }}>
          <div className="hero-social-proof-stars">
            <Image src="/images/green 5 star.png" alt="5 stars" width={125} height={25} />
          </div>
          <p className="social-proof-title" style={{ fontStyle: "italic", fontSize: 11 }}>IWC Cabinetry</p>
          <p className="p2" style={{ fontStyle: "italic", fontSize: 11, lineHeight: 1.5 }}>
            &quot;His adaptability, expertise, and willingness to collaborate made the project a creative experience that produced an asset for our company to use and build on for years to come.&quot;
          </p>
        </div>

        {/* Hero Video */}
        <div ref={videoRef} className="home-hero-vid w-background-video w-background-video-atom">
          <video autoPlay loop muted playsInline style={{ objectFit: "cover", width: "100%", height: "100%" }}>
            <source src="/videos/theme video compressed.webm" type="video/webm" />
          </video>
        </div>

        <div className="ticker">
          <p className="ticker-p">Welcome to Organically: a vast space where stray ideas can wander, take root, and quietly grow bold.</p>
        </div>

        {/* Steel Building */}
        <Image
          ref={buildingRef as React.RefObject<HTMLImageElement>}
          src="/images/Steel-Building.png"
          alt="Pittsburgh Steel Building"
          width={2048}
          height={1000}
          className="hero-steel-building"
          style={{ display: "block" }}
          priority
        />
      </div>

      {/* Services Showcase */}
      <div className="services-showcase">
        <div className="services-showcase-left">
          <Image src="/images/monstera-icon.png" alt="Monstera icon" width={100} height={100} style={{ marginLeft: -20 }} />
          <h2>Full-Service Digital Marketing That Grows Your Business</h2>
          <p>From custom web design and SEO to branding and development—we deliver comprehensive marketing solutions that drive real results. Let&apos;s build something that converts.</p>
          <button className="button-1 hero-cta-button calendar-toggle-btn">Get Your Free Website Review</button>
        </div>
        <div className="services-showcase-right">
          <div className="services-showcase-tabs">
            <div className="services-showcase-card active" data-service="branding" data-color="var(--orga)">
              <span className="services-showcase-label">Branding</span>
            </div>
            <div className="services-showcase-card" data-service="digital-pr" data-color="var(--red-1)">
              <span className="services-showcase-label">Digital PR</span>
            </div>
            <div className="services-showcase-card" data-service="front-end" data-color="var(--blue-2)">
              <span className="services-showcase-label">Front End Dev</span>
            </div>
            <div className="services-showcase-card" data-service="web-design" data-color="var(--steeler)">
              <span className="services-showcase-label">Web Design</span>
            </div>
          </div>
          <div className="services-showcase-content">
            <div className="services-showcase-description active" data-service="branding">
              <p className="small-feature-title">Branding</p>
              <p className="p2">Crafting distinctive visual identities that resonate with your audience and elevate your brand presence.</p>
            </div>
            <div className="services-showcase-description" data-service="digital-pr">
              <p className="small-feature-title">Digital PR</p>
              <p className="p2">Strategic storytelling and media outreach that amplifies your message across digital channels.</p>
            </div>
            <div className="services-showcase-description" data-service="front-end">
              <p className="small-feature-title">Front End Development</p>
              <p className="p2">Building responsive, performant interfaces with modern web technologies and best practices.</p>
            </div>
            <div className="services-showcase-description" data-service="web-design">
              <p className="small-feature-title">Web Design</p>
              <p className="p2">Designing intuitive, beautiful web experiences that convert visitors into customers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Testimonial */}
      <section className="section ticker-testimonial-section">
        <div className="ticking-text">
          Proven to move the needle Organically<span className="green-span">. </span>
          Proven to move the needle Organically<span className="green-span">. </span>
          Proven to move the needle Organically<span className="green-span">. </span>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section blog-section">
        <div className="blog-preview">
          <Link href="/blog" className="blog-thumbs-blog-home w-inline-block" style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Image src="/images/coffee-asset.png" alt="Coffee icon" width={50} height={50} style={{ marginBottom: 8, opacity: 0.9 }} />
              <h5 className="read-more-heading" style={{ width: "auto", marginTop: -10, marginBottom: -10, whiteSpace: "nowrap" }}>Coffee Break</h5>
            </div>
          </Link>
          <div className="blog-nav-buttons" style={{ marginTop: 20, width: "100%" }}>
            <button className="blog-nav-btn" id="blog-prev">←</button>
            <button className="blog-nav-btn" id="blog-next">→</button>
          </div>
          <div className="read-more-module">
            <div className="blog-cards-wrapper">
              <div className="blog-cards-track">
                <BlogCard href="/what-is-seo" category="Marketing" title="What is SEO?" date="Updated April 17, 2024" excerpt="Ranking on search engines isn't luck. The average person makes 3-4 searches on Google per day. Learn how to answer them." />
                <BlogCard href="/webflow-launch-checklist" category="Design" categoryClass="design" title="Webflow Launch Checklist" date="September 5, 2024" excerpt="Launching a website on Webflow can be terrifying, especially if it's your first time. Many things can go wrong." />
                <BlogCard href="/branding-basics" category="Branding" categoryClass="branding" title="Basics of Branding: How to Build Your Own Brand" date="June 6, 2024" excerpt="Deciding on an original name, colors, logo, and website that speak to you are big commitments." />
                <BlogCard href="/webflow-vs-figma" category="Design" categoryClass="design" title="Webflow vs. Figma" date="July 12, 2023" excerpt="In today's shifting tides of creative design and development programs, selecting the right tools can significantly impact your creative journey." />
                <BlogCard href="/ai-art" category="Creative" categoryClass="creative" title="What is AI Art? And Will It Replace Artists?" date="July 12, 2023" excerpt="AI's threat to jobs and humanity as a whole jeopardizes life as we know it. Exploring the intersection of technology and creativity." />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}

function BlogCard({ href, category, categoryClass = "", title, date, excerpt }: { href: string; category: string; categoryClass?: string; title: string; date: string; excerpt: string }) {
  return (
    <Link href={href} className="blog-card-1 w-inline-block">
      <div className="blog-card-content">
        <div className="filter">
          <div className={`filter-text ${categoryClass}`}>{category}</div>
        </div>
        <p className="blog-module-card-title">{title}</p>
        <p className="blog-component-date">{date}</p>
        <div className="bog-comp-p">{excerpt}</div>
      </div>
    </Link>
  );
}

function Footer() {
  return (
    <div id="Footer" className="footer">
      <div className="footer-typemark-div">
        <Link href="/" className="link-block w-inline-block">
          <div className="footer-typemark">Organically</div>
        </Link>
        <div className="footer-social-wrapper">
          <a href="https://twitter.com/organicallyseo" className="footer-social-link w-inline-block">
            <Image src="/images/X-black.png" width={28} height={28} alt="X" className="footer-social-image light" />
          </a>
          <a href="https://www.linkedin.com/in/ryan-scanlon31/" className="footer-social-link w-inline-block">
            <Image src="/images/LinkedIn-Black.png" width={28} height={28} alt="LinkedIn" className="footer-social-image light" />
          </a>
        </div>
        <div className="copyright-bar">Copyright 2025 Organically SEO. All rights reserved.</div>
      </div>
      <div className="footer-wrapper-1">
        <div className="footer-div">
          <div className="footer-subheading">Agency</div>
          <Link href="/seo" className="footer-text">Website</Link>
          <Link href="/seo-audit-services" className="footer-text">Audit</Link>
          <Link href="/blog" className="footer-text">Blog</Link>
        </div>
        <div className="footer-div">
          <div className="footer-subheading">Contact</div>
          <div className="footer-text">Form</div>
          <div className="footer-text">ryan.organically@gmail.com</div>
        </div>
        <div className="footer-div">
          <div className="footer-subheading">Boring</div>
          <Link href="/privacy-policy" className="footer-text">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
