"use client";

export default function PageHeader({ eyebrow, title, sub, actions }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          {title}
        </h1>
        {sub ? <p className="mt-2 text-sm text-muted">{sub}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
