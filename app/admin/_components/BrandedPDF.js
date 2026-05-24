"use client";

// Shared branded PDF utilities (jsPDF). Used by invoice, cert, and proposal
// generators. All branded docs flow through `newBrandedDoc` for consistent
// "CBR LABS" letterhead with federal credentials.

import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export const COMPANY = {
  name: "CBR Labs LLC",
  tagline: "Hardware Redaction for iPad & Android Tablets",
  email: "rob@cbr-labs.com",
  phone: "703-623-8835",
  address: "5927 Tilbury Rd, Alexandria, VA 22310",
  cage: "14Y35",
  uei: "K4MZG4KC1MY9",
  duns: "144834451",
  site: "cbr-labs.com",
};

const COPPER = [199, 107, 58];
const INK    = [11, 14, 19];
const MUTED  = [110, 115, 122];
const RULE   = [228, 226, 220];

/** Create a Letter-size jsPDF and stamp the CBR header. */
export function newBrandedDoc({ docKind, docNumber }) {
  const doc = new jsPDF({ unit: "in", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const M = 0.6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...INK);
  doc.text("CBR LABS", M, 0.85);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(COMPANY.tagline.toUpperCase(), M, 1.05, { charSpace: 0.02 });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text((docKind || "").toUpperCase(), W - M, 0.85, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(docNumber || "", W - M, 1.05, { align: "right" });

  doc.setDrawColor(...COPPER);
  doc.setLineWidth(0.015);
  doc.line(M, 1.2, W - M, 1.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(COMPANY.name, M, 1.4);
  doc.text(COMPANY.address, M, 1.55);
  doc.text(`${COMPANY.email}  ·  ${COMPANY.phone}  ·  ${COMPANY.site}`, M, 1.7);

  const right = W - M;
  doc.text(`CAGE     ${COMPANY.cage}`, right, 1.4, { align: "right" });
  doc.text(`SAM UEI  ${COMPANY.uei}`, right, 1.55, { align: "right" });
  doc.text(`Woman Owned Small Business`, right, 1.7, { align: "right" });

  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.005);
  doc.line(M, 1.9, W - M, 1.9);

  return { doc, W, M, y: 2.1 };
}

export function brandedFooter(doc, opts = {}) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 0.6;
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.005);
  doc.line(M, H - 0.6, W - M, H - 0.6);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(`${COMPANY.name}  ·  ${COMPANY.address}  ·  ${COMPANY.email}`, M, H - 0.4);
  doc.text(opts.confidential ? "Confidential — for recipient use only" : "", M, H - 0.25);
  doc.text(`Page ${doc.getNumberOfPages()}`, W - M, H - 0.25, { align: "right" });
}

