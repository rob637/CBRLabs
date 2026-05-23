// Minimal Lucide-style line icons. Strokes inherit currentColor.
// 20x20 viewBox, 1.5 stroke — chosen for editorial weight at body text size.

function Base({ children, size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function CameraIcon(props) {
  return (
    <Base {...props}>
      <path d="M3 6.5h2l1.2-1.8h7.6L15 6.5h2v9H3z" />
      <circle cx="10" cy="11" r="3" />
      <path d="M3 3l14 14" />
    </Base>
  );
}

export function MicIcon(props) {
  return (
    <Base {...props}>
      <rect x="7.5" y="2.5" width="5" height="9" rx="2.5" />
      <path d="M5 9.5a5 5 0 0010 0" />
      <path d="M10 14.5v3" />
      <path d="M3 3l14 14" />
    </Base>
  );
}

export function RadioIcon(props) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="1.4" />
      <path d="M6.5 6.5a5 5 0 000 7M13.5 6.5a5 5 0 010 7" />
      <path d="M4 4a8.5 8.5 0 000 12M16 4a8.5 8.5 0 010 12" />
      <path d="M3 3l14 14" />
    </Base>
  );
}

export function CertIcon(props) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="14" height="11" rx="1.5" />
      <path d="M6 6.5h8M6 9h8M6 11.5h5" />
      <path d="M13 15l1.2 2.5L16 16l1.8 1.5L17 14" />
    </Base>
  );
}

export function ShieldIcon(props) {
  return (
    <Base {...props}>
      <path d="M10 2.5l6.5 2v5c0 4-3 6.8-6.5 8-3.5-1.2-6.5-4-6.5-8v-5z" />
      <path d="M7.5 10l2 2 3-4" />
    </Base>
  );
}

export function ScaleIcon(props) {
  return (
    <Base {...props}>
      <path d="M10 3v14M5 17h10" />
      <path d="M5 5l-2 5h4z" />
      <path d="M15 5l-2 5h4z" />
      <path d="M5 5h10" />
    </Base>
  );
}

export function HospitalIcon(props) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="14" height="12" rx="1" />
      <path d="M10 8v6M7 11h6" />
      <path d="M3 5l7-3 7 3" />
    </Base>
  );
}

export function FactoryIcon(props) {
  return (
    <Base {...props}>
      <path d="M3 17V8l5 3V8l5 3V8l4 9z" />
      <path d="M6 14h2M10 14h2M14 14h2" />
    </Base>
  );
}

export function BuildingIcon(props) {
  return (
    <Base {...props}>
      <rect x="4" y="3" width="12" height="14" rx="1" />
      <path d="M7 6h2M11 6h2M7 9h2M11 9h2M7 12h2M11 12h2" />
      <path d="M9 17v-3h2v3" />
    </Base>
  );
}

export function CapIcon(props) {
  return (
    <Base {...props}>
      <path d="M2 8l8-3.5L18 8l-8 3.5z" />
      <path d="M5 9.5V13c0 1.5 2.5 2.5 5 2.5s5-1 5-2.5V9.5" />
      <path d="M18 8v4.5" />
    </Base>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Base {...props}>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </Base>
  );
}

export function CheckIcon(props) {
  return (
    <Base {...props}>
      <path d="M4 10.5l4 4 8-9" />
    </Base>
  );
}

export function SunIcon(props) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="3.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4" />
    </Base>
  );
}

export function MoonIcon(props) {
  return (
    <Base {...props}>
      <path d="M16 11.5A6.5 6.5 0 018.5 4a6.5 6.5 0 107.5 7.5z" />
    </Base>
  );
}

export function MenuIcon(props) {
  return (
    <Base {...props}>
      <path d="M3 6h14M3 10h14M3 14h14" />
    </Base>
  );
}

export function CloseIcon(props) {
  return (
    <Base {...props}>
      <path d="M5 5l10 10M15 5L5 15" />
    </Base>
  );
}
