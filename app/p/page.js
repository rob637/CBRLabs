// Public proposal viewer at /p?t=TOKEN — no admin chrome, no Access required.
import { Suspense } from "react";
import ProposalViewer from "./Viewer";

export const metadata = { title: "Proposal — CBR Labs" };

export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-muted">Loading…</div>}>
      <ProposalViewer />
    </Suspense>
  );
}