export const money = (cents) =>
  `$${((cents || 0) / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function daysBetween(a, b) {
  try {
    const d1 = new Date(a + "T00:00:00Z");
    const d2 = new Date(b + "T00:00:00Z");
    const ms = d2.getTime() - d1.getTime();
    if (!isFinite(ms)) return null;
    return Math.max(0, Math.round(ms / 86400000));
  } catch { return null; }
}

/** Two-column meta block. */
export function metaBlock(doc, rows, { x, y, w, lineHeight = 0.22 }) {
  doc.setFontSize(8);
  for (const r of rows) {
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.text(r.label.toUpperCase(), x, y);
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.text(r.value || "—", x + w, y, { align: "right" });
    y += lineHeight;
  }
  return y;
}

export function lineTable(doc, lines, { y, M, W }) {
  const colDesc = M;
  const colQty  = W - M - 2.4;
  const colUnit = W - M - 1.4;
  const colAmt  = W - M;

  doc.setFillColor(245, 244, 240);
  doc.rect(M, y, W - M * 2, 0.36, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("DESCRIPTION", colDesc + 0.1, y + 0.23);
  doc.text("QTY",   colQty, y + 0.23, { align: "right" });
  doc.text("UNIT",  colUnit, y + 0.23, { align: "right" });
  doc.text("AMOUNT", colAmt - 0.05, y + 0.23, { align: "right" });
  y += 0.52;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  for (const l of lines) {
    const wrapped = doc.splitTextToSize(l.description || "", colQty - colDesc - 0.2);
    const lineH = Math.max(0.28, wrapped.length * 0.18);
    doc.text(wrapped, colDesc + 0.1, y);
    doc.text(String(l.quantity ?? 1), colQty, y, { align: "right" });
    doc.text(money(l.unit_price_cents), colUnit, y, { align: "right" });
    doc.text(money(l.amount_cents), colAmt - 0.05, y, { align: "right" });
    y += lineH + 0.1;
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.003);
    doc.line(M, y - 0.06, W - M, y - 0.06);
  }
  return y + 0.15;
}

export function totalsBlock(doc, rows, { y, W, M }) {
  doc.setFontSize(10);
  const labelX = W - M - 1.5;
  const valX   = W - M - 0.05;
  for (const r of rows) {
    doc.setFont("helvetica", r.bold ? "bold" : "normal");
    doc.setTextColor(...(r.bold ? INK : MUTED));
    doc.text(r.label.toUpperCase(), labelX, y, { align: "right" });
    doc.setTextColor(...INK);
    doc.text(r.value, valX, y, { align: "right" });
    y += r.bold ? 0.3 : 0.24;
  }
  return y;
}

export async function drawQR(doc, text, x, y, size = 1.1) {
  const dataUrl = await QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 0,
    scale: 8,
  });
  doc.addImage(dataUrl, "PNG", x, y, size, size);
}

export function downloadDoc(doc, filename) {
  doc.save(filename);
}

// ---------- Specific doc generators ----------

export function buildInvoicePDF({ invoice, customer, lines, paid_cents }) {
  const { doc, W, M, y: y0 } = newBrandedDoc({
    docKind: "Invoice",
    docNumber: invoice.invoice_number || `#${invoice.id}`,
  });
  let y = y0;
  const paid = paid_cents ?? invoice.paid_cents ?? 0;

  // Bill To (left column)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("BILL TO", M, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(customer?.name || "\u2014", M, y + 0.28);

  let billY = y + 0.5;
  if (customer?.org && customer.org !== customer.name) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text(String(customer.org), M, billY);
    billY += 0.2;
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  if (customer?.billing_address) {
    const addrLines = String(customer.billing_address).split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    for (const ln of addrLines) {
      doc.text(ln, M, billY);
      billY += 0.17;
    }
  }
  if (customer?.email) {
    doc.text(customer.email, M, billY);
    billY += 0.17;
  }
  if (customer?.phone) {
    doc.text(customer.phone, M, billY);
    billY += 0.17;
  }

  // Meta block (right column) — Net 30 is canonical. Due date is always computed
  // from issue date so it stays consistent regardless of what was stored.
  let dueDisplay = invoice.due_date || "";
  if (invoice.issue_date) {
    try {
      const d = new Date(invoice.issue_date + "T00:00:00Z");
      d.setUTCDate(d.getUTCDate() + 30);
      dueDisplay = d.toISOString().slice(0, 10);
    } catch {}
  }
  metaBlock(doc, [
    { label: "Issue date", value: invoice.issue_date || "\u2014" },
    { label: "Due date",   value: dueDisplay || "\u2014" },
    { label: "Terms",      value: "Net 30" },
    { label: "PO ref",     value: invoice.po_number || "\u2014" },
  ], { x: W - M - 2.2, y, w: 2.2 });

  // Move below whichever column is taller, with generous breathing room
  y = Math.max(billY + 0.35, y + 1.7);

  y = lineTable(doc, lines, { y, M, W });

  const subtotal = invoice.subtotal_cents || 0;
  const tax = invoice.tax_cents || 0;
  const total = invoice.total_cents || subtotal + tax;
  const balance = Math.max(0, total - paid);

  const totalRows = [];
  if (tax) {
    totalRows.push({ label: "Subtotal", value: money(subtotal) });
    totalRows.push({ label: "Tax",      value: money(tax) });
  }
  totalRows.push({ label: "Total", value: money(total), bold: true });
  if (paid) {
    totalRows.push({ label: "Paid", value: money(paid) });
  }
  y = totalsBlock(doc, totalRows, { y: y + 0.2, W, M });

  // Prominent Amount Due band — the one number the recipient cares about.
  y += 0.15;
  const bandH = 0.5;
  const bandX = W - M - 3.2;
  const bandW = 3.2;
  doc.setFillColor(247, 244, 238);
  doc.rect(bandX, y, bandW, bandH, "F");
  doc.setDrawColor(...COPPER);
  doc.setLineWidth(0.025);
  doc.line(bandX, y, bandX, y + bandH);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("AMOUNT DUE", bandX + 0.18, y + 0.2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`Due ${dueDisplay || "on receipt"}`, bandX + 0.18, y + 0.36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text(money(balance), bandX + bandW - 0.18, y + 0.33, { align: "right" });
  y += bandH;

  // Remit-to box — framed for visual separation
  y += 0.55;
  doc.setDrawColor(...RULE);
  doc.setLineWidth(0.005);
  doc.line(M, y - 0.1, W - M, y - 0.1);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("REMIT TO", M, y + 0.05);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text(`${COMPANY.name}  ·  ${COMPANY.address}`, M, y + 0.25);
  doc.setTextColor(...MUTED);
  doc.text(`Make checks payable to "${COMPANY.name}". ACH / wire instructions on request.`, M, y + 0.43);
  doc.text(`Questions: ${COMPANY.email}  ·  ${COMPANY.phone}`, M, y + 0.59);

  // Thank-you tagline (right-aligned, subtle)
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...COPPER);
  doc.text("Thank you for your business.", W - M, y + 0.59, { align: "right" });

  if (invoice.notes) {
    y += 0.95;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("NOTES", M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    const wrapped = doc.splitTextToSize(invoice.notes, W - M * 2);
    doc.text(wrapped, M, y + 0.18);
  }

  brandedFooter(doc, { confidential: true });
  return doc;
}

