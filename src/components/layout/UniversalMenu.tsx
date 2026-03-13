"use client";

import Link from "next/link";

export function UniversalMenu() {
  return (
    <div className="universal-menu">
      <universal-menu></universal-menu>
      <div>
        <Link href="/form/" className="button-1 w-button">
          Schedule an Estimate
        </Link>
        <DarkModeToggle />
      </div>
    </div>
  );
}

function DarkModeToggle() {
  const handleToggle = () => {
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div
      id="dark-mode-toggle"
      className="dark-mode-toggle"
      onClick={handleToggle}
      style={{ display: "inline-flex", cursor: "pointer" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/moon-1.png"
        loading="lazy"
        alt="Toggle dark mode"
        className="toggle-icon dark-icon"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brightness-2.png"
        loading="lazy"
        alt="Toggle light mode"
        className="toggle-icon light-icon"
      />
    </div>
  );
}

// Declare the custom element for TypeScript
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "universal-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
