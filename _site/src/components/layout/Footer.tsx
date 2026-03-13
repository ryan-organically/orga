"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-rich-black text-e2 py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="text-3xl font-coolvetica text-orga">
              Organically
            </Link>
            <p className="mt-4 text-sm text-e2/70 font-ltmuseum italic">
              Redefining agency marketing—one organic idea at a time.
            </p>
          </div>

          {/* Agency Links */}
          <div>
            <h4 className="text-lg font-coolvetica mb-4">Agency</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/web-design"
                className="text-sm text-e2/70 hover:text-orga transition-colors"
              >
                Web Design
              </Link>
              <Link
                href="/seo"
                className="text-sm text-e2/70 hover:text-orga transition-colors"
              >
                SEO
              </Link>
              <Link
                href="/branding"
                className="text-sm text-e2/70 hover:text-orga transition-colors"
              >
                Creative
              </Link>
              <Link
                href="/blog"
                className="text-sm text-e2/70 hover:text-orga transition-colors"
              >
                Blog
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-coolvetica mb-4">Contact</h4>
            <nav className="flex flex-col gap-2">
              <a
                href="mailto:hello@organicallyseo.com"
                className="text-sm text-e2/70 hover:text-orga transition-colors"
              >
                hello@organicallyseo.com
              </a>
              <p className="text-sm text-e2/70">Houston, TX</p>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-coolvetica mb-4">Connect</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/organicallyseo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-e2/70 hover:text-orga transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/organically"
                target="_blank"
                rel="noopener noreferrer"
                className="text-e2/70 hover:text-orga transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-e2/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-e2/50">
            © {new Date().getFullYear()} Organically. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm text-e2/50 hover:text-orga transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
