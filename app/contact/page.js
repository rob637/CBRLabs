export const metadata = { title: "Contact — CBR Labs LLC" };
export default function Contact(){
  return(<section className="py-12 max-w-2xl">
    <h1 className="text-3xl font-bold tracking-tight">Get a Quote</h1>
    <p className="mt-4 text-slate-300">Tell us your models, quantities, and timeline. We’ll reply with scope and pricing.</p>
    <form action="mailto:sales@cbrlabs.com" method="post" encType="text/plain" className="grid gap-4 mt-6">
      <input name="name" placeholder="Your name" required className="rounded-2xl p-3 text-black"/>
      <input name="company" placeholder="Company / Organization" className="rounded-2xl p-3 text-black"/>
      <input name="email" type="email" placeholder="Work email" required className="rounded-2xl p-3 text-black"/>
      <input name="phone" type="tel" placeholder="Phone (optional)" className="rounded-2xl p-3 text-black"/>
      <textarea name="details" placeholder="Models (e.g., A2602), quantities, deadline, and any special requirements…" rows={5} className="rounded-2xl p-3 text-black"></textarea>
      <button type="submit" className="btn">Send Request</button>
      <p className="text-xs text-slate-400">By submitting, you agree we may contact you about this request.</p>
    </form>
    <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
      <img src="/images/contact.png" alt="Office desk with laptop and phone"/>
    </div>
  </section>);
}
