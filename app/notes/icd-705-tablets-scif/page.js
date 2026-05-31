import Link from "next/link";
import Reveal from "../../../components/Reveal";
import { Breadcrumbs } from "../../../components/SEO";
import { ArrowRightIcon } from "../../../components/Icons";

const SITE_URL = "https://cbr-labs.com";
const SLUG = "icd-705-tablets-scif";
const TITLE = "ICD 705 and tablets: what's actually allowed in a SCIF";
const PUBLISHED = "2026-05-31";
const DESCRIPTION =
  "ICD 705 doesn't list iPads by name. It governs what can record, transmit, or geolocate inside a SCIF. Here's how that translates to a tablet you'd want to bring inside.";

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
            This is not legal advice. ICD 705 and its Technical
            Specifications (the &ldquo;Tech Spec&rdquo;) are ODNI policy
            and the accrediting authority on your program is the people
            who say yes or no. What follows is how the policy text tends
            to be applied to tablets in practice, and what tablet
            configurations get an easy yes.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            What ICD 705 actually says about devices
          </h2>
          <p>
            ICD 705 is the directive that governs the physical and
            technical security of SCIFs. The portion that matters for
            tablets is the prohibition on personally owned and
            portable electronic devices (PEDs) capable of recording or
            transmitting inside the SCIF perimeter. The Tech Spec
            elaborates: cameras, microphones, cellular radios, Wi-Fi,
            Bluetooth, and GPS are all controlled. A device that can do
            any of them is, by default, not coming in.
          </p>
          <p>
            The accreditor can grant exceptions for mission-essential
            devices. In practice the exception requires either: (a) the
            capability is verifiably disabled at the hardware level, or
            (b) the device is government-furnished and managed under a
            specific approval. Software disablement is usually not
            sufficient on its own.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            Why &ldquo;turned off in MDM&rdquo; rarely clears the bar
          </h2>
          <p>
            An accreditor&rsquo;s job is to assume bad outcomes. A
            configuration profile can be edited, a supervision channel
            can drop, an OS update can change API semantics. None of
            those scenarios are likely on any given Tuesday, and all of
            them are easier to explain than a recording incident inside
            a SCIF. Hardware redaction collapses the question:{" "}
            <Link href="/notes/mdm-vs-hardware-redaction/" className="text-accent underline-offset-4 hover:underline">
              the camera is not on the board
            </Link>
            , so there is no scenario in which the camera records.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            A tablet configuration that tends to clear ICD 705 review
          </h2>
          <p>
            We aren&rsquo;t a SCIF accreditor and your accreditor will
            have the final word. That said, the configuration that
            customers most often deploy under ICD 705 review is:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>All cameras</strong> physically removed (front,
              rear, accessory). Apertures sealed and refinished.
            </li>
            <li>
              <strong>All microphones</strong> physically removed.
              Acoustic ports sealed.
            </li>
            <li>
              <strong>Cellular modem</strong> removed (LTE / 5G).
              Cellular SIM tray sealed.
            </li>
            <li>
              <strong>GPS</strong> removed.
            </li>
            <li>
              <strong>Wi-Fi and Bluetooth</strong>: removed or retained
              based on whether your SCIF allows a controlled WLAN. If
              not, both go.
            </li>
            <li>
              <strong>Speakers</strong>: program preference. Some
              accreditors require silent operation; others allow
              speaker output.
            </li>
            <li>
              <strong>Documentation</strong>: a serial-numbered{" "}
              <Link href="/notes/what-is-in-a-certificate-of-redaction/" className="text-accent underline-offset-4 hover:underline">
                Certificate of Redaction
              </Link>{" "}
              and an evidence packet of per-stage photography, retained
              for the life of the program.
            </li>
          </ul>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            What the accreditor is going to ask
          </h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Where was the work performed, and by whom.</li>
            <li>What is the chain of custody from purchase to deployment.</li>
            <li>What is the visual indicator that this is a redacted unit, not an unmodified one.</li>
            <li>How will you re-verify inert state during periodic inspections.</li>
            <li>What is the procedure if a device is lost, stolen, or returned for repair.</li>
          </ol>
          <p>
            None of these are trick questions. They&rsquo;re the same
            questions every accreditor asks about every PED. A
            redaction vendor that can&rsquo;t answer them on the spot
            is the wrong vendor.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            One more thing about Apple
          </h2>
          <p>
            Apple does not certify or authorize hardware redaction.
            Neither does Samsung or Google. CBR Labs is an independent
            service provider. The redaction voids the remaining
            manufacturer warranty. We disclose this on every quote
            because the accreditor will ask and procurement will need
            to see it acknowledged.
          </p>
        </div>

        <div className="mt-16 surface p-10 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight">
              Discuss a SCIF deployment
            </h2>
            <p className="mt-2 text-muted max-w-md">
              We&rsquo;ll scope to your accreditor&rsquo;s preferences
              and quote a configuration you can defend in a review.
            </p>
          </div>
          <Link href="/contact/" className="btn-accent px-6 py-3 text-[13px] shrink-0">
            Talk to us <ArrowRightIcon size={16} />
          </Link>
        </div>
      </article>
    </>
  );
}
