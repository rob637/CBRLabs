import "./globals.css";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const SITE_URL = "https://cbr-labs.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CBR Labs — Hardware Redaction for iPad & Android Tablets",
    template: "%s — CBR Labs",
  },
  description:
    "CBR Labs permanently redacts cameras, microphones, and wireless radios from iPad and Android tablets — purpose-built devices for SCIFs, courtrooms, hospitals, and correctional facilities.",
  applicationName: "CBR Labs",
  authors: [{ name: "CBR Labs LLC" }],
  keywords: [
    "hardware redaction",
    "redacted iPad",
    "camera-removed tablet",
    "SCIF iPad",
    "secure tablet",
    "no camera tablet",
    "no microphone iPad",
    "tablet hardening",
    "corrections tablet",
    "HIPAA tablet",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "CBR Labs",
    title: "CBR Labs — Hardware Redaction for iPad & Android Tablets",
    description:
      "Permanent, silicon-level removal of cameras, microphones, and wireless radios. Audit-ready documentation with every device.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CBR Labs — Hardware Redaction" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CBR Labs — Hardware Redaction",
    description: "Permanent hardware redaction for iPad and Android tablets.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F6F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E13" },
  ],
};

const themeScript = `(() => { try { const t = localStorage.getItem('theme'); const m = window.matchMedia('(prefers-color-scheme: dark)').matches; if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark'); } catch (e) {} })();`;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CBR Labs LLC",
  url: SITE_URL,
  logo: `${SITE_URL}/og.png`,
  email: "sales@cbrlabs.com",
  description:
    "Hardware redaction services — permanent removal of cameras, microphones, and wireless radios from iPad and Android tablets.",
  areaServed: "US",
  sameAs: [],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="relative flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
