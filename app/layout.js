import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundOrbs from "../components/BackgroundOrbs";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  title: "CBR Labs — Hardware Redaction for iPad & Android Tablets",
  description:
    "CBR Labs permanently redacts cameras, microphones, and wireless radios from iPad and Android tablets — purpose-built devices for the world's most security-sensitive environments.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafc" },
    { media: "(prefers-color-scheme: dark)", color: "#060a16" },
  ],
};

const themeScript = `(() => { try { const t = localStorage.getItem('theme'); const m = window.matchMedia('(prefers-color-scheme: dark)').matches; if (t === 'dark' || (!t && m)) document.documentElement.classList.add('dark'); } catch (e) {} })();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">
        <BackgroundOrbs />
        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
