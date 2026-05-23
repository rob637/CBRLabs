import Image from "next/image";
import Reveal from "../../components/Reveal";
import { CheckIcon } from "../../components/Icons";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Talk to Rob Pfleghardt at CBR Labs about hardware redaction for iPad and Android tablets. SAM.gov registered. Typical response: one business day.",
  alternates: { canonical: "/contact" },
};

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
            <figcaption className="brand-figure-caption">US-based facility · Alexandria, VA</figcaption>
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

            <Reveal delay={200}>
              <div className="mt-8 surface p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Direct contact</div>
                <div className="mt-3 font-display text-xl tracking-tight">Rob Pfleghardt</div>
                <div className="mt-3 grid gap-2 text-sm">
                  <a href="mailto:rob@cbr-labs.com" className="text-ink hover:text-accent">rob@cbr-labs.com</a>
                  <a href="tel:+17036238835" className="text-ink hover:text-accent">703-623-8835</a>
                </div>
                <div className="mt-4 text-sm text-muted">
                  CBR Labs LLC<br />
                  5927 Tilbury Road<br />
                  Alexandria, VA 22310
                </div>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <ul className="mt-8 divide-y hairline border-y">
                <li className="py-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">01 — Quote request</div>
                  <div className="mt-1 text-ink">Use the form on the right.</div>
                </li>
                <li className="py-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">02 — RFP / RFI response</div>
                  <div className="mt-1 text-ink">
                    Email <a href="mailto:rob@cbr-labs.com" className="text-accent underline-offset-4 hover:underline">rob@cbr-labs.com</a> with your document.
                  </div>
                </li>
                <li className="py-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">03 — Phone</div>
                  <div className="mt-1 text-ink">
                    <a href="tel:+17036238835" className="text-accent underline-offset-4 hover:underline">703-623-8835</a>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-8 chip-accent">
                <CheckIcon size={12} /> SAM.gov registered · CAGE 14Y35
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="lg:col-span-7">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
