// import type { Metadata } from "next";
// import { Titan_One, Inter } from "next/font/google";
// import "./globals.css";

// const heading = Titan_One({ weight: "400", subsets: ["latin"], variable: "--font-heading" });
// const body = Inter({ subsets: ["latin"], variable: "--font-body" });

// export const metadata: Metadata = {
//   title: "My Portfolio",
//   description: "Portfolio and writings",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`${heading.variable} ${body.variable}`}
//         style={{ fontFamily: "var(--font-body)" }}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Titan_One, Inter, Anton } from "next/font/google";
import "./globals.css";

const heading = Titan_One({ weight: "400", subsets: ["latin"], variable: "--font-heading" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const condensed = Anton({ weight: "400", subsets: ["latin"], variable: "--font-condensed" });

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Portfolio and writings",
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