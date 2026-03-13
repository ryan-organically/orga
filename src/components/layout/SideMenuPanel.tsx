import Link from "next/link";

export function SideMenuPanel() {
  return (
    <div className="side-menu-panel">
      <div className="side-panel">
        <div className="menu-header" style={{ display: "none" }}>
          <p className="menu-tagline">
            Redefining agency marketing—one organic idea at a time.
          </p>
        </div>
        <nav className="menu-nav">
          <Link href="/" className="menu-nav-link">Home</Link>
          <Link href="/web-design/" className="menu-nav-link">Web design</Link>
          <Link href="/seo/" className="menu-nav-link">SEO</Link>
          <Link href="/branding/" className="menu-nav-link">Creative</Link>
          <Link href="/blog/" className="menu-nav-link">Blog</Link>
        </nav>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/Steel-Building.png"
          alt="Pittsburgh Steel Building"
          className="side-panel-logo"
        />
      </div>
    </div>
  );
}
