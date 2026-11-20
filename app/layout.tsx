

import type { Metadata } from "next";
import { Titan_One, Inter, Anton } from "next/font/google";
import "./globals.css";

const heading = Titan_One({ weight: "400", subsets: ["latin"], variable: "--font-heading" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const condensed = Anton({ weight: "400", subsets: ["latin"], variable: "--font-condensed" });

export const metadata: Metadata = {
  title: "Thy Tech Contrivances",
  description: "We're here to build with you.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${heading.variable} ${body.variable} ${condensed.variable}`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}