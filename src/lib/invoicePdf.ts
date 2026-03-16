// Pure raw-PDF invoice generator — no external library needed.
// Uses standard Type1 fonts (Helvetica / Helvetica-Bold) built into every PDF viewer.
// This is the same approach used in the send-order-confirmation edge function which
// is proven to produce valid, readable PDFs.

export interface InvoiceItem {
  productName: string;
  variantTitle?: string;
  quantity: number;
  price: number;
}

export interface InvoiceData {
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
  items: InvoiceItem[];
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  total: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

// ─── Raw PDF builder ──────────────────────────────────────────────────────────
function buildRawPdf(data: InvoiceData, isAdmin: boolean): Uint8Array {
  const enc = new TextEncoder();

  // Page: A4 = 595 x 842 pts. Origin bottom-left in PDF space.
  const W = 595;
  const H = 842;
  const ML = 50; // margin left

  // Stream drawing commands (PDF graphics operators)
  const s: string[] = [];

  // Helper: draw text at (x, y) — y measured from TOP of page (we flip internally)
  const txt = (x: number, yFromTop: number, str: string, size: number, bold = false) => {
    const font = bold ? "/F2" : "/F1";
    s.push(`BT ${font} ${size} Tf ${x} ${H - yFromTop} Td (${esc(str)}) Tj ET`);
  };

  const txtWhite = (x: number, yFromTop: number, str: string, size: number, bold = false) => {
    const font = bold ? "/F2" : "/F1";
    s.push(`BT 1 1 1 rg ${font} ${size} Tf ${x} ${H - yFromTop} Td (${esc(str)}) Tj 0 0 0 rg ET`);
  };

  const hLine = (yFromTop: number, x1 = ML, x2 = W - ML, w = 0.4) => {
    s.push(`${w} w ${x1} ${H - yFromTop} m ${x2} ${H - yFromTop} l S`);
  };

  // Filled rectangle — y measured from TOP, height downward
  const fillRect = (x: number, yFromTop: number, w: number, h: number, gray: number) => {
    s.push(`${gray} g ${x} ${H - yFromTop - h} ${w} ${h} re f 0 g`);
  };

  // ── Header bar ───────────────────────────────────────────────────────────────
  fillRect(0, 0, W, 56, 0.08);
  txtWhite(ML, 22, "Agatsa Medical Technologies Pvt. Ltd.", 12, true);
  txtWhite(ML, 37, "Bengaluru, Karnataka, India  |  care@agatsa.com  |  agatsa.com", 8);
  const titleStr = isAdmin ? "OPERATIONS INVOICE" : "INVOICE";
  txtWhite(W - ML - (isAdmin ? 155 : 85), 28, titleStr, isAdmin ? 18 : 22, true);
  if (isAdmin) {
    txtWhite(W - ML - 110, 42, "INTERNAL USE ONLY", 8);
  }

  // Separator
  s.push("0.8 G");
  hLine(60, ML, W - ML, 0.4);
  s.push("0 G");

  // ── Order meta ────────────────────────────────────────────────────────────────
  let y = 76;
  const col2 = ML + 160;
  const col3 = ML + 320;

  txt(ML, y, "ORDER ID", 7.5, true);
  txt(col2, y, "DATE", 7.5, true);
  if (data.paymentId) txt(col3, y, "PAYMENT ID", 7.5, true);
  y += 13;
  const shortId = data.orderId.length > 28 ? data.orderId.slice(0, 28) + "..." : data.orderId;
  txt(ML, y, shortId, 8.5);
  txt(col2, y, data.orderDate, 8.5);
  if (data.paymentId) {
    const shortPay = data.paymentId.length > 24 ? data.paymentId.slice(0, 24) + "..." : data.paymentId;
    txt(col3, y, shortPay, 8);
  }

  // ── Bill To ───────────────────────────────────────────────────────────────────
  y += 22;
  txt(ML, y, "BILL TO", 7.5, true);
  hLine(y + 2, ML, ML + 46, 0.3);
  y += 13;
  txt(ML, y, data.customerName || "—", 10, true);
  y += 12;

  const billLines = [
    data.shippingAddress,
    [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
    data.shippingPincode ? "PIN: " + data.shippingPincode : "",
    data.customerEmail,
    data.customerPhone ?? "",
  ].filter(Boolean);

  for (const line of billLines) {
    const safe = line.length > 60 ? line.slice(0, 60) + "..." : line;
    txt(ML, y, safe, 8.5);
    y += 11;
  }

  // Ship To (admin — right column)
  if (isAdmin) {
    let sy = 111; // start at same level as BILL TO
    txt(col3, sy, "SHIP TO", 7.5, true);
    hLine(sy + 2, col3, col3 + 46, 0.3);
    sy += 13;
    txt(col3, sy, data.customerName || "—", 10, true);
    sy += 12;
    const shipLines = [
      data.shippingAddress,
      [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
      data.shippingPincode ? "PIN: " + data.shippingPincode : "",
    ].filter(Boolean);
    for (const line of shipLines) {
      const safe = line.length > 36 ? line.slice(0, 36) + "..." : line;
      txt(col3, sy, safe, 8.5);
      sy += 11;
    }
  }

  // ── Items table ───────────────────────────────────────────────────────────────
  y = Math.max(y + 8, 270);

  const tableW = W - 2 * ML;
  const colPrice = W - ML - 140;
  const colQty = W - ML - 90;
  const colAmt = W - ML - 8;
  const rowH = 20;

  // Header
  fillRect(ML, y, tableW, rowH, 0.08);
  txtWhite(ML + 4, y + 13, "Description", 8, true);
  txtWhite(colPrice, y + 13, "Unit Price", 8, true);
  txtWhite(colQty + 4, y + 13, "Qty", 8, true);
  txtWhite(colAmt - 38, y + 13, "Amount", 8, true);
  y += rowH;

  let alt = false;
  for (const item of data.items) {
    const label =
      item.variantTitle && item.variantTitle !== "Default Title"
        ? item.productName + " - " + item.variantTitle
        : item.productName;
    const safeLabel = label.length > 52 ? label.slice(0, 52) + "..." : label;
    if (alt) fillRect(ML, y, tableW, rowH, 0.95);
    txt(ML + 4, y + 13, safeLabel, 8.5);
    txt(colPrice, y + 13, fmt(item.price), 8.5);
    txt(colQty + 8, y + 13, String(item.quantity), 8.5);
    txt(colAmt - 38, y + 13, fmt(item.price * item.quantity), 8.5);
    s.push("0.85 G");
    hLine(y + rowH, ML, W - ML, 0.2);
    s.push("0 G");
    y += rowH;
    alt = !alt;
  }

  // Table border
  s.push(`0.75 G 0.4 w ${ML} ${H - y} ${tableW} ${y - (y - data.items.length * rowH - rowH)} re S 0 G`);

  // ── Totals ────────────────────────────────────────────────────────────────────
  y += 10;
  const totLX = W - ML - 162;
  const totVX = W - ML - 8;

  const totRow = (label: string, value: string, bold = false) => {
    txt(totLX, y, label, 9, bold);
    txt(totVX - value.length * 5.2, y, value, 9, bold);
    y += 13;
  };

  totRow("Subtotal", fmt(data.subtotal));
  if (data.discountAmount && data.discountAmount > 0) {
    const discLabel = "Discount" + (data.couponCode ? " (" + data.couponCode + ")" : "");
    totRow(discLabel, "- " + fmt(data.discountAmount));
  }
  totRow("Shipping", "Free");

  hLine(y - 3, totLX, W - ML, 0.5);
  y += 2;
  totRow(isAdmin ? "Grand Total" : "Total", fmt(data.total), true);

  s.push("0.5 g");
  txt(totLX, y, "Payment received via Razorpay. Amount in INR.", 7.5);
  s.push("0 g");

  // ── Footer ────────────────────────────────────────────────────────────────────
  s.push("0.75 G 0.3 w " + ML + " 40 m " + (W - ML) + " 40 l S 0 G");
  s.push("0.5 g");
  if (isAdmin) {
    s.push(`BT /F1 7 Tf ${ML} 26 Td (Generated: ${esc(new Date().toLocaleString("en-IN"))}  |  FOR INTERNAL OPERATIONS USE ONLY) Tj ET`);
  } else {
    s.push(`BT /F1 7.5 Tf ${ML} 26 Td (Thank you for your purchase. For queries: care@agatsa.com  |  agatsa.com/support) Tj ET`);
  }
  s.push(`BT /F1 7 Tf ${W - ML - 290} 15 Td (Agatsa Medical Technologies Pvt. Ltd., Bengaluru, India) Tj ET`);
  s.push("0 g");

  // ── Assemble PDF ──────────────────────────────────────────────────────────────
  const streamContent = s.join("\n");
  const streamBytes = enc.encode(streamContent);
  const streamLen = streamBytes.length;

  // Build object list — we track byte offsets for xref
  const objs: string[] = [];
  objs.push("%PDF-1.4");                                                         // offset 0 (not an obj)
  const obj1 = "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj";
  const obj2 = "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj";
  const obj3 = [
    "3 0 obj << /Type /Page /Parent 2 0 R",
    `/MediaBox [0 0 ${W} ${H}]`,
    "/Resources << /Font << /F1 4 0 R /F2 5 0 R >> >>",
    "/Contents 6 0 R >> endobj",
  ].join("\n");
  const obj4 = "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj";
  const obj5 = "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj";
  const obj6Header = `6 0 obj << /Length ${streamLen} >>\nstream\n`;
  const obj6Footer = "\nendstream\nendobj";

  // Calculate byte offsets
  const header = "%PDF-1.4\n";
  let offset = header.length;
  const offsets: number[] = [];

  const parts: Uint8Array[] = [];
  parts.push(enc.encode(header));

  const addObj = (content: string) => {
    offsets.push(offset);
    const b = enc.encode(content + "\n");
    parts.push(b);
    offset += b.length;
  };

  addObj(obj1);
  addObj(obj2);
  addObj(obj3);
  addObj(obj4);
  addObj(obj5);

  // Stream object (obj6) handled manually
  offsets.push(offset);
  const obj6Start = enc.encode(obj6Header);
  const obj6End = enc.encode(obj6Footer + "\n");
  parts.push(obj6Start);
  parts.push(streamBytes);
  parts.push(obj6End);
  offset += obj6Start.length + streamBytes.length + obj6End.length;

  // xref table
  const xrefOffset = offset;
  const xrefLines = [
    "xref",
    `0 7`,
    "0000000000 65535 f ",
    ...offsets.map((o) => String(o).padStart(10, "0") + " 00000 n "),
    "",
    `trailer << /Size 7 /Root 1 0 R >>`,
    `startxref`,
    String(xrefOffset),
    "%%EOF",
  ].join("\n");
  parts.push(enc.encode(xrefLines));

  // Merge all parts
  const totalLen = parts.reduce((sum, p) => sum + p.length, 0);
  const result = new Uint8Array(totalLen);
  let pos = 0;
  for (const p of parts) {
    result.set(p, pos);
    pos += p.length;
  }
  return result;
}

// ─── Download helper ──────────────────────────────────────────────────────────
function triggerDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function generateCustomerInvoicePdf(data: InvoiceData): Uint8Array {
  return buildRawPdf(data, false);
}

export function downloadCustomerInvoice(data: InvoiceData): void {
  triggerDownload(buildRawPdf(data, false), `invoice-${data.orderId}.pdf`);
}

export function downloadAdminInvoice(data: InvoiceData): void {
  triggerDownload(buildRawPdf(data, true), `operations-invoice-${data.orderId}.pdf`);
}
