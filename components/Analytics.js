"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";
const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "";

// Paths we never measure: admin app (behind Access) and token-bearing viewers.
function isExcluded(pathname) {
  if (!pathname) return false;
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/p") ||
    pathname.startsWith("/v")
  );
}

export default function Analytics() {
  const pathname = usePathname();
  if (!GA_ID && !ADS_ID) return null;
  if (isExcluded(pathname)) return null;

  const primary = GA_ID || ADS_ID;
  const init =
    `window.dataLayer = window.dataLayer || [];` +
    `function gtag(){dataLayer.push(arguments);}` +
    `window.gtag = gtag;` +
    `gtag('js', new Date());` +
    (GA_ID ? `gtag('config', '${GA_ID}', { anonymize_ip: true });` : "") +
    (ADS_ID ? `gtag('config', '${ADS_ID}');` : "");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primary}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {init}
      </Script>
    </>
  );
}

// Helper for one-off conversion / event tracking from client components.
//   import { trackEvent } from "../../components/Analytics";
//   trackEvent("generate_lead", { value: 1, currency: "USD" });
// For Google Ads conversions:
//   trackEvent("conversion", { send_to: "AW-XXXX/LABEL" });
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
