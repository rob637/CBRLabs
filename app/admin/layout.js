import AdminShell from "./_components/AdminShell";

export const metadata = {
  title: "Admin · CBR Labs",
  description: "Internal — inventory, chain of custody, invoicing.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