export function buildProposalPDF({ proposal, customer, lines, shareUrl }) {
  const { doc, W, M, y: y0 } = newBrandedDoc({
    docKind: "Proposal",
    docNumber: proposal.proposal_number || `#${proposal.id}`,
  });
  let y = y0;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("PREPARED FOR", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(customer?.name || "—", M, y + 0.22);
  if (customer?.contact_name) doc.text(customer.contact_name, M, y + 0.4);

  metaBlock(doc, [
    { label: "Issued",       value: proposal.issued_at?.slice(0, 10) || new Date().toISOString().slice(0, 10) },
    { label: "Valid until",  value: proposal.valid_until || "—" },
    { label: "Status",       value: proposal.status || "DRAFT" },
  ], { x: W - M - 2.2, y, w: 2.2 });

  y += 1.1;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...INK);
  doc.text(proposal.title || "Hardware Redaction Engagement", M, y);
  y += 0.3;

  if (proposal.scope_summary) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    const wrapped = doc.splitTextToSize(proposal.scope_summary, W - M * 2);
    doc.text(wrapped, M, y);
    y += wrapped.length * 0.14 + 0.2;
  }

  y = lineTable(doc, lines, { y, M, W });

  y = totalsBlock(doc, [
    { label: "Subtotal", value: money(proposal.subtotal_cents || 0) },
    { label: "Tax",      value: money(proposal.tax_cents || 0) },
    { label: "Total",    value: money(proposal.total_cents || 0), bold: true },
  ], { y: y + 0.1, W, M });

  if (proposal.terms) {
    y += 0.4;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("TERMS", M, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    const wrapped = doc.splitTextToSize(proposal.terms, W - M * 2);
    doc.text(wrapped, M, y + 0.18);
    y += wrapped.length * 0.14 + 0.3;
  }

  if (shareUrl) {
    y += 0.2;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text("Accept this proposal online:", M, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COPPER);
    doc.text(shareUrl, M, y + 0.18);
  }

  brandedFooter(doc, { confidential: true });
  return doc;
}

