import { jsPDF } from "jspdf";
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

function buildDoc(data: InvoiceData, isAdmin: boolean): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const margin = 20;

  // ── Header ──────────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Agatsa Medical Technologies Pvt. Ltd.", margin, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text("Bengaluru, Karnataka, India  |  care@agatsa.com  |  agatsa.com", margin, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 0);
  doc.text(isAdmin ? "OPERATIONS INVOICE" : "INVOICE", W - margin, 20, { align: "right" });

  if (isAdmin) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text("INTERNAL USE ONLY", W - margin, 27, { align: "right" });
  }

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, 33, W - margin, 33);

  // ── Meta row ─────────────────────────────────────────────────────────────────
  const col1 = margin;
  const col2 = isAdmin ? 80 : 90;
  const col3 = isAdmin ? 140 : undefined;
  let metaY = 41;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("ORDER ID", col1, metaY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text(data.orderId, col1, metaY + 5);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("DATE", col2, metaY);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.text(data.orderDate, col2, metaY + 5);

  if (data.paymentId && col3) {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("PAYMENT ID", col3, metaY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7.5);
    doc.text(data.paymentId, col3, metaY + 5);
  } else if (data.paymentId && !col3) {
    metaY += 12;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("PAYMENT ID", col1, metaY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7.5);
    doc.text(data.paymentId, col1, metaY + 5);
    metaY += 5;
  }

  // ── Bill To / Customer Section ────────────────────────────────────────────────
  const sectionY = 63;
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("BILL TO", col1, sectionY);
  doc.setLineWidth(0.2);
  doc.setDrawColor(0, 0, 0);
  doc.line(col1, sectionY + 1.5, col1 + 25, sectionY + 1.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(data.customerName || "—", col1, sectionY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  let addrY = sectionY + 14;

  const billLines = [
    data.shippingAddress,
    [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
    data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
    data.customerEmail,
    data.customerPhone ?? "",
  ].filter(Boolean);

  billLines.forEach((line) => {
    doc.text(line, col1, addrY);
    addrY += 5;
  });

  // For admin: show shipping address separately on the right
  if (isAdmin) {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("SHIPPING ADDRESS", col2 + 10, sectionY);
    doc.setLineWidth(0.2);
    doc.line(col2 + 10, sectionY + 1.5, col2 + 55, sectionY + 1.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    let shipY = sectionY + 8;
    const shipLines = [
      data.customerName,
      data.shippingAddress,
      [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
      data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
    ].filter(Boolean);
    shipLines.forEach((line) => {
      doc.text(line, col2 + 10, shipY);
      shipY += 5;
    });
  }

  // ── Items Table ───────────────────────────────────────────────────────────────
  const tableStartY = Math.max(addrY + 8, 108);

  const tableRows = data.items.map((item) => [
    item.variantTitle && item.variantTitle !== "Default Title"
      ? `${item.productName} (${item.variantTitle})`
      : item.productName,
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
      fillColor: [20, 20, 20],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [20, 20, 20],
      fillColor: [255, 255, 255],
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
    },
    alternateRowStyles: { fillColor: [247, 247, 247] },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "right", cellWidth: 34 },
      2: { halign: "center", cellWidth: 16 },
      3: { halign: "right", cellWidth: 34 },
    },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.2,
    showHead: "firstPage",
  });

  // ── Totals ───────────────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY ?? tableStartY + 20;
  const totalsX = W - margin - 65;
  let totY = finalY + 8;

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
  doc.text(isAdmin ? "Grand Total" : "Total", totalsX, totY);
  doc.text(formatINR(data.total), W - margin, totY, { align: "right" });
  totY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text("Payment received via Razorpay. Amount in INR.", totalsX, totY);

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pageH = 297;
  doc.setLineWidth(0.3);
  doc.setDrawColor(180, 180, 180);
  doc.line(margin, pageH - 20, W - margin, pageH - 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);

  if (isAdmin) {
    doc.text(
      `Generated: ${new Date().toLocaleString("en-IN")}  |  FOR INTERNAL OPERATIONS USE ONLY`,
      margin, pageH - 14
    );
  } else {
    doc.text("Thank you for your purchase.", margin, pageH - 14);
    doc.text("For queries: care@agatsa.com  |  agatsa.com/support", margin, pageH - 9);
  }
  doc.text("Agatsa Medical Technologies Pvt. Ltd., Bengaluru, India", W - margin, pageH - 14, { align: "right" });

  return doc;
}

export function generateCustomerInvoicePdf(data: InvoiceData): Uint8Array {
  const doc = buildDoc(data, false);
  return doc.output("arraybuffer") as unknown as Uint8Array;
}

export function downloadCustomerInvoice(data: InvoiceData): void {
  const doc = buildDoc(data, false);
  doc.save(`invoice-${data.orderId}.pdf`);
}

export function downloadAdminInvoice(data: InvoiceData): void {
  const doc = buildDoc(data, true);
  doc.save(`operations-invoice-${data.orderId}.pdf`);
}
