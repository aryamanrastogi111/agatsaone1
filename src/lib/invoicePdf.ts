import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

function formatINR(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function generateCustomerInvoicePdf(data: InvoiceData): Uint8Array {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", W - margin, 28, { align: "right" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Agatsa Medical Technologies Pvt. Ltd.", margin, 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text("Bengaluru, Karnataka, India", margin, 28);
  doc.text("care@agatsa.com  |  agatsa.com", margin, 33);

  // Divider
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, 40, W - margin, 40);

  // ── Invoice Meta ─────────────────────────────────────────────────────────────
  const metaY = 48;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Date", margin, metaY);
  doc.text("Order ID", margin + 55, metaY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(data.orderDate, margin, metaY + 5);
  doc.setFontSize(8);
  doc.text(data.orderId, margin + 55, metaY + 5);
  if (data.paymentId) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Payment ID", margin + 55, metaY + 12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(data.paymentId, margin + 55, metaY + 17);
  }

  // ── Bill To ──────────────────────────────────────────────────────────────────
  const billY = 72;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("BILL TO", margin, billY);
  doc.setLineWidth(0.3);
  doc.line(margin, billY + 2, margin + 30, billY + 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(data.customerName || "—", margin, billY + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  let addrY = billY + 15;
  const addressLines = [
    data.shippingAddress,
    [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
    data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
    data.customerEmail,
    data.customerPhone ?? "",
  ].filter(Boolean);
  addressLines.forEach((line) => {
    doc.text(line, margin, addrY);
    addrY += 5;
  });

  // ── Items Table ───────────────────────────────────────────────────────────────
  const tableStartY = Math.max(addrY + 6, 110);

  const tableRows = data.items.map((item) => [
    item.productName + (item.variantTitle && item.variantTitle !== "Default Title" ? `\n${item.variantTitle}` : ""),
    formatINR(item.price),
    String(item.quantity),
    formatINR(item.price * item.quantity),
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [["Description", "Unit Price", "Qty", "Amount"]],
    body: tableRows,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 30, 30],
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
    },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 32 },
      2: { halign: "center", cellWidth: 18 },
      3: { halign: "right", cellWidth: 32 },
    },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.2,
  });

  // ── Totals ───────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterTable = (doc as any).lastAutoTable.finalY + 6;
  const totalsX = W - margin - 60;

  let totY = afterTable;
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  // Subtotal
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", totalsX, totY);
  doc.text(formatINR(data.subtotal), W - margin, totY, { align: "right" });
  totY += 6;

  // Discount
  if (data.discountAmount && data.discountAmount > 0) {
    doc.text(`Discount${data.couponCode ? ` (${data.couponCode})` : ""}`, totalsX, totY);
    doc.text(`- ${formatINR(data.discountAmount)}`, W - margin, totY, { align: "right" });
    totY += 6;
  }

  // Shipping
  doc.text("Shipping", totalsX, totY);
  doc.text("Free", W - margin, totY, { align: "right" });
  totY += 6;

  // Divider
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(totalsX, totY, W - margin, totY);
  totY += 5;

  // Total
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Total", totalsX, totY);
  doc.text(formatINR(data.total), W - margin, totY, { align: "right" });
  totY += 5;

  // Payment note
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Payment received via Razorpay", totalsX, totY);

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pageH = 297;
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, pageH - 22, W - margin, pageH - 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for your purchase.", margin, pageH - 16);
  doc.text("For queries: care@agatsa.com  |  agatsa.com/support", margin, pageH - 11);
  doc.text("Agatsa Medical Technologies Pvt. Ltd., Bengaluru, India", W - margin, pageH - 11, { align: "right" });

  return doc.output("arraybuffer") as unknown as Uint8Array;
}

