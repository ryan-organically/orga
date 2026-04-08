import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stop Bleeding Money on Marketing That Doesn't Work | Organically",
  description:
    "Custom websites and SEO strategies that bring qualified customers. No cookie-cutter templates. No generic advice. Results you can measure.",
  openGraph: {
    type: "website",
    title: "Stop Bleeding Money on Marketing That Doesn't Work | Organically",
    description:
      "Custom websites and SEO strategies that bring qualified customers. No cookie-cutter templates. No generic advice. Results you can measure.",
    url: "https://organicallyseo.com",
    siteName: "Organically",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stop Bleeding Money on Marketing That Doesn't Work | Organically",
    description:
      "Custom websites and SEO strategies that bring qualified customers. No cookie-cutter templates. No generic advice. Results you can measure.",
  },
  alternates: {
    canonical: "https://organicallyseo.com",
    languages: {
      en: "https://organicallyseo.com/",
      es: "https://organicallyseo.com/es/",
    },
  },
  icons: {
    icon: "/images/favicon.jpg",
    apple: "/images/webclip.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" href="https://organicallyseo.com/" hrefLang="x-default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://calendly.com" />
        <link
          rel="preconnect"
          href="https://assets.calendly.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Vollkorn:wght@400;700&family=Lato:wght@400;700&family=Oswald:wght@400;600&family=Exo:wght@400&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/normalize.css" />
        <link rel="stylesheet" href="/css/webflow.css" />
        <link rel="stylesheet" href="/css/organicallyseo-com.webflow.css?v=2" />
        <link rel="stylesheet" href="/css/homepage-overrides.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://organicallyseo.com/#organization",
                  name: "Organically SEO",
                  url: "https://organicallyseo.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://organicallyseo.com/images/Organically-Logo-green.png",
                    width: 1000,
                    height: 1000,
                  },
                  description:
                    "Solo agency marketer delivering businesses with personalized & powerful websites that generate traffic.",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Pittsburgh",
                    addressRegion: "PA",
                    addressCountry: "US",
                  },
                  sameAs: [
                    "https://twitter.com/organicallyseo",
                    "https://www.linkedin.com/in/ryan-scanlon31/",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    email: "ryan.organically@gmail.com",
                    contactType: "customer service",
                    areaServed: "US",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://organicallyseo.com/#website",
                  url: "https://organicallyseo.com",
                  name: "Organically",
                  description: "Web Creative with Organic Potential",
                  publisher: {
                    "@id": "https://organicallyseo.com/#organization",
                  },
                  inLanguage: "en",
                },
                {
                  "@type": "WebPage",
                  "@id": "https://organicallyseo.com/#webpage",
                  url: "https://organicallyseo.com/",
                  name: "Organically | Web Creative with Organic Potential",
                  description:
                    "Solo agency marketer delivering businesses with personalized & powerful websites that generate traffic.",
                  isPartOf: {
                    "@id": "https://organicallyseo.com/#website",
                  },
                  about: {
                    "@id": "https://organicallyseo.com/#organization",
                  },
                  inLanguage: "en",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="horizontal-body">{children}</body>
      <Script src="/components/universal-menu.js" strategy="afterInteractive" />
    </html>
  );
}
