"use client";

// PDF sticker sheet generator. Pure client-side: jsPDF + qrcode -> Blob download.
//
// LAYOUTS (US Letter, 8.5 x 11 inches):
//   AVERY_22805   1.5" x 1.5" square, 4 cols x 6 rows = 24/sheet  → device tags
//   AVERY_5163    4"   x 2"   shipping, 2 cols x 5 rows = 10/sheet → box / package
//
// All measurements are in inches; jsPDF set to unit="in".

import jsPDF from "jspdf";
import QRCode from "qrcode";

export const LAYOUTS = {
  AVERY_22805: {
    label: 'Avery 22805 — device tags (1.5" × 1.5", 24/sheet)',
    cols: 4, rows: 6,
    cellW: 1.5, cellH: 1.5,
    marginX: 0.81, marginY: 0.5,
    gutterX: 0.31, gutterY: 0.0,
  },
  AVERY_5163: {
    label: 'Avery 5163 — box / package (4" × 2", 10/sheet)',
    cols: 2, rows: 5,
    cellW: 4.0, cellH: 2.0,
    marginX: 0.19, marginY: 0.5,
    gutterX: 0.13, gutterY: 0.0,
  },
};

async function qrPng(text) {
  return QRCode.toDataURL(text, {
    width: 600,
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#FFFFFF" },
  });
}

/**
 * stickers: [{ url, lines: [string, ...] }, ...]
 * One entry per label slot. Pass the same entry twice to print duplicates.
 */
export async function buildStickerPDF({ layout = "AVERY_22805", stickers }) {
  const L = LAYOUTS[layout];
  if (!L) throw new Error(`unknown layout ${layout}`);
  const doc = new jsPDF({ unit: "in", format: "letter", orientation: "portrait" });

  const perPage = L.cols * L.rows;
  for (let i = 0; i < stickers.length; i++) {
    if (i > 0 && i % perPage === 0) doc.addPage();
    const slot = i % perPage;
    const col = slot % L.cols;
    const row = Math.floor(slot / L.cols);
    const x = L.marginX + col * (L.cellW + L.gutterX);
    const y = L.marginY + row * (L.cellH + L.gutterY);
    await drawSticker(doc, x, y, L, stickers[i]);
  }
  return doc.output("blob");
}

async function drawSticker(doc, x, y, L, sticker) {
  const padding = 0.08;
  const innerX = x + padding;
  const innerY = y + padding;
  const innerW = L.cellW - padding * 2;
  const innerH = L.cellH - padding * 2;

  const isWide = L.cellW > L.cellH * 1.2;
  const qrSize = isWide ? innerH : Math.min(innerW, innerH) * 0.78;

  // QR
  if (sticker.url) {
    const png = await qrPng(sticker.url);
    doc.addImage(png, "PNG", innerX, innerY + (isWide ? 0 : 0), qrSize, qrSize, undefined, "FAST");
  }

  // Text region
  const textX = isWide ? innerX + qrSize + 0.1 : innerX;
  const textY = isWide ? innerY + 0.08 : innerY + qrSize + 0.08;
  const textW = isWide ? innerW - qrSize - 0.1 : innerW;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  const lines = sticker.lines || [];
  let cursorY = textY;

  if (lines[0]) {
    const fs = isWide ? 11 : 8;
    doc.setFontSize(fs);
    doc.text(fitLine(doc, lines[0], textW), textX, cursorY + fs / 72);
    cursorY += fs / 72 + 0.04;
  }
  doc.setFont("helvetica", "normal");
  for (let i = 1; i < lines.length; i++) {
    const fs = isWide ? 9 : 6.5;
    doc.setFontSize(fs);
    doc.text(fitLine(doc, lines[i], textW), textX, cursorY + fs / 72);
    cursorY += fs / 72 + 0.03;
  }

  // Faint cut-line preview (off by default — uncomment to debug alignment)
  // doc.setDrawColor(220); doc.rect(x, y, L.cellW, L.cellH);
}

function fitLine(doc, str, maxIn) {
  const s = String(str || "");
  const w = doc.getTextWidth(s);
  if (w <= maxIn) return s;
  // crude truncation
  let lo = 0, hi = s.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (doc.getTextWidth(s.slice(0, mid) + "…") <= maxIn) lo = mid;
    else hi = mid - 1;
  }
  return s.slice(0, lo) + "…";
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
