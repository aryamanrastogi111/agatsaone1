// Invoice PDF — built with pdf-lib, a battle-tested PDF library.
// This guarantees valid, readable PDFs across all viewers (Adobe, Preview, Chrome, etc.)

import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib@1.17.1";

export interface InvoicePdfData {
  orderId: string;
  paymentId?: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: { productName: string; variantTitle?: string; quantity: number; price: number }[];
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  total: number;
  isAdmin?: boolean;
}

function fmtINR(n: number): string {
  return "Rs. " + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export async function buildInvoicePdf(data: InvoicePdfData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4 portrait

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const margin = 50;
  let y = height - 40;

  // ── Header bar ─────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 72, width, height: 72, color: rgb(0, 0, 0) });

  page.drawText("AGATSA", {
    x: margin, y: height - 36, font: bold, size: 20, color: rgb(1, 1, 1),
  });
  page.drawText("Medical Technologies Pvt Ltd", {
    x: margin, y: height - 52, font: regular, size: 9, color: rgb(0.75, 0.75, 0.75),
  });
  page.drawText(data.isAdmin ? "OPERATIONS INVOICE" : "TAX INVOICE", {
    x: width - margin - 135, y: height - 42, font: bold, size: 13, color: rgb(1, 1, 1),
  });

  y = height - 90;

  // ── Meta block ──────────────────────────────────────────────────────────────
  const lc = rgb(0.45, 0.45, 0.45);
  const vc = rgb(0.07, 0.07, 0.07);

  const metaLeft: [string, string][] = [
    ["Invoice Date", data.orderDate],
    ["Order ID", data.orderId.slice(0, 36)],
    ...(data.paymentId ? [["Payment ID", data.paymentId.slice(0, 28)] as [string, string]] : []),
  ];
  const metaRight: [string, string][] = [
    ["Sold By", "Agatsa Medical Technologies Pvt Ltd"],
    ["GSTIN", "29AACCA8844R1ZD"],
    ["Email", "care@agatsa.com"],
  ];

  let ly = y, ry = y;
  for (const [label, value] of metaLeft) {
    page.drawText(label + ":", { x: margin, y: ly, font: bold, size: 8, color: lc });
    page.drawText(value, { x: margin + 80, y: ly, font: regular, size: 8, color: vc });
    ly -= 14;
  }
  for (const [label, value] of metaRight) {
    page.drawText(label + ":", { x: margin + 280, y: ry, font: bold, size: 8, color: lc });
    page.drawText(value, { x: margin + 340, y: ry, font: regular, size: 8, color: vc });
    ry -= 14;
  }
  y = Math.min(ly, ry) - 12;

  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
  y -= 16;

  // ── Bill To ─────────────────────────────────────────────────────────────────
  page.drawText("BILL TO / SHIP TO", { x: margin, y, font: bold, size: 8, color: lc });
  y -= 14;
  page.drawText(data.customerName || "Customer", { x: margin, y, font: bold, size: 10, color: vc });
  y -= 13;
  if (data.customerEmail) {
    page.drawText(data.customerEmail, { x: margin, y, font: regular, size: 8, color: lc });
    y -= 12;
  }
  if (data.customerPhone) {
    page.drawText(data.customerPhone, { x: margin, y, font: regular, size: 8, color: lc });
    y -= 12;
  }
  const addrLine = [data.shippingAddress, data.shippingCity, data.shippingState, data.shippingPincode]
    .filter(Boolean).join(", ");
  if (addrLine) {
    const words = addrLine.split(" ");
    let line = "";
    for (const w of words) {
      if ((line + " " + w).trim().length > 80) {
        page.drawText(line.trim(), { x: margin, y, font: regular, size: 8, color: lc });
        y -= 12; line = w;
      } else {
        line = (line + " " + w).trim();
      }
    }
    if (line) { page.drawText(line.trim(), { x: margin, y, font: regular, size: 8, color: lc }); y -= 12; }
  }
  y -= 10;

  // ── Table ───────────────────────────────────────────────────────────────────
  const tableWidth = width - margin * 2;
  const cQty   = margin + tableWidth - 145;
  const cUnit  = margin + tableWidth - 100;
  const cTotal = margin + tableWidth - 50;

  // Header
  page.drawRectangle({ x: margin, y: y - 16, width: tableWidth, height: 18, color: rgb(0.07, 0.07, 0.07) });
  const hy = y - 11;
  page.drawText("Product",    { x: margin + 4,    y: hy, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  page.drawText("Qty",        { x: cQty + 4,       y: hy, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  page.drawText("Unit Price", { x: cUnit - 8,      y: hy, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  page.drawText("Amount",     { x: cTotal - 6,     y: hy, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  y -= 20;

  // Rows
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const hasVariant = item.variantTitle && item.variantTitle !== "Default Title";
    const rowH = hasVariant ? 26 : 18;
    if (i % 2 === 0) {
      page.drawRectangle({ x: margin, y: y - rowH + 4, width: tableWidth, height: rowH, color: rgb(0.97, 0.97, 0.97) });
    }
    const name = item.productName.length > 55 ? item.productName.slice(0, 54) + "..." : item.productName;
    page.drawText(name,                    { x: margin + 4, y: y - 8, font: bold,    size: 8.5, color: rgb(0.1, 0.1, 0.1) });
    if (hasVariant) {
      page.drawText(item.variantTitle!,    { x: margin + 4, y: y - 18, font: regular, size: 7.5, color: rgb(0.5, 0.5, 0.5) });
    }
    page.drawText(String(item.quantity),   { x: cQty + 8,   y: y - 8, font: regular, size: 8.5, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(fmtINR(item.price),      { x: cUnit - 8,  y: y - 8, font: regular, size: 8.5, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(fmtINR(item.price * item.quantity), { x: cTotal - 6, y: y - 8, font: bold, size: 8.5, color: rgb(0.1, 0.1, 0.1) });
    y -= rowH;
  }

  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
  y -= 14;

  // ── Totals ──────────────────────────────────────────────────────────────────
  const sx = margin + tableWidth - 205;
  const drawRow = (label: string, value: string, isBold = false) => {
    page.drawText(label, { x: sx, y, font: isBold ? bold : regular, size: isBold ? 10 : 8.5, color: isBold ? rgb(0,0,0) : rgb(0.35,0.35,0.35) });
    page.drawText(value, { x: cTotal - 6, y, font: isBold ? bold : regular, size: isBold ? 10 : 8.5, color: isBold ? rgb(0,0,0) : rgb(0.35,0.35,0.35) });
    y -= isBold ? 16 : 13;
  };

  drawRow("Subtotal", fmtINR(data.subtotal));
  if (data.discountAmount && data.discountAmount > 0) {
    drawRow(data.couponCode ? `Discount (${data.couponCode})` : "Discount", `- ${fmtINR(data.discountAmount)}`);
  }
  drawRow("Shipping", "Free");
  y -= 2;
  page.drawRectangle({ x: sx - 8, y: y - 6, width: width - margin - sx + 8, height: 22, color: rgb(0.07, 0.07, 0.07) });
  page.drawText("TOTAL PAID", { x: sx, y: y + 1, font: bold, size: 10, color: rgb(1,1,1) });
  page.drawText(fmtINR(data.total), { x: cTotal - 6, y: y + 1, font: bold, size: 10, color: rgb(1,1,1) });

  // ── Footer ──────────────────────────────────────────────────────────────────
  page.drawLine({ start: { x: margin, y: 50 }, end: { x: width - margin, y: 50 }, thickness: 0.4, color: rgb(0.8, 0.8, 0.8) });
  page.drawText("This is a computer-generated invoice. No signature required.", { x: margin, y: 36, font: regular, size: 7.5, color: rgb(0.6,0.6,0.6) });
  page.drawText("Agatsa Medical Technologies Pvt. Ltd.  Bengaluru, India  care@agatsa.com  agatsa.com", { x: margin, y: 24, font: regular, size: 7.5, color: rgb(0.6,0.6,0.6) });

  return await doc.save();
}

  orderId: string;
  paymentId?: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: { productName: string; variantTitle?: string; quantity: number; price: number }[];
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  total: number;
  isAdmin?: boolean;
}

const enc = new TextEncoder();

function ascii(s: string): string {
  let r = "";
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    r += (code >= 32 && code <= 126) ? s[i] : "?";
  }
  return r;
}

function esc(s: string): string {
  let r = "";
  for (const c of ascii(s)) {
    if (c === "\\") r += "\\\\";
    else if (c === "(") r += "\\(";
    else if (c === ")") r += "\\)";
    else r += c;
  }
  return r;
}

function fmt(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pad10(n: number): string {
  return String(n).padStart(10, "0");
}

export function buildInvoicePdf(data: InvoicePdfData): Uint8Array {
  // A4: 595 x 842 pts. PDF origin = bottom-left, y increases upward.
  const W = 595;
  const H = 842;
  const ML = 50;

  // ── Build content stream (drawing commands) ─────────────────────────────────
  const s: string[] = [];

  // yT = y measured from TOP; we flip to PDF coords: pdfY = H - yT
  const txt = (x: number, yT: number, str: string, size: number, bold = false) => {
    const f = bold ? "/F2" : "/F1";
    s.push(`BT ${f} ${size} Tf ${x} ${H - yT} Td (${esc(str)}) Tj ET`);
  };

  const txtW = (x: number, yT: number, str: string, size: number, bold = false) => {
    const f = bold ? "/F2" : "/F1";
    // Set white fill, draw text, reset to black fill — all inside one BT block
    s.push(`BT 1 1 1 rg ${f} ${size} Tf ${x} ${H - yT} Td (${esc(str)}) Tj ET`);
    s.push("0 0 0 rg"); // reset fill colour outside BT for subsequent ops
  };

  // fillRect: x/yT/w/h in top-origin coords, gray 0=black 1=white
  const fillRect = (x: number, yT: number, w: number, h: number, gray: number) => {
    s.push(`${gray.toFixed(2)} g ${x} ${H - yT - h} ${w} ${h} re f`);
    s.push("0 g"); // reset
  };

  const hLine = (yT: number, x1 = ML, x2 = W - ML, lw = 0.4) => {
    const py = H - yT;
    s.push(`${lw} w ${x1} ${py} m ${x2} ${py} l S`);
  };

  // ── Header bar ──────────────────────────────────────────────────────────────
  fillRect(0, 0, W, 56, 0);
  txtW(ML, 22, "Agatsa Medical Technologies Pvt. Ltd.", 12, true);
  txtW(ML, 37, "Bengaluru, Karnataka, India  |  care@agatsa.com  |  agatsa.com", 8);
  const titleStr = data.isAdmin ? "OPERATIONS INVOICE" : "INVOICE";
  const titleX = data.isAdmin ? W - ML - 170 : W - ML - 80;
  txtW(titleX, 28, titleStr, data.isAdmin ? 18 : 24, true);
  if (data.isAdmin) {
    txtW(W - ML - 120, 42, "INTERNAL USE ONLY", 7.5);
  }

  // Separator below header
  s.push("0.75 g");
  hLine(60, ML, W - ML, 0.3);
  s.push("0 g");

  // ── Order meta ──────────────────────────────────────────────────────────────
  let y = 76;
  const c2 = ML + 160;
  const c3 = ML + 320;
  txt(ML, y, "ORDER ID", 7.5, true);
  txt(c2, y, "DATE", 7.5, true);
  if (data.paymentId) txt(c3, y, "PAYMENT ID", 7.5, true);
  y += 13;
  txt(ML, y, data.orderId.slice(0, 30), 8.5);
  txt(c2, y, data.orderDate, 8.5);
  if (data.paymentId) txt(c3, y, data.paymentId.slice(0, 24), 8);

  // ── Bill To ─────────────────────────────────────────────────────────────────
  y += 22;
  txt(ML, y, "BILL TO", 7.5, true);
  hLine(y + 2, ML, ML + 44, 0.3);
  y += 13;
  txt(ML, y, (data.customerName || "—").slice(0, 40), 10, true);
  y += 12;

  const billLines = [
    data.shippingAddress,
    [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
    data.shippingPincode ? "PIN: " + data.shippingPincode : "",
    data.customerEmail,
    data.customerPhone ?? "",
  ].filter(Boolean);

  for (const line of billLines) {
    txt(ML, y, line.slice(0, 62), 8.5);
    y += 11;
  }

  if (data.isAdmin) {
    let sy = 111;
    txt(c3, sy, "SHIP TO", 7.5, true);
    hLine(sy + 2, c3, c3 + 44, 0.3);
    sy += 13;
    txt(c3, sy, (data.customerName || "—").slice(0, 30), 10, true);
    sy += 12;
    for (const line of [
      data.shippingAddress,
      [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
      data.shippingPincode ? "PIN: " + data.shippingPincode : "",
    ].filter(Boolean)) {
      txt(c3, sy, line.slice(0, 34), 8.5);
      sy += 11;
    }
  }

  // ── Items table ─────────────────────────────────────────────────────────────
  y = Math.max(y + 10, 270);
  const tableW = W - 2 * ML;
  const colP = W - ML - 140;
  const colQ = W - ML - 90;
  const colA = W - ML - 8;
  const rowH = 20;

  // Table header
  fillRect(ML, y, tableW, rowH, 0);
  txtW(ML + 4, y + 14, "Description", 8, true);
  txtW(colP, y + 14, "Unit Price", 8, true);
  txtW(colQ + 4, y + 14, "Qty", 8, true);
  txtW(colA - 40, y + 14, "Amount", 8, true);
  y += rowH;

  let alt = false;
  for (const item of data.items) {
    const label = item.productName +
      (item.variantTitle && item.variantTitle !== "Default Title" ? " - " + item.variantTitle : "");
    if (alt) fillRect(ML, y, tableW, rowH, 0.94);
    txt(ML + 4, y + 14, label.slice(0, 54), 8.5);
    txt(colP, y + 14, fmt(item.price), 8.5);
    txt(colQ + 8, y + 14, String(item.quantity), 8.5);
    txt(colA - 40, y + 14, fmt(item.price * item.quantity), 8.5);
    s.push("0.80 G");
    hLine(y + rowH, ML, W - ML, 0.2);
    s.push("0 G");
    y += rowH;
    alt = !alt;
  }

  // ── Totals ──────────────────────────────────────────────────────────────────
  y += 10;
  const tLX = W - ML - 164;

  const totRow = (label: string, value: string, bold = false) => {
    txt(tLX, y, label, 9, bold);
    const vx = W - ML - 8 - value.length * 5.0;
    txt(vx, y, value, 9, bold);
    y += 14;
  };

  totRow("Subtotal", fmt(data.subtotal));
  if (data.discountAmount && data.discountAmount > 0) {
    totRow(
      "Discount" + (data.couponCode ? " (" + data.couponCode + ")" : ""),
      "- " + fmt(data.discountAmount)
    );
  }
  totRow("Shipping", "Free");
  hLine(y - 4, tLX, W - ML, 0.5);
  y += 2;
  totRow(data.isAdmin ? "Grand Total" : "Total", fmt(data.total), true);
  s.push("0.55 g");
  txt(tLX, y, "Payment received via Razorpay. Amount in INR.", 7.5);
  s.push("0 g");

  // ── Footer ──────────────────────────────────────────────────────────────────
  s.push("0.72 G 0.3 w " + ML + " 40 m " + (W - ML) + " 40 l S 0 G");
  s.push("0.50 g");
  if (data.isAdmin) {
    s.push(`BT /F1 7 Tf ${ML} 26 Td (Generated: ${esc(new Date().toLocaleString("en-US"))}  |  FOR INTERNAL OPERATIONS USE ONLY) Tj ET`);
  } else {
    s.push(`BT /F1 7.5 Tf ${ML} 26 Td (Thank you for your purchase. Queries: care@agatsa.com  |  agatsa.com/support) Tj ET`);
  }
  s.push(`BT /F1 7 Tf ${W - ML - 286} 14 Td (Agatsa Medical Technologies Pvt. Ltd., Bengaluru, India) Tj ET`);
  s.push("0 g");

  // ── Assemble PDF with correct xref offsets ──────────────────────────────────
  const streamContent = s.join("\\n");
  const streamBytes = enc.encode(streamContent);
  const streamLen = streamBytes.length;

  // Pre-encode each object to know exact byte sizes
  const hdr   = enc.encode("%PDF-1.4\\n");
  const o1    = enc.encode("1 0 obj\\n<< /Type /Catalog /Pages 2 0 R >>\\nendobj\\n");
  const o2    = enc.encode("2 0 obj\\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\\nendobj\\n");
  const o3    = enc.encode(
    `3 0 obj\\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}]\\n` +
    `/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >>\\n` +
    `/Contents 6 0 R >>\\nendobj\\n`
  );
  const o4    = enc.encode("4 0 obj\\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\\nendobj\\n");
  const o5    = enc.encode("5 0 obj\\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\\nendobj\\n");
  const o6hdr = enc.encode(`6 0 obj\\n<< /Length ${streamLen} >>\\nstream\\n`);
  const o6ftr = enc.encode("\\nendstream\\nendobj\\n");

  // Compute exact byte offsets for xref
  let off = hdr.length;
  const off1 = off; off += o1.length;
  const off2 = off; off += o2.length;
  const off3 = off; off += o3.length;
  const off4 = off; off += o4.length;
  const off5 = off; off += o5.length;
  const off6 = off; off += o6hdr.length + streamBytes.length + o6ftr.length;
  const xrefOff = off;

  // Build xref table — each entry MUST be exactly 20 bytes (10+1+5+1+1+1+ = 20)
  const xrefTable =
    "xref\\n" +
    "0 7\\n" +
    "0000000000 65535 f \\n" +
    pad10(off1) + " 00000 n \\n" +
    pad10(off2) + " 00000 n \\n" +
    pad10(off3) + " 00000 n \\n" +
    pad10(off4) + " 00000 n \\n" +
    pad10(off5) + " 00000 n \\n" +
    pad10(off6) + " 00000 n \\n" +
    "trailer\\n<< /Size 7 /Root 1 0 R >>\\n" +
    "startxref\\n" +
    xrefOff + "\\n" +
    "%%EOF\\n";
  const xrefBytes = enc.encode(xrefTable);

  // Concatenate all parts
  const total = hdr.length + o1.length + o2.length + o3.length + o4.length + o5.length +
    o6hdr.length + streamBytes.length + o6ftr.length + xrefBytes.length;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const chunk of [hdr, o1, o2, o3, o4, o5, o6hdr, streamBytes, o6ftr, xrefBytes]) {
    out.set(chunk, pos);
    pos += chunk.length;
  }
  return out;
}
