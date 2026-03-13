"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/web-design", label: "Web design" },
  { href: "/seo", label: "SEO" },
  { href: "/branding", label: "Creative" },
  { href: "/blog", label: "Blog" },
];

export function SideMenuPanel({ isOpen, onClose }: SideMenuPanelProps) {
  const pathname = usePathname();

  return (
    <div
      className={`fixed left-0 top-0 h-full w-[var(--side-panel-width)] bg-white z-[100] transition-transform duration-500 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full p-8 pt-24">
        {/* Tagline */}
        <p className="text-sm text-333 mb-12 font-ltmuseum italic">
          Redefining agency marketing—one organic idea at a time.
        </p>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`text-4xl font-coolvetica transition-colors duration-300 hover:text-orga ${
                pathname === link.href ? "text-orga" : "text-333"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
