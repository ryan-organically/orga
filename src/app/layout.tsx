import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const coolvetica = localFont({
  src: [
    {
      path: "../../public/fonts/coolvetica-rg.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/coolvetica-rg-it.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/coolvetica-crammed-rg.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-coolvetica",
  display: "swap",
});

const ltmuseum = localFont({
  src: "../../public/fonts/LTMuseum-Medium.ttf",
  variable: "--font-ltmuseum",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Organically | Web Creative with Organic Potential",
    template: "%s | Organically",
  },
  description:
    "Solo agency marketer delivering businesses with personalized & powerful websites that generate traffic.",
  keywords: ["SEO", "web design", "branding", "digital marketing", "Houston"],
  authors: [{ name: "Organically" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://organicallyseo.com",
    siteName: "Organically",
    title: "Organically | Web Creative with Organic Potential",
    description:
      "Solo agency marketer delivering businesses with personalized & powerful websites that generate traffic.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Organically | Web Creative with Organic Potential",
    description:
      "Solo agency marketer delivering businesses with personalized & powerful websites that generate traffic.",
  },
  alternates: {
    languages: {
      en: "https://organicallyseo.com",
      es: "https://organicallyseo.com/es",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${coolvetica.variable} ${ltmuseum.variable}`}>
      <head>
        <link rel="stylesheet" href="/css/normalize.css" />
        <link rel="stylesheet" href="/css/webflow.css" />
        <link rel="stylesheet" href="/css/organicallyseo-com.webflow.css" />
      </head>
      <body className="horizontal-body">{children}</body>
    </html>
  );
}
