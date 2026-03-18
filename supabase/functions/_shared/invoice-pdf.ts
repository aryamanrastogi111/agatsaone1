// Invoice PDF — built with pdf-lib, a battle-tested library.
// Produces valid, readable PDFs in all viewers (Adobe, Preview, Chrome).

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
  page.drawText("Software Pvt Ltd", {
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
    ["Sold By", "Agatsa Software Pvt Ltd"],
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

  page.drawLine({
    start: { x: margin, y }, end: { x: width - margin, y },
    thickness: 0.5, color: rgb(0.8, 0.8, 0.8),
  });
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
        y -= 12;
        line = w;
      } else {
        line = (line + " " + w).trim();
      }
    }
    if (line) {
      page.drawText(line.trim(), { x: margin, y, font: regular, size: 8, color: lc });
      y -= 12;
    }
  }
  y -= 10;

  // ── Table header ────────────────────────────────────────────────────────────
  const tableWidth = width - margin * 2;
  const cQty   = margin + tableWidth - 145;
  const cUnit  = margin + tableWidth - 100;
  const cAmt   = margin + tableWidth - 50;

  page.drawRectangle({
    x: margin, y: y - 16, width: tableWidth, height: 18,
    color: rgb(0.07, 0.07, 0.07),
  });
  const hy = y - 11;
  page.drawText("Product",    { x: margin + 4,   y: hy, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  page.drawText("Qty",        { x: cQty + 4,      y: hy, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  page.drawText("Unit Price", { x: cUnit - 10,    y: hy, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  page.drawText("Amount",     { x: cAmt - 6,      y: hy, font: bold, size: 8.5, color: rgb(1, 1, 1) });
  y -= 20;

  // ── Table rows ──────────────────────────────────────────────────────────────
  for (let i = 0; i < data.items.length; i++) {
    const item = data.items[i];
    const hasVariant = !!(item.variantTitle && item.variantTitle !== "Default Title");
    const rowH = hasVariant ? 26 : 18;

    if (i % 2 === 0) {
      page.drawRectangle({
        x: margin, y: y - rowH + 4, width: tableWidth, height: rowH,
        color: rgb(0.97, 0.97, 0.97),
      });
    }

    const name = item.productName.length > 55
      ? item.productName.slice(0, 54) + "..."
      : item.productName;

    page.drawText(name, { x: margin + 4, y: y - 8, font: bold, size: 8.5, color: rgb(0.1, 0.1, 0.1) });
    if (hasVariant) {
      page.drawText(item.variantTitle!, { x: margin + 4, y: y - 18, font: regular, size: 7.5, color: rgb(0.5, 0.5, 0.5) });
    }
    page.drawText(String(item.quantity),             { x: cQty + 8,   y: y - 8, font: regular, size: 8.5, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(fmtINR(item.price),                { x: cUnit - 10, y: y - 8, font: regular, size: 8.5, color: rgb(0.1, 0.1, 0.1) });
    page.drawText(fmtINR(item.price * item.quantity),{ x: cAmt - 6,   y: y - 8, font: bold,    size: 8.5, color: rgb(0.1, 0.1, 0.1) });

    y -= rowH;
  }

  page.drawLine({
    start: { x: margin, y }, end: { x: width - margin, y },
    thickness: 0.5, color: rgb(0.7, 0.7, 0.7),
  });
  y -= 14;

  // ── Totals ──────────────────────────────────────────────────────────────────
  const sx = margin + tableWidth - 205;

  const drawRow = (label: string, value: string, isBold = false) => {
    page.drawText(label, {
      x: sx, y, font: isBold ? bold : regular,
      size: isBold ? 10 : 8.5,
      color: isBold ? rgb(0, 0, 0) : rgb(0.35, 0.35, 0.35),
    });
    page.drawText(value, {
      x: cAmt - 6, y, font: isBold ? bold : regular,
      size: isBold ? 10 : 8.5,
      color: isBold ? rgb(0, 0, 0) : rgb(0.35, 0.35, 0.35),
    });
    y -= isBold ? 16 : 13;
  };

  drawRow("Subtotal", fmtINR(data.subtotal));
  if (data.discountAmount && data.discountAmount > 0) {
    drawRow(
      data.couponCode ? `Discount (${data.couponCode})` : "Discount",
      `- ${fmtINR(data.discountAmount)}`
    );
  }
  drawRow("Shipping", "Free");
  y -= 2;

  page.drawRectangle({
    x: sx - 8, y: y - 6, width: width - margin - sx + 8, height: 22,
    color: rgb(0.07, 0.07, 0.07),
  });
  page.drawText("TOTAL PAID", { x: sx, y: y + 1, font: bold, size: 10, color: rgb(1, 1, 1) });
  page.drawText(fmtINR(data.total), { x: cAmt - 6, y: y + 1, font: bold, size: 10, color: rgb(1, 1, 1) });

  // ── Footer ──────────────────────────────────────────────────────────────────
  page.drawLine({
    start: { x: margin, y: 50 }, end: { x: width - margin, y: 50 },
    thickness: 0.4, color: rgb(0.8, 0.8, 0.8),
  });
  page.drawText(
    "This is a computer-generated invoice. No signature required.",
    { x: margin, y: 36, font: regular, size: 7.5, color: rgb(0.6, 0.6, 0.6) }
  );
  page.drawText(
    "Agatsa Medical Technologies Pvt. Ltd.  Bengaluru, India  care@agatsa.com  agatsa.com",
    { x: margin, y: 24, font: regular, size: 7.5, color: rgb(0.6, 0.6, 0.6) }
  );

  return await doc.save();
}
