// Delivery Slip PDF — inspired by Amazon-style shipping labels.
// Built with pdf-lib. No barcodes — just clean info layout.

import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib@1.17.1";

export interface DeliverySlipData {
  orderId: string;
  orderDate: string;
  paymentMethod?: string;
  customerName: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: { productName: string; variantTitle?: string; quantity: number; price: number }[];
  total: number;
  weight?: string;
}

export async function buildDeliverySlipPdf(data: DeliverySlipData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();
  const m = 40; // margin
  const innerW = width - m * 2;
  let y = height - m;

  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);
  const lightGray = rgb(0.75, 0.75, 0.75);

  // ── Helper: draw a bordered box ──────────────────────────────
  const drawBox = (x: number, yTop: number, w: number, h: number) => {
    page.drawRectangle({ x, y: yTop - h, width: w, height: h, borderColor: black, borderWidth: 1 });
  };

  // ── Helper: draw label-value pair ────────────────────────────
  const drawLabelValue = (label: string, value: string, x: number, yPos: number, labelW = 110) => {
    page.drawText(label, { x, y: yPos, font: bold, size: 11, color: black });
    page.drawText(value, { x: x + labelW, y: yPos, font: regular, size: 11, color: black });
  };

  // ══════════════════════════════════════════════════════════════
  // SECTION 1: SHIP TO
  // ══════════════════════════════════════════════════════════════
  const shipToH = 120;
  drawBox(m, y, innerW, shipToH);

  let sy = y - 16;
  page.drawText("Ship To", { x: m + 8, y: sy, font: bold, size: 14, color: black });
  sy -= 20;
  page.drawText(data.customerName || "Customer", { x: m + 8, y: sy, font: bold, size: 13, color: black });
  sy -= 18;

  // Wrap address
  const addrParts = [data.shippingAddress, data.shippingCity, data.shippingState].filter(Boolean);
  for (const part of addrParts) {
    page.drawText(part, { x: m + 8, y: sy, font: regular, size: 12, color: black });
    sy -= 16;
  }
  if (data.shippingPincode) {
    page.drawText(data.shippingPincode, { x: m + 8, y: sy, font: bold, size: 12, color: black });
    sy -= 16;
  }
  if (data.customerPhone) {
    page.drawText(`Phone No.: ${data.customerPhone}`, { x: m + 8, y: sy, font: regular, size: 11, color: black });
  }

  y -= shipToH + 8;

  // ══════════════════════════════════════════════════════════════
  // SECTION 2: ORDER & SHIPMENT INFO
  // ══════════════════════════════════════════════════════════════
  const infoH = 70;
  drawBox(m, y, innerW / 2 - 2, infoH);
  drawBox(m + innerW / 2 + 2, y, innerW / 2 - 2, infoH);

  // Left box: dimensions / payment
  let ly = y - 14;
  const lx = m + 8;
  drawLabelValue("Payment:", data.paymentMethod || "PREPAID", lx, ly, 80);
  ly -= 18;
  drawLabelValue("ORDER TOTAL:", `${data.total.toLocaleString("en-IN")} INR`, lx, ly, 105);
  ly -= 18;
  drawLabelValue("Weight:", data.weight || "0.5 KG", lx, ly, 80);

  // Right box: routing info
  let ry = y - 16;
  const rx = m + innerW / 2 + 10;
  page.drawText("Agatsa Fulfillment", { x: rx, y: ry, font: bold, size: 12, color: black });
  ry -= 20;
  drawLabelValue("Order Date:", data.orderDate, rx, ry, 90);

  y -= infoH + 8;

  // ══════════════════════════════════════════════════════════════
  // SECTION 3: SHIPPED BY (IF UNDELIVERED, RETURN TO)
  // ══════════════════════════════════════════════════════════════
  const shippedH = 130;
  drawBox(m, y, innerW, shippedH);

  sy = y - 16;
  page.drawText("Shipped By", { x: m + 8, y: sy, font: bold, size: 12, color: black });
  page.drawText("(If undelivered, return to)", { x: m + 82, y: sy, font: regular, size: 9, color: gray });
  sy -= 18;
  page.drawText("Agatsa Software Pvt Ltd", { x: m + 8, y: sy, font: bold, size: 12, color: black });
  sy -= 16;
  page.drawText("A-270, Sector 69", { x: m + 8, y: sy, font: regular, size: 11, color: black });
  sy -= 15;
  page.drawText("Noida, Uttar Pradesh", { x: m + 8, y: sy, font: regular, size: 11, color: black });
  sy -= 15;
  page.drawText("201301", { x: m + 8, y: sy, font: bold, size: 11, color: black });
  sy -= 16;
  page.drawText("GSTIN: 09AAICA3515H1ZS", { x: m + 8, y: sy, font: regular, size: 9, color: gray });
  sy -= 14;
  page.drawText("Phone No.: +91-9717681555", { x: m + 8, y: sy, font: regular, size: 9, color: gray });

  // Right side: Order # and Invoice info
  ry = y - 18;
  const rx2 = m + innerW / 2 + 10;
  drawLabelValue("Order #:", data.orderId.slice(0, 28), rx2, ry, 70);
  ry -= 20;
  drawLabelValue("Invoice Date:", data.orderDate, rx2, ry, 100);

  y -= shippedH + 8;

  // ══════════════════════════════════════════════════════════════
  // SECTION 4: PRODUCT TABLE
  // ══════════════════════════════════════════════════════════════

  // Table header
  const colProduct = m + 8;
  const colQty = m + innerW - 200;
  const colUnitPrice = m + innerW - 140;
  const colTotal = m + innerW - 55;
  const headerH = 20;

  page.drawRectangle({ x: m, y: y - headerH, width: innerW, height: headerH, color: rgb(0.95, 0.95, 0.95), borderColor: black, borderWidth: 1 });
  const hy = y - 14;
  page.drawText("Product Name & SKU", { x: colProduct, y: hy, font: bold, size: 10, color: black });
  page.drawText("Qty", { x: colQty + 4, y: hy, font: bold, size: 10, color: black });
  page.drawText("Unit Price", { x: colUnitPrice, y: hy, font: bold, size: 10, color: black });
  page.drawText("Total", { x: colTotal, y: hy, font: bold, size: 10, color: black });

  y -= headerH;

  // Table rows
  for (const item of data.items) {
    const rowH = 28;
    drawBox(m, y, innerW, rowH);
    const iy = y - 12;
    const name = item.productName.length > 40 ? item.productName.slice(0, 39) + "..." : item.productName;
    page.drawText(name, { x: colProduct, y: iy, font: regular, size: 10, color: black });
    if (item.variantTitle && item.variantTitle !== "Default Title") {
      page.drawText(item.variantTitle, { x: colProduct, y: iy - 12, font: regular, size: 9, color: gray });
    }
    page.drawText(String(item.quantity), { x: colQty + 8, y: iy, font: regular, size: 10, color: black });
    page.drawText(`${item.price.toLocaleString("en-IN")}`, { x: colUnitPrice, y: iy, font: regular, size: 10, color: black });
    page.drawText(`${(item.price * item.quantity).toLocaleString("en-IN")}`, { x: colTotal, y: iy, font: regular, size: 10, color: black });
    y -= rowH;
  }

  y -= 16;

  // ══════════════════════════════════════════════════════════════
  // SECTION 5: DISCLAIMER
  // ══════════════════════════════════════════════════════════════
  const disclaimerH = 40;
  drawBox(m, y, innerW, disclaimerH);
  page.drawText(
    "All disputes are subject to Noida jurisdiction only. Goods once sold will only be",
    { x: m + 8, y: y - 16, font: regular, size: 9, color: black }
  );
  page.drawText(
    "taken back or exchanged as per the store's exchange/return policy.",
    { x: m + 8, y: y - 28, font: regular, size: 9, color: black }
  );

  y -= disclaimerH + 10;

  // Footer
  page.drawText(
    "THIS IS AN AUTO-GENERATED LABEL AND DOES NOT NEED SIGNATURE.",
    { x: m, y: y, font: bold, size: 7, color: gray }
  );
  page.drawText("Powered by Agatsa", { x: width - m - 80, y: y, font: regular, size: 7, color: gray });

  return await doc.save();
}
