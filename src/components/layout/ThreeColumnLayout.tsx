import { SideMenuPanel } from "./SideMenuPanel";
import { CalendarPanel } from "./CalendarPanel";
import { UniversalMenu } from "./UniversalMenu";

interface ThreeColumnLayoutProps {
  children: React.ReactNode;
}

export function ThreeColumnLayout({ children }: ThreeColumnLayoutProps) {
  return (
    <>
      {/* Left Side Menu Panel */}
      <SideMenuPanel />

      {/* Center Body Section */}
      <div className="body-section">
        <UniversalMenu />

        {/* Announcement Banner */}
        <div className="announcement-banner" style={{ display: "none" }}>
          <p className="announcement-text">
            New Report: 2025 SEO Trends &amp; Strategies - Download Now
          </p>
        </div>

        {/* Page Content */}
        {children}
      </div>

      {/* Right Calendar Panel */}
      <CalendarPanel />
    </>
  );
}
