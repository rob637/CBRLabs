import Link from "next/link";

// Typeset wordmark — monospaced, no decoration. Editorial, defense-industry feel.
export default function Wordmark({ small = false, href = "/" }) {
  const sizeMark = small ? "text-[11px]" : "text-[13px]";
  const content = (
    <span className="inline-flex items-baseline gap-2 leading-none">
      <span className={`font-mono font-semibold tracking-[0.18em] ${sizeMark} text-ink`}>
        CBR<span className="text-accent">·</span>LABS
      </span>
    </span>
  );
  return href ? (
    <Link href={href} className="inline-flex items-baseline" aria-label="CBR Labs — Home">
      {content}
    </Link>
  ) : content;
}
