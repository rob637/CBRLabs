import Image from "next/image";
import Reveal from "../../components/Reveal";
import { ArrowRightIcon } from "../../components/Icons";

export const metadata = {
  title: "Contact",
  description:
    "Request a quote, book a scoping call, or send an RFP. Typical response time: one business day.",
  alternates: { canonical: "/contact" },
};

const inputClass =
  "mt-1 w-full rounded-xl border bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent hairline";

export default function Contact() {
  return (
    <>
      <section className="container-xl pt-16 pb-10">
        <Reveal>
          <figure className="brand-figure aspect-[21/8] sm:aspect-[21/7]">
            <Image
              src="/images/contact.jpg"
              alt="CBR Labs facility corridor — quiet, controlled, and secured."
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
            <figcaption className="brand-figure-caption">US-based facility</figcaption>
          </figure>
        </Reveal>
      </section>

      <section className="container-xl pb-24">
        <div className="grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal><div className="eyebrow">Talk to us</div></Reveal>
          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-5xl font-medium tracking-tightest sm:text-7xl">
              Three ways to <span className="text-accent">start.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-lg text-muted">
              Tell us the platform, models, quantities, and deadline. We respond
              with a scoped, fixed-price proposal — typically within one business day.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <ul className="mt-10 divide-y hairline border-y">
              <li className="py-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">01 — Quote request</div>
                <div className="mt-1 text-ink">Use the form on the right.</div>
              </li>
              <li className="py-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">02 — RFP / RFI response</div>
                <div className="mt-1 text-ink">Email <a href="mailto:sales@cbrlabs.com" className="text-accent underline-offset-4 hover:underline">sales@cbrlabs.com</a> with your document.</div>
              </li>
              <li className="py-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">03 — Direct</div>
                <div className="mt-1 text-ink"><a href="mailto:sales@cbrlabs.com" className="text-accent underline-offset-4 hover:underline">sales@cbrlabs.com</a></div>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:col-span-7">
          <form
            action="mailto:sales@cbrlabs.com"
            method="post"
            encType="text/plain"
            className="surface grid gap-4 p-7"
          >
            <label className="text-xs text-muted">
              Name
              <input name="name" required placeholder="Your name" className={inputClass} />
            </label>
            <label className="text-xs text-muted">
              Company / Organization
              <input name="company" placeholder="Company" className={inputClass} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs text-muted">
                Work email
                <input name="email" type="email" required placeholder="you@org.com" className={inputClass} />
              </label>
              <label className="text-xs text-muted">
                Phone (optional)
                <input name="phone" type="tel" placeholder="(555) 555-5555" className={inputClass} />
              </label>
            </div>
            <label className="text-xs text-muted">
              Project details
              <textarea
                name="details"
                rows={6}
                placeholder="Platform (iPad / Android), models (e.g., A2602, Galaxy Tab S9), quantities, deadline, deployment environment, special requirements…"
                className={inputClass}
              />
            </label>
            <button type="submit" className="btn-accent mt-2 py-3 text-[13px]">
              Send request <ArrowRightIcon size={16} />
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              By submitting, you agree we may contact you about this request.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
    </>
  );
}