export async function buildCertPDF({ device, customer, redactions, events, verifyUrl }) {
  const { doc, W, M, y: y0 } = newBrandedDoc({
    docKind: "Certificate of Redaction",
    docNumber: device.cert_serial || device.tag,
  });
  let y = y0;

  // Big confident headline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text("Certificate of Hardware Redaction", M, y);
  y += 0.35;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(
    "CBR Labs certifies that the device identified below was physically modified by trained technicians, "
    + "with the components or capabilities listed irreversibly disabled or removed.",
    M, y, { maxWidth: W - M * 2 }
  );
  y += 0.6;

  // Device + customer side-by-side
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("DEVICE", M, y);
  doc.text("CUSTOMER", W / 2, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  const dy = y + 0.22;
  doc.text(`Tag: ${device.tag}`, M, dy);
  doc.text(`Model: ${device.model || "—"}`, M, dy + 0.18);
  if (device.serial) doc.text(`Serial: ${device.serial}`, M, dy + 0.36);
  if (device.imei)   doc.text(`IMEI: ${device.imei}`, M, dy + 0.54);

  doc.text(customer?.name || "—", W / 2, dy);
  if (customer?.contact_name) doc.text(customer.contact_name, W / 2, dy + 0.18);
  if (customer?.email)        doc.text(customer.email, W / 2, dy + 0.36);

  y = dy + 0.85;

  // Redactions performed
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("REDACTIONS PERFORMED", M, y);
  y += 0.2;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  if (!redactions || redactions.length === 0) {
    doc.setTextColor(...MUTED);
    doc.text("(none recorded)", M, y);
    y += 0.2;
  } else {
    for (const r of redactions) {
      doc.text(`• ${r.label || r.code || r}`, M, y);
      y += 0.2;
    }
  }

  y += 0.2;

  // Chain of custody
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("CHAIN OF CUSTODY", M, y);
  y += 0.22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  for (const e of (events || []).slice(0, 10)) {
    const when = (e.occurred_at || e.created_at || "").replace("T", " ").slice(0, 16);
    const note = e.notes ? ` — ${e.notes}` : "";
    doc.text(`${when}   ${e.event_type || "STATE"}   ${e.to_state || e.from_state || ""}${note}`, M, y);
    y += 0.16;
  }

  // QR + signature block at bottom
  const sigY = doc.internal.pageSize.getHeight() - 2.2;
  if (verifyUrl) {
    await drawQR(doc, verifyUrl, M, sigY, 1.1);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text("Verify online", M, sigY + 1.25);
  }

  doc.setDrawColor(...INK);
  doc.setLineWidth(0.01);
  doc.line(W / 2, sigY + 0.9, W - M, sigY + 0.9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Authorized signature  ·  CBR Labs LLC", W / 2, sigY + 1.05);
  doc.text(`Issued: ${(device.cert_issued_at || new Date().toISOString()).slice(0, 10)}`, W / 2, sigY + 1.25);

  brandedFooter(doc, { confidential: false });
  return doc;
}

/**
 * Packing slip for a PO shipment. Lists every device with its tag, model,
 * serial, state, and a small per-device QR linking to the public verify page.
 * `siteOrigin` is required to embed scannable cert verify URLs.
 */
export async function buildPackingSlipPDF({ po, customer, devices, siteOrigin }) {
  const { doc, W, M, y: y0 } = newBrandedDoc({
    docKind: "Packing slip",
    docNumber: po.po_number || `#${po.id}`,
  });
  let y = y0;

  // Ship-to + meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("SHIP TO", M, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(customer?.name || "—", M, y + 0.22);
  if (customer?.contact_name) doc.text(customer.contact_name, M, y + 0.4);
  if (customer?.email)        doc.text(customer.email, M, y + 0.56);

  metaBlock(doc, [
    { label: "PO",           value: po.po_number || `#${po.id}` },
    { label: "Status",       value: po.status || "—" },
    { label: "Devices",      value: String(devices.length) },
    { label: "Packed",       value: new Date().toISOString().slice(0, 10) },
  ], { x: W - M - 2.2, y, w: 2.2 });

  y += 1.0;

  // Table header
  const colTag    = M;
  const colModel  = M + 1.2;
  const colSerial = M + 3.2;
  const colState  = W - M - 1.6;
  const colQR     = W - M - 0.5;

  doc.setFillColor(245, 244, 240);
  doc.rect(M, y, W - M * 2, 0.32, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("TAG",    colTag + 0.1, y + 0.21);
  doc.text("MODEL",  colModel,     y + 0.21);
  doc.text("SERIAL", colSerial,    y + 0.21);
  doc.text("STATE",  colState,     y + 0.21);
  doc.text("VERIFY", colQR,        y + 0.21);
  y += 0.45;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);

  const ROW = 0.55;
  const PAGE_H = doc.internal.pageSize.getHeight();

  for (const d of devices) {
    if (y + ROW > PAGE_H - 1.0) {
      brandedFooter(doc, { confidential: false });
      doc.addPage();
      y = 1.0;
    }
    doc.setFont("helvetica", "bold");
    doc.text(d.tag, colTag + 0.1, y + 0.18);
    doc.setFont("helvetica", "normal");
    doc.text(d.model || "—", colModel, y + 0.18, { maxWidth: 1.9 });
    doc.text(d.serial_number || "—", colSerial, y + 0.18, { maxWidth: 1.7 });
    doc.text(d.state || "—", colState, y + 0.18);

    if (siteOrigin) {
      const ref = d.cert_number || d.tag;
      const url = `${siteOrigin}/v?cert=${encodeURIComponent(ref)}`;
      try { await drawQR(doc, url, colQR, y - 0.05, 0.5); } catch { /* ignore */ }
    }

    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.003);
    doc.line(M, y + ROW - 0.05, W - M, y + ROW - 0.05);
    y += ROW;
  }

  y += 0.2;

  // Receiver acknowledgement
  if (y + 1.4 > PAGE_H - 1.0) {
    brandedFooter(doc, { confidential: false });
    doc.addPage();
    y = 1.0;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("RECEIVED BY", M, y);
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.01);
  doc.line(M, y + 0.7, M + 3, y + 0.7);
  doc.line(W - M - 2.2, y + 0.7, W - M, y + 0.7);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("Signature", M, y + 0.85);
  doc.text("Date", W - M - 2.2, y + 0.85);

  brandedFooter(doc, { confidential: false });
  return doc;
}
