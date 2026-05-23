import AdminShell from "./_components/AdminShell";

export const metadata = {
  title: { default: "Admin · CBR Labs", template: "%s · CBR Admin" },
  description: "Internal — inventory, chain of custody, invoicing.",
  robots: { index: false, follow: false },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CBR Admin",
  },
};

export const viewport = {
  themeColor: "#0B0E13",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
