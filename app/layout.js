import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "CBR Labs LLC — Secure iPad Hardening",
  description: "We remove cameras, microphones, and wireless radios from iPads for high-security environments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container-lg">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
