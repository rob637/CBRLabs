import Link from "next/link";
import Reveal from "../../../components/Reveal";
import { Breadcrumbs } from "../../../components/SEO";
import { ArrowRightIcon } from "../../../components/Icons";

const SITE_URL = "https://cbr-labs.com";
const SLUG = "what-is-in-a-certificate-of-redaction";
const TITLE = "What's actually in a Certificate of Redaction";
const PUBLISHED = "2026-05-31";
const DESCRIPTION =
  "An auditor asks: what does CBR Labs ship with each redacted tablet? A field-by-field walkthrough of the Certificate of Redaction and the evidence packet behind it.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `/notes/${SLUG}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: `${SITE_URL}/notes/${SLUG}/`,
    publishedTime: PUBLISHED,
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  datePublished: PUBLISHED,
  dateModified: PUBLISHED,
  author: { "@type": "Organization", name: "CBR Labs LLC", url: SITE_URL },
  publisher: { "@id": `${SITE_URL}#organization` },
  mainEntityOfPage: `${SITE_URL}/notes/${SLUG}/`,
  image: `${SITE_URL}/og.png`,
};

export default function Post() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Notes", path: "/notes/" },
          { name: TITLE, path: `/notes/${SLUG}/` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="container-xl pt-20 pb-16 max-w-3xl">
        <Reveal>
          <div className="eyebrow">
            <Link href="/notes/" className="hover:text-ink">Notes</Link> ·{" "}
            <time dateTime={PUBLISHED}>{PUBLISHED}</time>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-6 font-display text-4xl font-medium leading-[1.05] tracking-tightest sm:text-5xl">
            {TITLE}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-6 text-xl text-muted">{DESCRIPTION}</p>
        </Reveal>

        <div className="prose-cbr mt-12 space-y-6 text-[17px] leading-[1.7] text-ink/90">
          <p>
            &ldquo;What proves it&rdquo; is the question we get most often
            from compliance teams. The answer is a single sheet of paper
            (and a folder of evidence behind it) that travels with the
            device for the life of the program. We call it the Certificate
            of Redaction.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            The certificate, field by field
          </h2>
          <p>
            Every certificate is one page, signed in wet ink, and tied to a
            single serial number. The fields are deliberately boring:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Device identity.</strong> Make, model, model number,
              and manufacturer serial number. For Apple devices, also the
              IMEI(s) where present pre-redaction.
            </li>
            <li>
              <strong>Order reference.</strong> The customer&rsquo;s PO or
              contract number, the date received, and the date completed.
            </li>
            <li>
              <strong>Scope of work.</strong> A line per component removed:
              front camera, rear camera, primary microphone, secondary
              microphone, speakers, Wi-Fi radio, Bluetooth controller,
              cellular modem, GPS, NFC, UWB &mdash; whichever applied to
              this unit&rsquo;s scope.
            </li>
            <li>
              <strong>Method.</strong> For each line, the technique used:
              die removal, controller removal, trace cut, antenna severance,
              port seal. Auditors care about the verb.
            </li>
            <li>
              <strong>Verification.</strong> What we tested to confirm
              inert: e.g. &ldquo;Wi-Fi: scanned 2.4&nbsp;GHz and
              5&nbsp;GHz, no association attempted; OS reports no Wi-Fi
              hardware.&rdquo;
            </li>
            <li>
              <strong>Technician.</strong> The badge ID of the person who
              performed the work and the badge ID of the QA reviewer. Both
              are background-checked staff.
            </li>
            <li>
              <strong>Chain of custody.</strong> A reference to the COC
              packet ID. Receipt signature, work-area entry/exit times,
              and shipment signature are all in the packet.
            </li>
            <li>
              <strong>Disclosures.</strong> One sentence on warranty impact
              and one on the independent-service-provider posture
              (Apple/Samsung/Google are not affiliated). Procurement
              auditors expect to see this.
            </li>
          </ul>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            The evidence packet
          </h2>
          <p>
            The certificate is a summary. The evidence packet is the
            substance. For each device, the packet contains:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Photos at four stages</strong>: intake (sealed, with
              tamper-evident label), pre-redaction (open, with serial
              visible), post-redaction (open, with each removal area
              visible), and final pack (closed, in shipping protection).
            </li>
            <li>
              <strong>Per-component close-ups</strong> for any line item
              that the customer&rsquo;s scope flagged as
              audit-significant. A camera removal that matters to a SCIF
              accreditor gets its own close-up. A speaker removal
              typically does not.
            </li>
            <li>
              <strong>Signed COC log</strong>: receipt, work-area entry,
              redaction completion, QA, pack, ship.
            </li>
            <li>
              <strong>Hash manifest</strong> of the photo set so the
              packet can be re-verified later without trusting our
              filesystem.
            </li>
          </ul>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            What it deliberately does <em>not</em> contain
          </h2>
          <p>
            The certificate is not a configuration report. It does not
            list installed apps, MDM enrollment status, or iOS version.
            Those are runtime properties; they change. The certificate
            documents a permanent physical change. Mixing the two
            confuses what was redacted with what is configured, and
            auditors notice.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            How customers use it
          </h2>
          <p>
            For most programs the certificate lives in the asset record
            and the photos live in the evidence vault. For SCIF
            accreditation packages, the certificate goes in the SSP/IS
            appendix and the photos go in the artifact binder. For
            healthcare, the disclosure paragraph goes in the BAA
            attachment. Same artifact, different homes.
          </p>
          <p>
            If you want a redacted (no pun intended) sample of the
            certificate and a representative evidence packet,{" "}
            <Link href="/contact/" className="text-accent underline-offset-4 hover:underline">
              ask for one
            </Link>
            . We email it within a business day &mdash; anonymized, no
            real serials.
          </p>
        </div>

        <div className="mt-16 surface p-10 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight">
              See a real sample
            </h2>
            <p className="mt-2 text-muted max-w-md">
              Email us and we&rsquo;ll send an anonymized certificate and
              evidence packet so your auditor can review the format
              before you commit.
            </p>
          </div>
          <Link href="/contact/" className="btn-accent px-6 py-3 text-[13px] shrink-0">
            Request sample <ArrowRightIcon size={16} />
          </Link>
        </div>
      </article>
    </>
  );
}
