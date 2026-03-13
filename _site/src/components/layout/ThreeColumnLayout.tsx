"use client";

import { useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { UniversalMenu } from "./UniversalMenu";
import { SideMenuPanel } from "./SideMenuPanel";
import { CalendarPanel } from "./CalendarPanel";

interface ThreeColumnLayoutProps {
  children: React.ReactNode;
}

export function ThreeColumnLayout({ children }: ThreeColumnLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleCalendarToggle = useCallback(() => {
    setIsCalendarOpen((prev) => !prev);
  }, []);

  const handleCalendarClose = useCallback(() => {
    setIsCalendarOpen(false);
  }, []);

  // Animate body section when menu opens/closes
  useEffect(() => {
    const isMobile = window.innerWidth <= 767;
    const slideDistance = isMobile ? "75vw" : "15vw";

    gsap.to(".body-section", {
      x: isMenuOpen ? slideDistance : 0,
      duration: 0.6,
      ease: "expo.out",
    });

    // Also animate side panel visibility
    gsap.to(".side-panel", {
      autoAlpha: isMenuOpen ? 1 : 0,
      duration: 0.6,
      ease: "expo.out",
    });
  }, [isMenuOpen]);

  // Animate body section when calendar opens/closes
  useEffect(() => {
    const isMobile = window.innerWidth <= 767;
    const slideDistance = isMobile ? "-75vw" : "-15vw";

    gsap.to(".body-section", {
      x: isCalendarOpen ? slideDistance : 0,
      duration: 0.6,
      ease: "expo.out",
    });

    gsap.to(".calendar-panel-content", {
      autoAlpha: isCalendarOpen ? 1 : 0,
      duration: 0.6,
      ease: "expo.out",
    });
  }, [isCalendarOpen]);

  // Close panels on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMenuOpen) handleMenuClose();
        if (isCalendarOpen) handleCalendarClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, isCalendarOpen, handleMenuClose, handleCalendarClose]);

  return (
    <>
      {/* Left Side Menu Panel */}
      <SideMenuPanel isOpen={isMenuOpen} onClose={handleMenuClose} />

      {/* Center Body Section */}
      <div className="body-section">
        {/* Universal Menu - Transparent header */}
        <div className="universal-menu">
          <UniversalMenu isOpen={isMenuOpen} onToggle={handleMenuToggle} />

          {/* Dark/Light mode toggle placeholder */}
          <div className="light-dark-mode-wrapper">
            <div className="dark-mode-button"></div>
          </div>

          {/* Book Call Button */}
          <button
            onClick={handleCalendarToggle}
            className="button-1 w-button"
            id="calendar-toggle"
          >
            Schedule a call
          </button>
        </div>

        {/* Page Content */}
        {children}
      </div>

      {/* Right Calendar Panel */}
      <CalendarPanel isOpen={isCalendarOpen} onClose={handleCalendarClose} />

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div
          className="menu-overlay active"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
            zIndex: 5,
          }}
          onClick={handleMenuClose}
        />
      )}
    </>
  );
}
