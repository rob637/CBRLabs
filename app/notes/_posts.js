// Single source of truth for the /notes/ index, sitemap, and RSS feed.
// Newest first. When you add a post, add a row here.

export const SITE_URL = "https://cbr-labs.com";

export const posts = [
  {
    slug: "hipaa-ambient-capture-bedside-tablet",
    title: "HIPAA, ambient capture, and the tablet at the bedside",
    date: "2026-05-31",
    excerpt:
      "A tablet with a live microphone in a patient room is a HIPAA exposure even when no app is listening. Why ambient capture is the quiet risk in healthcare tablet programs.",
    readingMinutes: 7,
  },
  {
    slug: "icd-705-tablets-scif",
    title: "ICD 705 and tablets: what's actually allowed in a SCIF",
    date: "2026-05-31",
    excerpt:
      "ICD 705 doesn’t list iPads by name. It governs what can record, transmit, or geolocate inside a SCIF. Here’s how that translates to a tablet you’d want to bring inside.",
    readingMinutes: 7,
  },
  {
    slug: "what-is-in-a-certificate-of-redaction",
    title: "What's actually in a Certificate of Redaction",
    date: "2026-05-31",
    excerpt:
      "An auditor asks: what does CBR Labs ship with each redacted tablet? A field-by-field walkthrough of the certificate and the evidence packet behind it.",
    readingMinutes: 6,
  },
  {
    slug: "mdm-vs-hardware-redaction",
    title: "MDM vs. hardware redaction: why a policy is not a sensor",
    date: "2026-05-31",
    excerpt:
      "Mobile Device Management can disable a camera. It cannot remove one. For programs where capture is not just discouraged but forbidden, the distinction matters.",
    readingMinutes: 6,
  },
];
