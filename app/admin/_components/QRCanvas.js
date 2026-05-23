"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

// Render a QR code to a <canvas>. Defaults sized for on-screen display.
export default function QRCanvas({ text, size = 160, margin = 1, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !text) return;
    QRCode.toCanvas(ref.current, text, {
      width: size,
      margin,
      errorCorrectionLevel: "M",
      color: { dark: "#0B0E13", light: "#F7F6F2" },
    }).catch(() => {});
  }, [text, size, margin]);

  return <canvas ref={ref} width={size} height={size} {...rest} />;
}

// Render to a dataURL (used for embedding in PDFs).
export async function qrDataUrl(text, opts = {}) {
  return QRCode.toDataURL(text, {
    width: 512,
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#FFFFFF" },
    ...opts,
  });
}
