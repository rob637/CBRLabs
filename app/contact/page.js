import Reveal from "../../components/Reveal";

export const metadata = { title: "Contact — CBR Labs LLC" };

const inputClass =
  "mt-1 w-full rounded-2xl border border-slate-900/10 bg-white/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500";

export default function Contact() {
  return (
    <section className="container-xl pt-16 pb-24">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal><div className="chip">Talk to us</div></Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
              Get a <span className="text-gradient">quote</span>.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-400">
              Share your models, quantities, and timeline. We'll respond with a scoped proposal — typically within one business day.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 glass p-6">
              <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Direct</div>
              <div className="mt-2 text-sm">
                <a href="mailto:sales@cbrlabs.com" className="hover:underline">sales@cbrlabs.com</a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <form
            action="mailto:sales@cbrlabs.com"
            method="post"
            encType="text/plain"
            className="glass-strong grid gap-3 p-7"
          >
            <label className="text-xs text-slate-600 dark:text-slate-400">
              Name
              <input name="name" required placeholder="Your name" className={inputClass} />
            </label>
            <label className="text-xs text-slate-600 dark:text-slate-400">
              Company / Organization
              <input name="company" placeholder="Company" className={inputClass} />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-slate-600 dark:text-slate-400">
                Work email
                <input name="email" type="email" required placeholder="you@org.com" className={inputClass} />
              </label>
              <label className="text-xs text-slate-600 dark:text-slate-400">
                Phone (optional)
                <input name="phone" type="tel" placeholder="(555) 555‑5555" className={inputClass} />
              </label>
            </div>
            <label className="text-xs text-slate-600 dark:text-slate-400">
              Project details
              <textarea
                name="details"
                rows={5}
                placeholder="Models (e.g., A2602), quantities, deadline, special requirements…"
                className={inputClass}
              />
            </label>
            <button type="submit" className="btn-gradient mt-2 py-3">Send request →</button>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              By submitting, you agree we may contact you about this request.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