export function downloadCustomerInvoice(data: InvoiceData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  doc.text("INVOICE", W - margin, 28, { align: "right" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Agatsa Medical Technologies Pvt. Ltd.", margin, 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text("Bengaluru, Karnataka, India", margin, 28);
  doc.text("care@agatsa.com  |  agatsa.com", margin, 33);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, 40, W - margin, 40);

  const metaY = 48;
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice Date", margin, metaY);
  doc.text("Order ID", margin + 55, metaY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text(data.orderDate, margin, metaY + 5);
  doc.setFontSize(8);
  doc.text(data.orderId, margin + 55, metaY + 5);
  if (data.paymentId) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Payment ID", margin + 55, metaY + 12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(data.paymentId, margin + 55, metaY + 17);
  }

  const billY = 72;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("BILL TO", margin, billY);
  doc.setLineWidth(0.3);
  doc.line(margin, billY + 2, margin + 30, billY + 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(data.customerName || "—", margin, billY + 9);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  let addrY = billY + 15;
  const addressLines = [
    data.shippingAddress,
    [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
    data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
    data.customerEmail,
    data.customerPhone ?? "",
  ].filter(Boolean);
  addressLines.forEach((line) => {
    doc.text(line, margin, addrY);
    addrY += 5;
  });

  const tableStartY = Math.max(addrY + 6, 110);
  const tableRows = data.items.map((item) => [
    item.productName + (item.variantTitle && item.variantTitle !== "Default Title" ? `\n${item.variantTitle}` : ""),
    formatINR(item.price),
    String(item.quantity),
    formatINR(item.price * item.quantity),
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [["Description", "Unit Price", "Qty", "Amount"]],
    body: tableRows,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [30, 30, 30],
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
    },
    alternateRowStyles: { fillColor: [248, 248, 248] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 32 },
      2: { halign: "center", cellWidth: 18 },
      3: { halign: "right", cellWidth: 32 },
    },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.2,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterTable = (doc as any).lastAutoTable.finalY + 6;
  const totalsX = W - margin - 60;
  let totY = afterTable;

  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", totalsX, totY);
  doc.text(formatINR(data.subtotal), W - margin, totY, { align: "right" });
  totY += 6;

  if (data.discountAmount && data.discountAmount > 0) {
    doc.text(`Discount${data.couponCode ? ` (${data.couponCode})` : ""}`, totalsX, totY);
    doc.text(`- ${formatINR(data.discountAmount)}`, W - margin, totY, { align: "right" });
    totY += 6;
  }

  doc.text("Shipping", totalsX, totY);
  doc.text("Free", W - margin, totY, { align: "right" });
  totY += 6;

  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(totalsX, totY, W - margin, totY);
  totY += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Total", totalsX, totY);
  doc.text(formatINR(data.total), W - margin, totY, { align: "right" });
  totY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Payment received via Razorpay", totalsX, totY);

  const pageH = 297;
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, pageH - 22, W - margin, pageH - 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for your purchase.", margin, pageH - 16);
  doc.text("For queries: care@agatsa.com  |  agatsa.com/support", margin, pageH - 11);
  doc.text("Agatsa Medical Technologies Pvt. Ltd., Bengaluru, India", W - margin, pageH - 11, { align: "right" });

  doc.save(`invoice-${data.orderId}.pdf`);
}

/**
 * Admin operations invoice — includes all customer details for internal reference
 */
export function downloadAdminInvoice(data: InvoiceData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text("Agatsa Medical Technologies Pvt. Ltd.", margin, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Bengaluru, Karnataka, India  |  care@agatsa.com  |  agatsa.com", margin, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(0, 0, 0);
  doc.text("OPERATIONS", W - margin, 20, { align: "right" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("INTERNAL INVOICE", W - margin, 27, { align: "right" });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.6);
  doc.line(margin, 33, W - margin, 33);

  // "INTERNAL USE ONLY" stamp area (subtle)
  doc.setFontSize(7);
  doc.setTextColor(160, 160, 160);
  doc.setFont("helvetica", "normal");
  doc.text("FOR INTERNAL USE ONLY — NOT FOR CUSTOMER DISTRIBUTION", W / 2, 38, { align: "center" });

  // ── Two-column meta ──────────────────────────────────────────────────────────
  const col1 = margin;
  const col2 = 110;
  let rowY = 46;

  // Left col
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Order ID", col1, rowY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(data.orderId, col1, rowY + 5);

  if (data.paymentId) {
    doc.setFont("helvetica", "bold");
    doc.text("Payment ID", col1, rowY + 12);
    doc.setFont("helvetica", "normal");
    doc.text(data.paymentId, col1, rowY + 17);
  }

  // Right col
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Invoice Date", col2, rowY);
  doc.setFont("helvetica", "normal");
  doc.text(data.orderDate, col2, rowY + 5);
  doc.setFont("helvetica", "bold");
  doc.text("Order Status", col2, rowY + 12);
  doc.setFont("helvetica", "normal");
  doc.text("PAID", col2, rowY + 17);

  // ── Customer & Shipping ──────────────────────────────────────────────────────
  rowY = 75;
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("CUSTOMER DETAILS", col1, rowY);
  doc.setLineWidth(0.3);
  doc.line(col1, rowY + 2, col1 + 50, rowY + 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  rowY += 7;
  const customerLines = [
    data.customerName,
    data.customerEmail,
    data.customerPhone ?? "",
  ].filter(Boolean);
  customerLines.forEach((line) => {
    doc.text(line, col1, rowY);
    rowY += 5;
  });

  // Shipping address (right col)
  let addrY = 75;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("SHIPPING ADDRESS", col2, addrY);
  doc.setLineWidth(0.3);
  doc.line(col2, addrY + 2, col2 + 50, addrY + 2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  addrY += 7;
  const addrLines = [
    data.shippingAddress,
    [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
    data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
  ].filter(Boolean);
  addrLines.forEach((line) => {
    doc.text(line, col2, addrY);
    addrY += 5;
  });

  // ── Items Table ───────────────────────────────────────────────────────────────
  const tableY = Math.max(rowY, addrY) + 8;

  const tableRows = data.items.map((item) => [
    item.productName + (item.variantTitle && item.variantTitle !== "Default Title" ? `\n${item.variantTitle}` : ""),
    formatINR(item.price),
    String(item.quantity),
    formatINR(item.price * item.quantity),
  ]);

  autoTable(doc, {
    startY: tableY,
    head: [["Description / SKU", "Unit Price", "Qty", "Amount"]],
    body: tableRows,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [20, 20, 20],
      cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 32 },
      2: { halign: "center", cellWidth: 18 },
      3: { halign: "right", cellWidth: 32 },
    },
    tableLineColor: [180, 180, 180],
    tableLineWidth: 0.2,
  });

  // ── Totals ───────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const afterTable = (doc as any).lastAutoTable.finalY + 6;
  const totalsX = W - margin - 65;
  let totY = afterTable;

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);

  doc.text("Subtotal", totalsX, totY);
  doc.text(formatINR(data.subtotal), W - margin, totY, { align: "right" });
  totY += 6;

  if (data.discountAmount && data.discountAmount > 0) {
    doc.text(`Discount${data.couponCode ? ` (${data.couponCode})` : ""}`, totalsX, totY);
    doc.text(`- ${formatINR(data.discountAmount)}`, W - margin, totY, { align: "right" });
    totY += 6;
  }

  doc.text("Shipping", totalsX, totY);
  doc.text("Free", W - margin, totY, { align: "right" });
  totY += 6;

  doc.setLineWidth(0.4);
  doc.setDrawColor(0, 0, 0);
  doc.line(totalsX, totY, W - margin, totY);
  totY += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Grand Total", totalsX, totY);
  doc.text(formatINR(data.total), W - margin, totY, { align: "right" });
  totY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Payment received via Razorpay. Amount in INR.", totalsX, totY);

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pageH = 297;
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.line(margin, pageH - 22, W - margin, pageH - 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}  |  FOR INTERNAL OPERATIONS USE ONLY`, margin, pageH - 16);
  doc.text("Agatsa Medical Technologies Pvt. Ltd., Bengaluru, India", W - margin, pageH - 16, { align: "right" });

  doc.save(`operations-invoice-${data.orderId}.pdf`);
}
