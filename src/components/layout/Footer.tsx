"use client";

import { useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

export function Footer() {
  useEffect(() => {
    const typemark = document.querySelector(".footer-typemark");
    if (!typemark || typeof SplitText === "undefined") return;

    const split = SplitText.create(typemark, { type: "chars" });
    gsap.set(split.chars, { yPercent: -200, opacity: 0 });

    gsap.to(split.chars, {
      yPercent: 0,
      opacity: 1,
      stagger: 0.02,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: typemark,
        start: "top 80%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <div id="Footer" className="footer">
      <div className="footer-typemark-div">
        <Link href="/" aria-current="page" className="link-block w-inline-block w--current">
          <div className="footer-typemark">Organically</div>
        </Link>
        <div className="footer-social-wrapper">
          <a
            href="https://twitter.com/organicallyseo"
            className="footer-social-link w-inline-block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/X-black.png"
              loading="lazy"
              width={28}
              alt=""
              className="footer-social-image light"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/X-black.png"
              loading="lazy"
              width={28}
              alt=""
              className="footer-social-image dark"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/ryan-scanlon31/"
            className="footer-social-link w-inline-block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/LinkedIn-Black.png"
              loading="lazy"
              width={28}
              alt=""
              className="footer-social-image light"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/LinkedIn-Black.png"
              loading="lazy"
              width={28}
              alt=""
              className="footer-social-image dark"
            />
          </a>
        </div>
        <div className="copyright-bar">
          Copyright 2025 Organically SEO. All rights reserved.{" "}
        </div>
      </div>
      <div className="footer-wrapper-1">
        <div className="footer-div">
          <div className="footer-subheading">Agency</div>
          <Link href="/web-design/" className="footer-text">Web Design</Link>
          <Link href="/seo/" className="footer-text">SEO</Link>
          <Link href="/seo-audit-services/" className="footer-text">Audit</Link>
          <Link href="/blog/" className="footer-text">Blog</Link>
        </div>
        <div className="footer-div">
          <div className="footer-subheading">Contact</div>
          <div className="footer-text">Form</div>
          <div className="footer-text">ryan.organically@gmail.com</div>
        </div>
        <div className="footer-div">
          <div className="footer-subheading">Boring</div>
          <Link href="/privacy-policy/" className="footer-text">Privacy Policy</Link>
          <Link href="/sitemap/" className="footer-text">Sitemap</Link>
        </div>
      </div>
    </div>
  );
}
