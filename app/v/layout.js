// /v is a client component (uses query params), so metadata must live in a
// layout. Every URL here is a per-cert verification result — never indexable.
export const metadata = {
  title: "Verify — CBR Labs",
  robots: { index: false, follow: false },
};

export default function VerifyLayout({ children }) {
  return children;
}
