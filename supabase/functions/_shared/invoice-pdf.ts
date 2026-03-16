// Shared invoice PDF builder — used by both generate-invoice and send-order-confirmation.
// Produces valid PDF 1.4 with CORRECTLY COMPUTED xref object offsets.
// Uses only standard Type1 fonts (Helvetica / Helvetica-Bold) — no external deps needed.

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

const enc = new TextEncoder();

// Strip non-ASCII characters to keep PDF stream bytes predictable
function ascii(s: string): string {
  return s.replace(/[^\\x20-\\x7E]/g, "?");
}

function esc(s: string): string {
  return ascii(s).replace(/\\\\/g, "\\\\\\\\").replace(/\\(/g, "\\\\(").replace(/\\)/g, "\\\\)");
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
