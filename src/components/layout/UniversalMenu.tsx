"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface UniversalMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function UniversalMenu({ isOpen, onToggle }: UniversalMenuProps) {
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;

    if (!line1 || !line2 || !line3) return;

    if (isOpen) {
      // Animate to X (close icon)
      gsap.to(line1, { rotation: -45, y: 0, duration: 0.4, ease: "power2.inOut" });
      gsap.to(line2, { opacity: 0, scale: 0.3, duration: 0.3, ease: "power2.in" });
      gsap.to(line3, { rotation: 45, y: 0, duration: 0.4, ease: "power2.inOut" });
    } else {
      // Animate back to hamburger
      gsap.to(line1, { rotation: 0, y: -10, duration: 0.4, ease: "power2.inOut" });
      gsap.to(line2, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", delay: 0.1 });
      gsap.to(line3, { rotation: 0, y: 10, duration: 0.4, ease: "power2.inOut" });
    }
  }, [isOpen]);

  return (
    <div
      className="menu-toggle"
      onClick={onToggle}
      style={{
        position: "relative",
        width: 65,
        height: 65,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
      }}
    >
      <span
        ref={line1Ref}
        style={{
          position: "absolute",
          width: 40,
          height: 3.5,
          background: "var(--333, #333)",
          borderRadius: 2,
          transform: "translateY(-10px)",
          transition: "background 0.3s ease",
        }}
      />
      <span
        ref={line2Ref}
        style={{
          position: "absolute",
          width: 40,
          height: 3.5,
          background: "var(--333, #333)",
          borderRadius: 2,
          transition: "background 0.3s ease",
        }}
      />
      <span
        ref={line3Ref}
        style={{
          position: "absolute",
          width: 40,
          height: 3.5,
          background: "var(--333, #333)",
          borderRadius: 2,
          transform: "translateY(10px)",
          transition: "background 0.3s ease",
        }}
      />
      <style jsx>{`
        .menu-toggle:hover span {
          background: #7ec700 !important;
        }
      `}</style>
    </div>
  );
}
