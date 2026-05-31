import Link from "next/link";
import Reveal from "../../../components/Reveal";
import { Breadcrumbs } from "../../../components/SEO";
import { ArrowRightIcon } from "../../../components/Icons";

const SITE_URL = "https://cbr-labs.com";
const SLUG = "mdm-vs-hardware-redaction";
const TITLE = "MDM vs. hardware redaction: why a policy is not a sensor";
const PUBLISHED = "2026-05-31";
const DESCRIPTION =
  "Mobile Device Management can disable a camera. It cannot remove one. For programs where capture is not just discouraged but forbidden, the distinction matters.";

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
          <p className="mt-6 text-xl text-muted">
            {DESCRIPTION}
          </p>
        </Reveal>

        <div className="prose-cbr mt-12 space-y-6 text-[17px] leading-[1.7] text-ink/90">
          <p>
            Every few months we get the same call. A security officer at an
            agency, a hospital, or a courthouse has been told that the iPads
            their team wants to deploy can have the cameras &ldquo;turned
            off&rdquo; with a configuration profile. The vendor is confident.
            The MDM dashboard has a toggle. The auditor is not satisfied.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            What MDM actually controls
          </h2>
          <p>
            Mobile Device Management is a policy layer. It tells the
            operating system to refuse certain APIs &mdash; the camera API,
            the microphone API, the Bluetooth pairing flow. When the policy
            is in force and the device is supervised, the camera app will not
            open and third-party apps cannot capture frames. That is real
            protection against casual misuse.
          </p>
          <p>
            But the sensor is still wired to the SoC. The lens still focuses
            on whatever it is pointed at. The microphone still vibrates with
            every sound in the room. Everything between the physical world
            and the policy boundary is intact &mdash; what changes is whether
            iOS or Android chooses to expose the bits.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            Where MDM stops being enough
          </h2>
          <p>
            For most enterprises that is fine. The threat model is a careless
            user, not a hostile one, and an audit log of policy enforcement
            is sufficient evidence of control. For a narrower set of
            programs, it is not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>SCIFs and SAPFs</strong> under ICD 705 prohibit
              recording-capable devices in controlled space. The rule is
              about the hardware, not the configuration of the hardware.
            </li>
            <li>
              <strong>Corrections</strong> programs cannot allow inmate
              tablets to image documents, photograph officers, or transmit on
              any wireless band. The threat actor here is the device&rsquo;s
              own user.
            </li>
            <li>
              <strong>Operating rooms, behavioral health units, jury rooms,
              and grand-jury chambers</strong> prohibit ambient capture as a
              matter of law or professional ethics. &ldquo;The camera is
              disabled in MDM&rdquo; is not a defense against a HIPAA
              complaint or a mistrial motion.
            </li>
            <li>
              <strong>Insider-risk and IP-sensitive labs</strong> where the
              question is not &ldquo;will the device record by
              accident?&rdquo; but &ldquo;can the device be made to record
              deliberately?&rdquo;
            </li>
          </ul>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            The failure modes of a software-only control
          </h2>
          <p>
            A policy can fail in five quiet ways: an OS update changes API
            semantics; a supervision profile is removed during a wipe; a
            jailbreak or a profile-bypass exploit lands on the OS version
            you&rsquo;re on; a user enrolls in a personal Apple ID flow that
            edits the profile chain; a device falls out of MDM check-in and
            stays there. Most are unlikely on any given day. All of them
            have happened to someone&rsquo;s fleet.
          </p>
          <p>
            None of them can happen to a device whose camera module is no
            longer on the board.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            What hardware redaction adds
          </h2>
          <p>
            Hardware redaction is mechanical. The camera sensor, the
            microphone capsule, the Wi-Fi radio die, the cellular modem
            &mdash; whichever components the program requires &mdash; are
            physically removed from the board. Antenna runs are cut. Acoustic
            ports are sealed. The device is finished cosmetically and
            verified inert.
          </p>
          <p>
            The deliverable is not a configuration; it is a piece of evidence.
            Every device ships with a serial-numbered{" "}
            <Link href="/security/" className="text-accent underline-offset-4 hover:underline">
              Certificate of Redaction
            </Link>
            , before/after photography, and a chain of custody from receipt
            to return. An auditor does not have to trust the vendor or the
            OS. They can look at the photos.
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            When to combine the two
          </h2>
          <p>
            Hardware redaction and MDM are not alternatives &mdash; they are
            different layers. We typically see customers redact the
            components that absolutely cannot exist on the device (cameras
            and microphones for SCIFs; cameras and cellular for corrections
            tablets), then continue to manage configuration, app inventory,
            and remote wipe through their existing MDM. The redaction
            handles the question &ldquo;what is physically possible?&rdquo;
            MDM handles &ldquo;what is the user allowed to do with what
            remains?&rdquo;
          </p>

          <h2 className="font-display text-2xl font-medium tracking-tight pt-6">
            A simple test
          </h2>
          <p>
            If you can answer the question &ldquo;what happens if the OS
            ships an update tomorrow that changes how the camera API is
            gated?&rdquo; with &ldquo;nothing &mdash; there is no camera in
            the device&rdquo;, you are operating with hardware redaction. If
            the answer involves a configuration profile, a supervision
            check, or a vendor patch, you are operating with policy. Both
            are valid choices. They are not the same choice.
          </p>
        </div>

        <div className="mt-16 surface p-10 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight">
              Talk through a program
            </h2>
            <p className="mt-2 text-muted max-w-md">
              Single units to fleet rollouts. We&rsquo;ll quote on the
              configuration that matches your auditor, not ours.
            </p>
          </div>
          <Link href="/contact/" className="btn-accent px-6 py-3 text-[13px] shrink-0">
            Request a quote <ArrowRightIcon size={16} />
          </Link>
        </div>
      </article>
    </>
  );
}
