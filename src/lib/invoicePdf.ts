import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";

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

/** pt-based helper: draw text with a given font/size/color */
function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  r = 0, g = 0, b = 0
) {
  page.drawText(text, { x, y, font, size, color: rgb(r, g, b) });
}

/** Right-align text by computing width first */
function drawTextRight(
  page: PDFPage,
  text: string,
  rightX: number,
  y: number,
  font: PDFFont,
  size: number,
  r = 0, g = 0, b = 0
) {
  const w = font.widthOfTextAtSize(text, size);
  page.drawText(text, { x: rightX - w, y, font, size, color: rgb(r, g, b) });
}

/** Wrap text to fit maxWidth, return array of lines */
function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? current + " " + word : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

// ─── Core builder (async because pdf-lib is async) ────────────────────────────
async function buildDoc(data: InvoiceData, isAdmin: boolean): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  // Page size: A4 = 595 x 842 pt
  const W = 595;
  const H = 842;
  const page = doc.addPage([W, H]);

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const ML = 50;  // margin left
  const MR = 50;  // margin right
  const contentW = W - ML - MR;

  // ── Top horizontal rule ───────────────────────────────────────────────────
  let y = H - 40;

  // Company name
  drawText(page, "Agatsa Medical Technologies Pvt. Ltd.", ML, y, bold, 11);
  y -= 14;
  drawText(page, "Bengaluru, Karnataka, India  |  care@agatsa.com  |  agatsa.com", ML, y, regular, 8, 0.35, 0.35, 0.35);

  // Invoice title (right side)
  const title = isAdmin ? "OPERATIONS INVOICE" : "INVOICE";
  drawTextRight(page, title, W - MR, H - 40, bold, isAdmin ? 18 : 22);
  if (isAdmin) {
    drawTextRight(page, "INTERNAL USE ONLY", W - MR, H - 57, regular, 7.5, 0.55, 0.55, 0.55);
  }

  // Divider
  y = H - 72;
  page.drawLine({ start: { x: ML, y }, end: { x: W - MR, y }, thickness: 0.5, color: rgb(0, 0, 0) });

  // ── Order meta row ────────────────────────────────────────────────────────
  y -= 20;
  const col2x = ML + 180;
  const col3x = ML + 340;

  drawText(page, "ORDER ID", ML, y, bold, 7.5, 0.39, 0.39, 0.39);
  drawText(page, "DATE", col2x, y, bold, 7.5, 0.39, 0.39, 0.39);
  if (data.paymentId) {
    drawText(page, "PAYMENT ID", col3x, y, bold, 7.5, 0.39, 0.39, 0.39);
  }
  y -= 13;
  drawText(page, data.orderId, ML, y, regular, 8.5);
  drawText(page, data.orderDate, col2x, y, regular, 8.5);
  if (data.paymentId) {
    drawText(page, data.paymentId, col3x, y, regular, 7.5);
  }

  // ── Bill To ───────────────────────────────────────────────────────────────
  y -= 28;
  drawText(page, "BILL TO", ML, y, bold, 7.5);
  page.drawLine({ start: { x: ML, y: y - 3 }, end: { x: ML + 50, y: y - 3 }, thickness: 0.3, color: rgb(0, 0, 0) });

  y -= 16;
  drawText(page, data.customerName || "—", ML, y, bold, 10);
  y -= 13;

  const billLines = [
    data.shippingAddress,
    [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
    data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
    data.customerEmail,
    data.customerPhone ?? "",
  ].filter(Boolean);

  for (const line of billLines) {
    const wrapped = wrapText(line, regular, 8.5, 200);
    for (const wl of wrapped) {
      drawText(page, wl, ML, y, regular, 8.5, 0.2, 0.2, 0.2);
      y -= 12;
    }
  }

  // Ship To (admin only, right column)
  if (isAdmin) {
    let shipY = H - 72 - 20 - 13 - 28;
    drawText(page, "SHIP TO", col3x, shipY, bold, 7.5);
    page.drawLine({ start: { x: col3x, y: shipY - 3 }, end: { x: col3x + 50, y: shipY - 3 }, thickness: 0.3, color: rgb(0, 0, 0) });
    shipY -= 16;
    drawText(page, data.customerName || "—", col3x, shipY, bold, 10);
    shipY -= 13;
    const shipLines = [
      data.shippingAddress,
      [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
      data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
    ].filter(Boolean);
    for (const line of shipLines) {
      const wrapped = wrapText(line, regular, 8.5, 140);
      for (const wl of wrapped) {
        drawText(page, wl, col3x, shipY, regular, 8.5, 0.2, 0.2, 0.2);
        shipY -= 12;
      }
    }
  }

  // ── Items table ───────────────────────────────────────────────────────────
  // Ensure table starts with some gap below address block
  y = Math.min(y - 10, H - 310);

  const tableTop = y;
  const ROW_H = 22;
  const HEAD_H = 24;

  // Column widths (in pt): Description | Unit Price | Qty | Amount
  const descW = contentW - 90 - 40 - 90;
  const colX = [ML, ML + descW, ML + descW + 90, ML + descW + 90 + 40];
  const colW = [descW, 90, 40, 90];

  // Header background
  page.drawRectangle({ x: ML, y: tableTop - HEAD_H, width: contentW, height: HEAD_H, color: rgb(0.08, 0.08, 0.08) });

  const headers = ["Description", "Unit Price", "Qty", "Amount"];
  const aligns = ["left", "right", "center", "right"];
  for (let i = 0; i < headers.length; i++) {
    let tx = colX[i] + 6;
    if (aligns[i] === "right") {
      const tw = bold.widthOfTextAtSize(headers[i], 8.5);
      tx = colX[i] + colW[i] - 6 - tw;
    } else if (aligns[i] === "center") {
      const tw = bold.widthOfTextAtSize(headers[i], 8.5);
      tx = colX[i] + (colW[i] - tw) / 2;
    }
    page.drawText(headers[i], { x: tx, y: tableTop - HEAD_H + 8, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  }

  let rowY = tableTop - HEAD_H;

  // Rows
  for (let r = 0; r < data.items.length; r++) {
    const item = data.items[r];
    const descStr =
      item.variantTitle && item.variantTitle !== "Default Title"
        ? `${item.productName} (${item.variantTitle})`
        : item.productName;

    const descLines = wrapText(descStr, regular, 8.5, descW - 12);
    const rh = Math.max(ROW_H, descLines.length * 13 + 8);

    // Alternate fill
    const fillGrey = r % 2 === 0 ? 0.969 : 1;
    page.drawRectangle({ x: ML, y: rowY - rh, width: contentW, height: rh, color: rgb(fillGrey, fillGrey, fillGrey) });

    // Row bottom border
    page.drawLine({ start: { x: ML, y: rowY - rh }, end: { x: ML + contentW, y: rowY - rh }, thickness: 0.2, color: rgb(0.86, 0.86, 0.86) });

    const textY = rowY - rh + (rh - descLines.length * 13) / 2 + (descLines.length - 1) * 13 + 5;

    // Description (may wrap)
    for (let li = 0; li < descLines.length; li++) {
      drawText(page, descLines[li], colX[0] + 6, textY - li * 13, regular, 8.5, 0.08, 0.08, 0.08);
    }

    // Unit price
    const unitStr = fmt(item.price);
    const unitW = regular.widthOfTextAtSize(unitStr, 8.5);
    drawText(page, unitStr, colX[1] + colW[1] - 6 - unitW, rowY - rh + (rh / 2) - 4, regular, 8.5, 0.08, 0.08, 0.08);

    // Qty (centered)
    const qtyStr = String(item.quantity);
    const qtyW = regular.widthOfTextAtSize(qtyStr, 8.5);
    drawText(page, qtyStr, colX[2] + (colW[2] - qtyW) / 2, rowY - rh + (rh / 2) - 4, regular, 8.5, 0.08, 0.08, 0.08);

    // Amount
    const amtStr = fmt(item.price * item.quantity);
    const amtW = regular.widthOfTextAtSize(amtStr, 8.5);
    drawText(page, amtStr, colX[3] + colW[3] - 6 - amtW, rowY - rh + (rh / 2) - 4, regular, 8.5, 0.08, 0.08, 0.08);

    rowY -= rh;
  }

  // Table outer border
  page.drawRectangle({ x: ML, y: rowY, width: contentW, height: tableTop - rowY, borderColor: rgb(0.7, 0.7, 0.7), borderWidth: 0.4, color: rgb(1, 1, 1) });

  // ── Totals ────────────────────────────────────────────────────────────────
  const totX = W - MR - 180;
  let totY = rowY - 22;

  drawText(page, "Subtotal", totX, totY, regular, 8.5, 0.24, 0.24, 0.24);
  drawTextRight(page, fmt(data.subtotal), W - MR, totY, regular, 8.5, 0.24, 0.24, 0.24);
  totY -= 16;

  if (data.discountAmount && data.discountAmount > 0) {
    const label = `Discount${data.couponCode ? ` (${data.couponCode})` : ""}`;
    drawText(page, label, totX, totY, regular, 8.5, 0.24, 0.24, 0.24);
    drawTextRight(page, `- ${fmt(data.discountAmount)}`, W - MR, totY, regular, 8.5, 0.24, 0.24, 0.24);
    totY -= 16;
  }

  drawText(page, "Shipping", totX, totY, regular, 8.5, 0.24, 0.24, 0.24);
  drawTextRight(page, "Free", W - MR, totY, regular, 8.5, 0.24, 0.24, 0.24);
  totY -= 10;

  page.drawLine({ start: { x: totX, y: totY }, end: { x: W - MR, y: totY }, thickness: 0.5, color: rgb(0, 0, 0) });
  totY -= 16;

  const totalLabel = isAdmin ? "Grand Total" : "Total";
  drawText(page, totalLabel, totX, totY, bold, 11);
  drawTextRight(page, fmt(data.total), W - MR, totY, bold, 11);
  totY -= 13;

  drawText(page, "Payment received via Razorpay. Amount in INR.", totX, totY, regular, 7.5, 0.47, 0.47, 0.47);

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = 28;
  page.drawLine({ start: { x: ML, y: footerY + 14 }, end: { x: W - MR, y: footerY + 14 }, thickness: 0.3, color: rgb(0.7, 0.7, 0.7) });

  if (isAdmin) {
    drawText(page, `Generated: ${new Date().toLocaleString("en-IN")}  |  FOR INTERNAL OPERATIONS USE ONLY`, ML, footerY + 4, regular, 7, 0.47, 0.47, 0.47);
  } else {
    drawText(page, "Thank you for your purchase.", ML, footerY + 4, regular, 7.5, 0.47, 0.47, 0.47);
    drawText(page, "Queries: care@agatsa.com  |  agatsa.com/support", ML, footerY - 6, regular, 7.5, 0.47, 0.47, 0.47);
  }
  drawTextRight(page, "Agatsa Medical Technologies Pvt. Ltd., Bengaluru, India", W - MR, footerY + 4, regular, 7, 0.47, 0.47, 0.47);

  return doc.save();
}

// ─── Helper: trigger browser download ─────────────────────────────────────────
function triggerDownload(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
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
export async function generateCustomerInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  return buildDoc(data, false);
}

export async function downloadCustomerInvoice(data: InvoiceData): Promise<void> {
  const bytes = await buildDoc(data, false);
  triggerDownload(bytes, `invoice-${data.orderId}.pdf`);
}

export async function downloadAdminInvoice(data: InvoiceData): Promise<void> {
  const bytes = await buildDoc(data, true);
  triggerDownload(bytes, `operations-invoice-${data.orderId}.pdf`);
}
