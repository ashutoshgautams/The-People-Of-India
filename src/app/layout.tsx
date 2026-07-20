import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsentBanner from "@/components/ConsentBanner";

// Characterful serif for display headlines, quiet grotesk for body.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

const SITE_URL = "https://thepeopleofindia.org";
const DESCRIPTION =
  "Independent, non-profit, open-source journalism. On-ground reporting of what's really happening to real people in India. Neither left nor right - never for sale.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The People of India - Neither Left, Nor Right. Never for Sale.",
    template: "%s - The People of India",
  },
  description: DESCRIPTION,
  keywords: [
    "India news",
    "independent journalism India",
    "citizen journalism",
    "non-profit media",
    "unbiased news India",
    "ground reports India",
    "open source journalism",
    "neither left nor right",
  ],
  authors: [{ name: "The People of India" }],
  category: "news",
  icons: { icon: "/emblem.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "The People of India",
    title: "The People of India - Neither Left, Nor Right. Never for Sale.",
    description: DESCRIPTION,
    locale: "en_IN",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 1026,
        alt: "The People of India - independent, non-profit, open-source journalism",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The People of India - Neither Left, Nor Right. Never for Sale.",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Applies the stored theme before first paint - no flash of wrong theme.
// Light is the default; dark only when explicitly chosen.
const themeInit = `try{var t=localStorage.getItem("tpi-theme");document.documentElement.classList.add(t==="dark"?"dark":"light")}catch(e){document.documentElement.classList.add("light")}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <div className="page-wash" aria-hidden />
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <ConsentBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
