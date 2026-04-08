"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/dist/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Footer } from "@/components/layout/Footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger, Draggable, InertiaPlugin);

  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 40,
  });
}

export default function HomePage() {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const shrunkPRef = useRef<HTMLParagraphElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const floatingTextRef = useRef<HTMLParagraphElement>(null);
  const heroCTARef = useRef<HTMLAnchorElement>(null);

  // ============================================
  // Hero animation chain
  // ============================================
  useEffect(() => {
    const h1 = h1Ref.current;
    const shrunkP = shrunkPRef.current;
    const building = buildingRef.current;
    const heroVideo = videoRef.current;

    if (!h1) return;

    // If SplitText not available, just show everything
    if (typeof SplitText === "undefined") {
      h1.style.opacity = "1";
      return;
    }

    // Store original H1 HTML so we can restore on cleanup (React strict mode)
    const originalH1HTML = h1.innerHTML;
    const originalShrunkPHTML = shrunkP?.innerHTML || "";

    let ctx: gsap.Context | null = null;
    let fallback: ReturnType<typeof setTimeout>;

    function startAnimations() {
    // Use GSAP context for proper cleanup
    ctx = gsap.context(() => {
      const socialProofChecks = document.querySelectorAll(
        ".hero-social-proof-checks > div"
      );
      const selfieWrapper = document.querySelector(".hero-selfie-wrapper");

      // Hide elements initially
      gsap.set(h1, { opacity: 0 });
      if (shrunkP) gsap.set(shrunkP, { autoAlpha: 0 });
      if (building) gsap.set(building, { autoAlpha: 0 });
      if (socialProofChecks.length) {
        gsap.set(socialProofChecks, {
          autoAlpha: 0,
          x: -100,
          rotation: -15,
          scale: 0.5,
        });
      }
      if (selfieWrapper) {
        gsap.set(selfieWrapper, { autoAlpha: 0, x: 100 });
      }

      // Split H1
      const split = SplitText.create(h1, {
        type: "words, chars",
        wordsClass: "word-wrapper",
        charsClass: "char-inner",
      });

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
      gsap.set(innerChars, {
        y: 150,
        opacity: 0,
        willChange: "transform, opacity",
      });

      gsap.to(innerChars, {
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
        if (selfieWrapper) {
          gsap.to(selfieWrapper, {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            onComplete: () => {
              const typer = document.querySelector(
                ".selfie-typer"
              ) as HTMLElement;
              if (!typer) return;
              const text =
                "Hello! You're finally awake. Welcome to Organically. I'm Ryan.";
              let i = 0;
              function type() {
                if (i < text.length) {
                  typer.textContent = text.slice(0, i + 1);
                  i++;
                  setTimeout(type, 50);
                }
              }
              type();
            },
          });
        }

        if (socialProofChecks.length) {
          gsap.to(socialProofChecks, {
            autoAlpha: 1,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "elastic.out(1, 0.5)",
            onComplete: animateBuilding,
          });
        } else {
          animateBuilding();
        }
      }

      function animateBuilding() {
        const floatingText = floatingTextRef.current;

        if (building) {
          const tl = gsap.timeline();
          tl.fromTo(
            building,
            { yPercent: 100 },
            {
              yPercent: 70,
              autoAlpha: 0.6,
              duration: 0.6,
              ease: "power2.out",
            }
          ).to(building, {
            yPercent: 5,
            autoAlpha: 0.8,
            duration: 0.7,
            ease: "power3.out",
          });

          if (floatingText) {
            tl.fromTo(
              floatingText,
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
                  gsap.to(floatingText, {
                    x: -30,
                    duration: 4,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: -1,
                  });
                },
              }
            );
          }
        }
      }

      // Video bounce-in
      if (heroVideo) {
        gsap.set(heroVideo, { scale: 0, opacity: 0, rotationZ: -10 });
        gsap.to(heroVideo, {
          scale: 1,
          opacity: 1,
          rotationZ: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          delay: 0.8,
        });
      }
    });

    } // end startAnimations

    // Wait for fonts then run
    document.fonts.ready.then(() => startAnimations());

    // Fallback: if h1 still hidden after 3s, force show
    fallback = setTimeout(() => {
      if (h1.style.opacity === "0" || getComputedStyle(h1).opacity === "0") {
        h1.style.opacity = "1";
      }
      if (building && gsap.getProperty(building, "autoAlpha") === 0) {
        gsap.to(building, {
          autoAlpha: 0.8,
          yPercent: 5,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }, 3000);

    return () => {
      clearTimeout(fallback);
      if (ctx) ctx.revert(); // Kill all GSAP animations in this context
      // Restore original HTML so next mount (React strict mode) starts clean
      h1.innerHTML = originalH1HTML;
      h1.style.opacity = "0";
      h1.removeAttribute("style");
      if (shrunkP) {
        shrunkP.innerHTML = originalShrunkPHTML;
        shrunkP.removeAttribute("style");
      }
    };
  }, []);

  // ============================================
  // Magnetic cursor on hero CTA
  // ============================================
  useEffect(() => {
    const heroCta = heroCTARef.current;
    if (!heroCta) return;

    const magnetStrength = 35;
    const magnetRange = 150;
    let isHovering = false;

    function getBounds() {
      return heroCta!.getBoundingClientRect();
    }

    function handleMouseMove(e: MouseEvent) {
      const bounds = getBounds();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < magnetRange) {
        isHovering = true;
        const pullX = (distX / magnetRange) * magnetStrength;
        const pullY = (distY / magnetRange) * magnetStrength;
        gsap.to(heroCta, {
          x: pullX,
          y: pullY,
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else if (isHovering) {
        isHovering = false;
        gsap.to(heroCta, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1.2, 0.4)",
          overwrite: "auto",
        });
      }
    }

    function handleMouseLeave() {
      gsap.to(heroCta, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1.2, 0.4)",
        overwrite: "auto",
      });
    }

    document.addEventListener("mousemove", handleMouseMove);
    heroCta.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      heroCta.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // ============================================
  // Services showcase auto-rotate
  // ============================================
  useEffect(() => {
    const cards = document.querySelectorAll(".services-showcase-card");
    const descriptions = document.querySelectorAll(
      ".services-showcase-description"
    );
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
      card.addEventListener("click", () => {
        setActive(index);
      });
      card.addEventListener("mouseenter", () => {
        isHovered = true;
      });
      card.addEventListener("mouseleave", () => {
        isHovered = false;
      });
    });

    return () => clearInterval(interval);
  }, []);

  // ============================================
  // Ticker animation
  // ============================================
  useEffect(() => {
    const ticker = document.querySelector(".ticking-text") as HTMLElement;
    if (!ticker) return;

    const originalHTML = ticker.innerHTML;
    ticker.innerHTML = originalHTML + originalHTML + originalHTML;
    const tickerWidth = ticker.scrollWidth / 3;

    const anim = gsap.to(ticker, {
      x: -tickerWidth,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: (x: string) => `${parseFloat(x) % tickerWidth}px`,
      },
    });

    return () => {
      anim.kill();
    };
  }, []);

  // ============================================
  // Blog carousel (Draggable + nav buttons)
  // ============================================
  useEffect(() => {
    const cardsTrack = document.querySelector(
      ".blog-cards-track"
    ) as HTMLElement;
    const cardsWrapper = document.querySelector(".blog-cards-wrapper");
    const prevBtn = document.getElementById("blog-prev");
    const nextBtn = document.getElementById("blog-next");

    if (!cardsTrack || !cardsWrapper || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function getCardWidth() {
      const card = cardsTrack.querySelector(".blog-card-1") as HTMLElement;
      if (!card) return 300;
      const style = window.getComputedStyle(card);
      return card.offsetWidth + parseInt(style.marginRight || "0");
    }

    function getCardCount() {
      return cardsTrack.querySelectorAll(".blog-card-1").length;
    }

    function getSnapPoints() {
      const cardWidth = getCardWidth();
      const cardCount = getCardCount();
      const points: number[] = [];
      for (let i = 0; i < cardCount; i++) {
        points.push(-i * cardWidth);
      }
      return points;
    }

    function snapToCard(x: number) {
      const snapPoints = getSnapPoints();
      let closest = snapPoints[0];
      let minDistance = Math.abs(x - closest);

      for (let i = 1; i < snapPoints.length; i++) {
        const distance = Math.abs(x - snapPoints[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closest = snapPoints[i];
          currentIndex = i;
        }
      }
      return closest;
    }

    let draggableInstance: Draggable | null = null;

    if (typeof Draggable !== "undefined") {
      const instances = Draggable.create(cardsTrack, {
        type: "x",
        bounds: {
          minX: -((getCardCount() - 1) * getCardWidth()),
          maxX: 0,
        },
        inertia: true,
        edgeResistance: 0.85,
        snap: {
          x: (endValue: number) => snapToCard(endValue),
        },
      });
      draggableInstance = instances[0];
    }

    function navigate(direction: "prev" | "next") {
      const snapPoints = getSnapPoints();
      if (direction === "prev") {
        currentIndex = Math.max(0, currentIndex - 1);
      } else {
        currentIndex = Math.min(snapPoints.length - 1, currentIndex + 1);
      }
      const newX = snapPoints[currentIndex];
      gsap.to(cardsTrack, {
        x: newX,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          if (draggableInstance) draggableInstance.update();
        },
      });
    }

    const handlePrev = () => navigate("prev");
    const handleNext = () => navigate("next");
    prevBtn.addEventListener("click", handlePrev);
    nextBtn.addEventListener("click", handleNext);

    return () => {
      prevBtn.removeEventListener("click", handlePrev);
      nextBtn.removeEventListener("click", handleNext);
    };
  }, []);

  // ============================================
  // Works section cursor + preview popup
  // ============================================
  useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      (window.matchMedia("(max-width: 767px)").matches ||
        "ontouchstart" in window);
    const tiles = document.querySelectorAll(".works-tile");
    if (!tiles.length) return;

    // Create floating preview element
    const preview = document.createElement("div");
    preview.className = "works-preview";
    document.body.appendChild(preview);

    if (!isMobile) {
      // DESKTOP: cursor + hover
      const cursor = document.createElement("div");
      cursor.className = "works-cursor";
      cursor.innerHTML = `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#e2e2e2" /></svg>`;
      document.body.appendChild(cursor);

      // Add cursor:none to works-tile via style
      const style = document.createElement("style");
      style.textContent = `.works-tile { cursor: none; }`;
      document.head.appendChild(style);

      let mouseX = 0,
        mouseY = 0;
      let cursorX = 0,
        cursorY = 0;
      let previewX = 0,
        previewY = 0;
      let isHovering = false;
      let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
      let isFirstHover = true;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      };
      document.addEventListener("mousemove", handleMouseMove);

      let animFrame: number;
      function updateCursor() {
        if (isHovering) {
          cursorX += (mouseX - cursorX) * 0.15;
          cursorY += (mouseY - cursorY) * 0.15;
          cursor.style.left = cursorX + "px";
          cursor.style.top = cursorY + "px";
          previewX += (mouseX - previewX) * 0.1;
          previewY += (mouseY - previewY) * 0.1;
          preview.style.left = previewX + "px";
          preview.style.top = previewY + "px";
        }
        animFrame = requestAnimationFrame(updateCursor);
      }
      updateCursor();

      tiles.forEach((tile) => {
        const img = tile.querySelector(".works-tile-img") as HTMLImageElement;
        const imgSrc = img ? img.src : "";

        tile.addEventListener("mouseenter", () => {
          isHovering = true;
          cursorX = mouseX;
          cursorY = mouseY;
          previewX = mouseX;
          previewY = mouseY;
          cursor.classList.add("active");

          const delay = isFirstHover ? 225 : 150;
          if (hoverTimeout) clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            if (imgSrc && isHovering) {
              const randomAngle = (Math.random() - 0.5) * 30;
              const randomScale = 0.4 + Math.random() * 0.2;
              preview.classList.remove("active", "iwc-preview");
              preview.style.setProperty(
                "--pop-angle",
                `${randomAngle}deg`
              );
              preview.style.setProperty("--pop-scale", String(randomScale));
              if ((tile as HTMLElement).dataset.project === "iwc") {
                preview.classList.add("iwc-preview");
              }
              void preview.offsetWidth;
              preview.innerHTML = `<img src="${imgSrc}" alt="Preview">`;
              preview.classList.add("active");
              isFirstHover = false;
            }
          }, delay);
        });

        tile.addEventListener("mouseleave", (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const relatedTarget = mouseEvent.relatedTarget as HTMLElement;
          const movingToTile =
            relatedTarget && relatedTarget.closest(".works-tile");
          if (!movingToTile) {
            isHovering = false;
            cursor.classList.remove("active");
            preview.classList.remove("active");
            if (hoverTimeout) clearTimeout(hoverTimeout);
          }
        });
      });

      return () => {
        cancelAnimationFrame(animFrame);
        document.removeEventListener("mousemove", handleMouseMove);
        cursor.remove();
        preview.remove();
        style.remove();
      };
    } else {
      // MOBILE: scroll-based preview
      preview.classList.add("mobile-preview");
      let currentMobileIndex = -1;

      function checkScroll() {
        const viewportCenter = window.innerHeight / 2;
        let closestTile: { tile: Element; index: number } | null = null as { tile: Element; index: number } | null;
        let closestDistance = Infinity;

        tiles.forEach((tile, index) => {
          const rect = tile.getBoundingClientRect();
          const tileCenter = rect.top + rect.height / 2;
          const distance = Math.abs(tileCenter - viewportCenter);

          if (
            distance < closestDistance &&
            rect.top < window.innerHeight &&
            rect.bottom > 0
          ) {
            closestDistance = distance;
            closestTile = { tile, index };
          }
        });

        if (closestTile && closestTile.index !== currentMobileIndex) {
          currentMobileIndex = closestTile.index;
          const tile = closestTile.tile;
          const img = tile.querySelector(".works-tile-img") as HTMLImageElement;
          const imgSrc = img ? img.src : "";

          if (imgSrc) {
            const randomAngle = (Math.random() - 0.5) * 30;
            const randomScale = 0.4 + Math.random() * 0.2;
            preview.classList.remove("active", "iwc-preview");
            preview.style.setProperty("--pop-angle", `${randomAngle}deg`);
            preview.style.setProperty("--pop-scale", String(randomScale));
            if ((tile as HTMLElement).dataset.project === "iwc") {
              preview.classList.add("iwc-preview");
            }
            void preview.offsetWidth;
            preview.innerHTML = `<img src="${imgSrc}" alt="Preview">`;
            preview.classList.add("active");

            tiles.forEach((t) => t.classList.remove("scroll-active"));
            tile.classList.add("scroll-active");
          }
        }

        const worksSection = document.querySelector(".works-section");
        if (worksSection) {
          const rect = worksSection.getBoundingClientRect();
          const sectionVisible =
            rect.top < window.innerHeight * 0.4 &&
            rect.bottom > window.innerHeight * 0.6;
          if (!sectionVisible) {
            preview.classList.remove("active");
            tiles.forEach((t) => t.classList.remove("scroll-active"));
            currentMobileIndex = -1;
          }
        }
      }

      window.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll();

      return () => {
        window.removeEventListener("scroll", checkScroll);
        preview.remove();
      };
    }
  }, []);

  // ============================================
  // Coffee Break heading SplitText
  // ============================================
  useEffect(() => {
    const coffeeHeading = document.querySelector(".read-more-heading");
    if (!coffeeHeading || typeof SplitText === "undefined") return;

    const split = new SplitText(coffeeHeading, {
      type: "words",
      mask: "words",
    });
    gsap.set(split.words, { yPercent: 110, opacity: 0 });

    gsap.to(split.words, {
      yPercent: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: coffeeHeading,
        start: "top 70%",
        end: "top 40%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  // ============================================
  // Console branding
  // ============================================
  useEffect(() => {
    console.log(
      "%c                                       ",
      "font-size: 1px; background: linear-gradient(90deg, #7ec700, #5a9100); padding: 40px 0;"
    );
    console.log(
      "%c🌱 Created by Organically ",
      "font-size: 24px; font-weight: bold; color: #7ec700; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);"
    );
    console.log(
      "%cWhere ideas take root and grow bold.",
      "font-size: 14px; color: #666; font-style: italic; margin-top: 8px;"
    );
    console.log(
      "%c→ https://organicallyseo.com",
      "font-size: 12px; color: #7ec700; font-weight: bold;"
    );
  }, []);

  // ============================================
  // Newsletter form handler
  // ============================================
  const handleRansomSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const btn = (e.target as HTMLFormElement).querySelector(
        ".ransom-btn"
      ) as HTMLButtonElement;
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = "Message Received...";
      btn.style.background = "var(--orga, #7ec700)";
      btn.style.color = "#000";
      setTimeout(() => {
        btn.textContent = "Welcome Aboard";
      }, 1500);
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = "#000";
        btn.style.color = "var(--orga, #7ec700)";
      }, 4000);
    },
    []
  );

  return (
    <>
      {/* ============================================
          HERO SECTION
          ============================================ */}
      <div
        id="home-hero-section"
        className="hero-section home-hero"
        style={{
          paddingBottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <p ref={floatingTextRef} className="p2 hero-floating-text">
          Websites for all!
        </p>
        <div
          data-w-id="ac03ca97-7cfc-d8e6-988e-dbac0360cd9f"
          className="hero-div"
          style={{ width: "100%", maxWidth: "100%" }}
        >
          <h1
            ref={h1Ref}
            className="h1 h1-home"
            style={{ opacity: 1 }}
          >
            Your Website Should Be<br />Your Best Salesperson<span className="green-span">.</span>
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
              <span
                style={{
                  color: "var(--orga)",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: "0.95rem", color: "var(--black-75)" }}>
                SEO-optimized from day one
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  color: "var(--orga)",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: "0.95rem", color: "var(--black-75)" }}>
                Fast, mobile-first designs
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  color: "var(--orga)",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                ✓
              </span>
              <span style={{ fontSize: "0.95rem", color: "var(--black-75)" }}>
                Transparent monthly pricing
              </span>
            </div>
          </div>

          {/* Hero CTA Button */}
          <Link
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
          </Link>

          {/* Feature Tickers (hidden) */}
          <div className="feature-ticker-container" style={{ display: "none" }}>
            <div className="feature-ticker feature-ticker-left">
              <div className="feature-ticker-track">
                {[
                  "White Label Agency",
                  "SEO + Design Unified",
                  "Custom Development",
                  "Zero Templates",
                  "AI-Optimized Content",
                  "Startup Branding",
                  "White Label Agency",
                  "SEO + Design Unified",
                  "Custom Development",
                  "Zero Templates",
                  "AI-Optimized Content",
                  "Startup Branding",
                ].map((item, i) => (
                  <span key={i} className="feature-item">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="feature-ticker feature-ticker-right">
              <div className="feature-ticker-track">
                {[
                  "Branding Strategy",
                  "Technical SEO",
                  "Performance First",
                  "Conversion Focused",
                  "Data-Driven Design",
                  "Pittsburgh Based",
                  "Frontend for Startups",
                  "Branding Strategy",
                  "Technical SEO",
                  "Performance First",
                  "Conversion Focused",
                  "Data-Driven Design",
                  "Pittsburgh Based",
                  "Frontend for Startups",
                ].map((item, i) => (
                  <span key={i} className="feature-item">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Social Proof Tiles (hidden) */}
          <div className="hero-social-proof-tiles" style={{ display: "none" }}>
            <div className="social-proof-tile">
              <p className="social-proof-stat">2.5M</p>
              <p className="p2">Million impressions for a local business</p>
            </div>
            <div className="social-proof-tile">
              <p className="social-proof-stat">AI</p>
              <p className="p2">Search optimized</p>
            </div>
          </div>
        </div>

        {/* Floating Selfie Tile */}
        <div className="hero-selfie-wrapper">
          <div className="hero-selfie-tile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/darkmode/light duotone selfie.png"
              alt="Ryan Scanlon"
              className="selfie-light"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/darkmode/dark duotone selfie.png"
              alt="Ryan Scanlon"
              className="selfie-dark"
            />
          </div>
          <p className="selfie-typer"></p>
        </div>

        {/* Social Proof Review */}
        <div
          className="hero-social-proof"
          style={{ width: 300, maxWidth: 300 }}
        >
          <div className="hero-social-proof-stars">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/green 5 star.png" alt="5 stars" />
          </div>
          <p
            className="social-proof-title"
            style={{ fontStyle: "italic", fontSize: 11 }}
          >
            IWC Cabinetry
          </p>
          <p
            className="p2"
            style={{ fontStyle: "italic", fontSize: 11, lineHeight: 1.5 }}
          >
            &quot;His adaptability, expertise, and willingness to collaborate
            made the project a creative experience that produced an asset for our
            company to use and build on for years to come.&quot;
          </p>
        </div>

        {/* Hero Video */}
        <div
          ref={videoRef}
          data-video-urls="videos/theme video compressed.webm"
          data-autoplay="true"
          data-loop="true"
          data-wf-ignore="true"
          data-w-id="11ffdc7c-90a5-ba77-fbdb-78f2b0f41844"
          className="home-hero-vid w-background-video w-background-video-atom"
        >
          <video
            id="11ffdc7c-90a5-ba77-fbdb-78f2b0f41844-video"
            autoPlay
            loop
            muted
            playsInline
            data-wf-ignore="true"
            data-object-fit="cover"
          >
            <source
              src="/videos/theme video compressed.webm"
              type="video/webm"
              data-wf-ignore="true"
            />
          </video>
        </div>

        <div className="ticker">
          <p className="ticker-p">
            Welcome to Organically: a vast space where stray ideas can wander,
            take root, and quietly grow bold.
          </p>
        </div>

        {/* Steel Building */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={buildingRef}
          src="/images/Steel-Building.png"
          loading="lazy"
          sizes="100vw"
          srcSet="/images/Steel-Building-p-500.png 500w, /images/Steel-Building-p-800.png 800w, /images/Steel-Building-p-1080.png 1080w, /images/Steel-Building-p-1600.png 1600w, /images/Steel-Building.png 2048w"
          alt="Pittsburgh Steel Building"
          className="hero-steel-building"
          style={{ display: "block" }}
        />
      </div>

      {/* ============================================
          WORKS SECTION
          ============================================ */}
      <section
        className="section works-section"
        style={{ paddingTop: "10vh", paddingBottom: "10vh" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/fishing.png" alt="" className="fishing-img" />
        <h2 className="works-h2">Works</h2>
        <div className="works-tiles-container">
          {[
            {
              href: "https://qalandscaping.com",
              project: "qa",
              img: "/assets/qa homepage.jpg",
              alt: "Q&A Project",
              title: "Q&A",
            },
            {
              href: "https://icrpgh.com",
              project: "integrated",
              img: "/assets/integrated homepage.jpg",
              alt: "Integrated Project",
              title: "Integrated",
            },
            {
              href: "https://malleable.cloud",
              project: "malleable",
              img: "/assets/malleable.png",
              alt: "Malleable Project",
              title: "Malleable",
            },
            {
              href: "https://www.tccustomized.shop/",
              project: "tc-customs",
              img: "/assets/tc customs.jpg",
              alt: "TC Customs Project",
              title: "TC Customs",
            },
            {
              href: "https://www.iwccabinetry.com/",
              project: "iwc",
              img: "/assets/iwc cabinetry.png",
              alt: "IWC Cabinetry Project",
              title: "IWC",
            },
            {
              href: "https://varaesthetics.com",
              project: "varaesthetics",
              img: "/assets/varaesthetics hero.jpg",
              alt: "Varaesthetics Project",
              title: "Varaesthetics",
            },
          ].map((tile) => (
            <a
              key={tile.project}
              href={tile.href}
              target="_blank"
              rel="noopener noreferrer"
              className="works-tile"
              data-project={tile.project}
            >
              <div className="works-tile-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.img}
                  alt={tile.alt}
                  className="works-tile-img"
                />
              </div>
              <span className="works-tile-title">{tile.title}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ============================================
          SERVICES SHOWCASE
          ============================================ */}
      <div className="services-showcase">
        <div className="services-showcase-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/monstera-icon.png"
            alt="Monstera icon"
            style={{ width: 100, height: 100, marginLeft: -20 }}
          />
          <h2>Full-Service Digital Marketing That Grows Your Business</h2>
          <p>
            From custom web design and SEO to branding and development—we
            deliver comprehensive marketing solutions that drive real results.
            Let&apos;s build something that converts.
          </p>
          <div className="services-showcase-tabs">
            <div
              className="services-showcase-card active"
              data-service="branding"
              data-color="var(--orga)"
            >
              <span className="services-showcase-label">Branding</span>
            </div>
            <div
              className="services-showcase-card"
              data-service="digital-pr"
              data-color="var(--red-1)"
            >
              <span className="services-showcase-label">Digital PR</span>
            </div>
            <div
              className="services-showcase-card"
              data-service="front-end"
              data-color="var(--blue-2)"
            >
              <span className="services-showcase-label">Front End Dev</span>
            </div>
            <Link
              href="/web-design/"
              className="services-showcase-card"
              data-service="web-design"
              data-color="var(--steeler)"
            >
              <span className="services-showcase-label">Web Design</span>
            </Link>
          </div>
          <div className="services-showcase-content">
            <div
              className="services-showcase-description active"
              data-service="branding"
            >
              <p className="small-feature-title">Branding</p>
              <p className="p2">
                Crafting distinctive visual identities that resonate with your
                audience and elevate your brand presence.{" "}
                <Link href="/branding/" style={{ color: "var(--orga)" }}>
                  Explore branding services
                </Link>
                .
              </p>
            </div>
            <div
              className="services-showcase-description"
              data-service="digital-pr"
            >
              <p className="small-feature-title">Digital PR</p>
              <p className="p2">
                Strategic storytelling and media outreach that amplifies your
                message across digital channels.
              </p>
            </div>
            <div
              className="services-showcase-description"
              data-service="front-end"
            >
              <p className="small-feature-title">Front End Development</p>
              <p className="p2">
                Building responsive, performant interfaces with modern web
                technologies and best practices.
              </p>
            </div>
            <div
              className="services-showcase-description"
              data-service="web-design"
            >
              <p className="small-feature-title">Web Design</p>
              <p className="p2">
                Designing intuitive, beautiful web experiences that convert
                visitors into customers.{" "}
                <Link href="/web-design/" style={{ color: "var(--orga)" }}>
                  Learn more about our web design services
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
        <div className="services-showcase-right">
          <div className="services-selfie-tile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/darkmode/light duotone selfie.png"
              alt="Ryan Scanlon"
              className="selfie-light"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/darkmode/dark duotone selfie.png"
              alt="Ryan Scanlon"
              className="selfie-dark"
            />
          </div>
        </div>
      </div>

      {/* ============================================
          TICKER TESTIMONIAL
          ============================================ */}
      <section
        className="section ticker-testimonial-section"
        style={{ backgroundColor: "transparent" }}
      >
        <div
          className="ticking-text"
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          Proven to move the needle Organically
          <span className="green-span">. </span>
        </div>
      </section>

      {/* ============================================
          CHOOSE YOUR ADVENTURE
          ============================================ */}
      <address
        id="choose-adventure"
        data-w-id="76ca32a2-4ec2-eb02-d5aa-23c5b7d05ca3"
        className="section-home-3"
        style={{
          WebkitTransform: "translate3d(0px, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
          transform: "translate3d(0px, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
        }}
      >
        <h3 className="h3 center-h3">Choose your adventure</h3>
        <div id="cards-container" className="adventure-wrapper">
          <div
            id="card-1"
            data-w-id="d4e5f728-ce2b-8ef6-7abe-0acc63715ccc"
            className="adventure-card"
            style={{
              WebkitTransform: "translate3d(0vw, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
              transform: "translate3d(0vw, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
            }}
          >
            <h4 className="home-h4 adv-card-h4">
              I need a brand mark or identity.
            </h4>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/refresh-symbol-7ec700.png"
            loading="lazy"
            alt=""
            className="refresh-adventure"
          />
          <div
            id="card-2"
            data-w-id="d7116db5-720f-0007-37dd-f03b1c2caa8d"
            className="adventure-card"
            style={{
              WebkitTransform: "translate3d(0vw, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
              transform: "translate3d(0vw, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
            }}
          >
            <h4 className="home-h4 adv-card-h4">I need a website.</h4>
          </div>
          <div
            id="card-3"
            data-w-id="0560e116-9f24-f07e-4c40-c315002c9935"
            className="adventure-card"
            style={{
              WebkitTransform: "translate3d(0vw, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
              transform: "translate3d(0vw, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
            }}
          >
            <h4 className="home-h4 adv-card-h4">I need organic traffic.</h4>
          </div>
        </div>

        {/* Brand Adventure */}
        <div
          data-w-id="4549a21c-766a-0cca-cc05-296bc6da0f72"
          className="revealed-card-content brand-adventure"
          style={{
            WebkitTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
            transform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
          }}
        >
          <h3 id="typer-1" className="h3 center-h3">
            Your logo is sometimes all consumers have
            <br />
            when deciding to use your business.
          </h3>
          <Link
            data-w-id="71a7040c-feb9-df0d-a31b-bf63a706806c"
            href="/branding/"
            className="button-1 universal w-button"
          >
            Learn more about custom branding
          </Link>
          <div className="revealed-content-div left">
            <div className="revealed-content">
              <div className="home-p2">
                If all you have is an idea (that&apos;s ok) or you&apos;re
                already doing business without an official mark, I can help you
                bring your vision to life.
              </div>
            </div>
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
          </div>
          <div className="revealed-content-div right">
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-left-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
            <div className="revealed-content">
              <div className="home-p2">
                Not having a logo, or hanging on to an old/outdated one could
                negatively impact how the market sees your business.
              </div>
            </div>
          </div>
          <h3 className="h3 center-h3 revealed-h3">
            It&apos;s time to let go.
          </h3>
          <div className="revealed-content-div left">
            <div className="revealed-content">
              <div className="home-p2">
                I can make logos, profile pictures, social graphics, &amp;
                typography that align with your dream and your brand. I&apos;m a
                dreamer myself.
              </div>
            </div>
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
          </div>
          <div className="revealed-content-div right">
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-left-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
            <div className="revealed-content">
              <div className="home-p2">
                Don&apos;t like the first draft? No problem, I can scrap it.
                I&apos;ll do infinite versions until we get it perfect (if I
                like you).
              </div>
            </div>
          </div>
          <div className="revealed-content-div center">
            <div className="revealed-content center">
              <div className="home-p3">
                One of my passions is to help turn ideation into creation without
                breaking the bank. And turning visions into projects.
              </div>
              <a
                data-w-id="1ca33e59-9826-d132-d682-f385c0f9c786"
                href="https://calendly.com/organically/30min"
                className="button-1 universal w-button"
              >
                Schedule a branding call
              </a>
            </div>
          </div>
          <a href="#choose-adventure" className="return-to-adventure">
            Return to Choose Your Adventure
          </a>
        </div>

        {/* Website Adventure */}
        <div
          data-w-id="2f43827f-77ae-ab83-fe7b-a9354fcc7b26"
          className="revealed-card-content website-adventure"
          style={{
            WebkitTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
            transform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
          }}
        >
          <h3 id="typer-2" className="h3 center-h3">
            Your website can be either a powerful asset that converts visitors -
            or just something to look at.
          </h3>
          <Link
            data-w-id="2f43827f-77ae-ab83-fe7b-a9354fcc7b29"
            href="/web-design/"
            className="button-1 universal w-button"
          >
            Learn more
          </Link>
          <div className="revealed-content-div left">
            <div className="revealed-content">
              <div className="home-p2">
                Many business owners think they can get by without a website. Or
                they just don&apos;t have the time to keep up with it.
              </div>
            </div>
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
          </div>
          <div className="revealed-content-div right">
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-left-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
            <div className="revealed-content">
              <div className="home-p2">
                Others just see it as a hassle, or they can&apos;t get why their
                competitors are doing so much better on the web.
              </div>
            </div>
          </div>
          <h3 className="h3 center-h3 revealed-h3">
            That&apos;s where I come in.
          </h3>
          <div className="revealed-content-div left">
            <div className="revealed-content">
              <div className="home-p2">
                I design custom websites that stand out above simple templates. I
                create and manage your website while you focus on you.
              </div>
            </div>
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/1-star.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
          </div>
          <div className="revealed-content-div right">
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-left-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
            <div className="revealed-content">
              <div className="home-p2">
                Let&apos;s make pages that WOW your target audience into booking
                more leads, calls, whatever.
              </div>
            </div>
          </div>
          <div className="revealed-content-div center">
            <div className="revealed-content center">
              <div className="home-p3">
                Ongoing updates, interactions, animations, you name it. Work
                with me and your website dreams will come true.
              </div>
              <a
                data-w-id="2f43827f-77ae-ab83-fe7b-a9354fcc7b41"
                href="https://calendly.com/organically/30min"
                className="button-1 universal w-button"
              >
                Schedule a quick call
              </a>
            </div>
          </div>
          <a href="#choose-adventure" className="return-to-adventure">
            Return to Choose Your Adventure
          </a>
        </div>

        {/* SEO Adventure */}
        <div
          data-w-id="ed1cec20-4fd8-180c-09ae-dd96a6250cda"
          className="revealed-card-content seo-adventure"
          style={{
            WebkitTransform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
            transform: "translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)",
          }}
        >
          <h3 id="typer-3" className="h3 center-h3">
            Generating traffic on your website isn&apos;t luck. It goes
            hand-in-hand with what&apos;s on your pages.
          </h3>
          <Link data-w-id="ed1cec20-4fd8-180c-09ae-dd96a6250cdd" href="/seo/" className="button-1 universal w-button">
            Learn more about SEO
          </Link>
          <div className="revealed-content-div left">
            <div className="revealed-content">
              <div className="home-p2">
                On one hand, you could have the coolest website in the world, but
                if no one sees it, what&apos;s the point?
              </div>
            </div>
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
          </div>
          <div className="revealed-content-div right">
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-left-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
            <div className="revealed-content">
              <div className="home-p2">
                On the other hand, your website could have thousands of visitors.{" "}
                <br />
                <br />
                But if it functions poorly, or doesn&apos;t convert any visitors
                to sales, what&apos;s the point?
              </div>
            </div>
          </div>
          <h3 className="h3 center-h3 revealed-h3">
            That&apos;s where I come in.
          </h3>
          <div className="revealed-content-div left">
            <div className="revealed-content">
              <div className="home-p2">
                Let&apos;s do SEO right. It&apos;s implementing the right
                keywords on your service pages, then creating a blog with
                resources and tools.{" "}
              </div>
            </div>
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
          </div>
          <div className="revealed-content-div right">
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-left-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
            <div className="revealed-content">
              <div className="home-p2">
                It&apos;s basically a combination of content marketing, digital
                PR, &amp; making sure a website functions properly.{" "}
              </div>
            </div>
          </div>
          <div className="revealed-content-div left">
            <div className="adv-arrow-div">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-left-arrow-7ec700.png"
                loading="lazy"
                alt=""
                className="adventure-arrow green"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/down-right-arrow-black.png"
                loading="lazy"
                alt=""
                className="adventure-arrow light"
              />
            </div>
            <div className="revealed-content">
              <div className="home-p2">
                It&apos;s about answering Google search. Positioning yourself and
                creating pages to be the service people search for. <br />
                <br />
                I&apos;ll figure out what words to include on your website that
                will answer search and get clicked.
              </div>
            </div>
          </div>
          <div className="revealed-content-div center">
            <div className="revealed-content center">
              <div className="home-p3">
                You could be a few well-placed keywords away from search engine
                supremacy.
              </div>
              <a
                data-w-id="2da31cc0-e172-f87c-d892-ce8857c3743a"
                href="https://calendly.com/organically/30min"
                className="button-1 universal w-button"
              >
                Book a free SEO call
              </a>
            </div>
          </div>
          <a href="#choose-adventure" className="return-to-adventure">
            Return to Choose Your Adventure
          </a>
        </div>
      </address>

      {/* ============================================
          COFFEE BREAK (Blog Section)
          ============================================ */}
      <section
        className="section blog-section"
        style={{
          paddingLeft: 0,
          paddingRight: 0,
          overflow: "hidden",
          alignItems: "flex-start",
        }}
      >
        <div className="blog-preview">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              marginBottom: 20,
              paddingLeft: "5vw",
            }}
          >
            <Link
              href="/blog/"
              className="blog-thumbs-blog-home w-inline-block"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/coffee-asset.png"
                alt="Coffee icon"
                style={{
                  width: 50,
                  height: 50,
                  marginBottom: 8,
                  opacity: 0.9,
                }}
              />
              <h5 className="read-more-heading">Coffee Break</h5>
            </Link>
            <div
              className="blog-nav-buttons"
              style={{ display: "flex", gap: 10, marginTop: 20 }}
            >
              <button className="blog-nav-btn" id="blog-prev">
                ←
              </button>
              <button className="blog-nav-btn" id="blog-next">
                →
              </button>
            </div>
          </div>
          <div className="read-more-module" style={{ overflow: "visible" }}>
            <div className="blog-cards-wrapper" style={{ overflow: "visible" }}>
              <div
                className="blog-cards-track"
                style={{ paddingLeft: "5vw" }}
              >
                <Link
                  href="/what-is-seo/"
                  className="blog-card-1 w-inline-block"
                >
                  <div className="blog-card-content">
                    <p className="blog-module-card-title">
                      What is SEO?
                      <br />
                    </p>
                    <div className="bog-comp-p">
                      Ranking on search engines isn&apos;t luck. The average
                      person makes 3-4 searches on Google per day. Learn how to
                      answer them.
                    </div>
                  </div>
                </Link>
                <Link
                  href="/ai-art/"
                  className="blog-card-1 thumb w-inline-block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/blog/ai art thumbnail.jpg"
                    loading="lazy"
                    alt="What is AI Art?"
                    className="thumb-image"
                  />
                  <div className="thumb-overlay"></div>
                  <div className="thumb-content">
                    <h3 className="thumb-title">What is AI Art?</h3>
                    <p className="thumb-excerpt">
                      AI&apos;s threat to jobs and humanity jeopardizes life as
                      we know it.
                    </p>
                  </div>
                </Link>
                <Link
                  href="/webflow-launch-checklist/"
                  className="blog-card-1 w-inline-block"
                >
                  <div className="blog-card-content">
                    <div className="filter">
                      <div className="filter-text design">Design</div>
                    </div>
                    <p className="blog-module-card-title">
                      Webflow Launch Checklist
                      <br />
                    </p>
                    <p className="blog-component-date">September 5, 2024</p>
                    <div className="bog-comp-p">
                      Launching a website on Webflow can be terrifying,
                      especially if it&apos;s your first time. Many things can go
                      wrong; some things you may never have heard of.{" "}
                    </div>
                  </div>
                </Link>
                <Link
                  href="/branding-basics/"
                  className="blog-card-1 w-inline-block"
                >
                  <div className="blog-card-content">
                    <div className="filter">
                      <div className="filter-text branding">Branding</div>
                    </div>
                    <p className="blog-module-card-title">
                      Basics of Branding: How to Build Your Own Brand
                      <br />
                    </p>
                    <p className="blog-component-date">June 6, 2024</p>
                    <div className="bog-comp-p">
                      Deciding on an original name, colors, logo, and website
                      that speak to you are big commitments.
                    </div>
                  </div>
                </Link>
                <Link
                  href="/webflow-vs-figma/"
                  className="blog-card-1 w-inline-block"
                >
                  <div className="blog-card-content">
                    <div className="filter">
                      <div className="filter-text design">Design</div>
                    </div>
                    <p className="blog-module-card-title">
                      Webflow vs. Figma
                      <br />
                    </p>
                    <p className="blog-component-date">July 12, 2023</p>
                    <div className="bog-comp-p">
                      In today&apos;s shifting tides of creative design and
                      development programs, selecting the right tools can
                      significantly impact your creative journey.
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          CALENDAR SECTION
          ============================================ */}
      <section className="section calendar-section" id="calendar-section">
        <div className="calendar-section-inner">
          <div className="calendar-content">
            <h2 className="h1">
              Let&apos;s Connect<span className="green-span">.</span>
            </h2>
            <p className="calendar-description">
              Pick a time that works for you. Whether it&apos;s about a project,
              networking, consulting, or just chatting about ideas—I&apos;m here
              for it.
            </p>

            <p className="calendar-benefits-label">What you&apos;ll get:</p>
            <ul className="calendar-benefits">
              <li className="calendar-benefit">
                <span className="calendar-benefit-check">✓</span>
                <span className="calendar-benefit-text">
                  Honest feedback on your digital presence
                </span>
              </li>
              <li className="calendar-benefit">
                <span className="calendar-benefit-check">✓</span>
                <span className="calendar-benefit-text">
                  Ideas tailored to your goals
                </span>
              </li>
              <li className="calendar-benefit">
                <span className="calendar-benefit-check">✓</span>
                <span className="calendar-benefit-text">
                  Strategic insights &amp; recommendations
                </span>
              </li>
              <li className="calendar-benefit">
                <span className="calendar-benefit-check">✓</span>
                <span className="calendar-benefit-text">
                  No pressure, just real conversation
                </span>
              </li>
            </ul>
          </div>

          <div className="calendar-embed">
            <iframe
              src="https://calendly.com/organically/30min?embed_domain=organicallyseo.com&embed_type=Inline&hide_gdpr_banner=1&primary_color=7ec700&background_color=e2e2e2&text_color=000000&hide_event_type_details=1"
              height={900}
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ============================================
          NEWSLETTER - THE RANSOM NOTE (hidden)
          ============================================ */}
      <section className="section newsletter-ransom" id="newsletter-ransom">
        <div className="coffee-stain"></div>
        <div className="coffee-stain"></div>
        <div className="doodle">*</div>
        <div className="doodle">~</div>
        <div className="doodle">?</div>
        <div className="doodle">!</div>

        <div className="ransom-container">
          <div className="ransom-headline">
            <span className="ransom-word">We</span>
            <span className="ransom-word">Have</span>
            <span className="ransom-word">Your</span>
            <span className="ransom-word">Attention</span>
          </div>

          <div className="ransom-subtext">
            <span className="ransom-fragment">Sign up for emails</span>
            <span className="ransom-fragment">written at 2am</span>
            <span className="ransom-fragment">about websites,</span>
            <span className="ransom-fragment">existential design choices,</span>
            <span className="ransom-fragment">and whatever else</span>
            <span className="ransom-fragment">escapes the filter.</span>
          </div>

          <form className="ransom-form" onSubmit={handleRansomSubmit}>
            <input
              type="email"
              className="ransom-input"
              placeholder="drop your email here..."
              required
            />
            <button type="submit" className="ransom-btn">
              I Accept My Fate
            </button>
            <p className="fine-print">
              Frequency: whenever inspiration strikes (or deadlines loom).
              Content: <span className="redacted">classified</span> but mostly
              harmless. Unsubscribe: always available, no hard feelings.
            </p>
          </form>

          <div className="torn-edge"></div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <Footer />
    </>
  );
}
