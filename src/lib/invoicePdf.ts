import { jsPDF } from "jspdf";

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

function fmt(amount: number): string {
  return "Rs. " + amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Manual table renderer (no plugin needed) ────────────────────────────────
function drawTable(
  doc: jsPDF,
  startY: number,
  rows: string[][],
  colWidths: number[],
  marginLeft: number,
  pageWidth: number
): number {
  const ROW_H = 8;
  const HEAD_H = 9;
  const PAD_L = 3;
  const PAD_T = 6;
  const headers = ["Description", "Unit Price", "Qty", "Amount"];
  const aligns: ("left" | "right" | "center")[] = ["left", "right", "center", "right"];

  let y = startY;
  const tableW = colWidths.reduce((a, b) => a + b, 0);

  // Header background
  doc.setFillColor(20, 20, 20);
  doc.rect(marginLeft, y, tableW, HEAD_H, "F");

  // Header text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  let cx = marginLeft;
  for (let i = 0; i < headers.length; i++) {
    const tx =
      aligns[i] === "right"
        ? cx + colWidths[i] - PAD_L
        : aligns[i] === "center"
        ? cx + colWidths[i] / 2
        : cx + PAD_L;
    doc.text(headers[i], tx, y + PAD_T, { align: aligns[i] });
    cx += colWidths[i];
  }
  y += HEAD_H;

  // Rows
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];

    // Wrap description text
    const descMaxW = colWidths[0] - PAD_L * 2;
    const descLines = doc.splitTextToSize(row[0], descMaxW) as string[];
    const rowHeight = Math.max(ROW_H, descLines.length * 5 + 4);

    // Alternate row fill
    if (r % 2 === 0) {
      doc.setFillColor(247, 247, 247);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(marginLeft, y, tableW, rowHeight, "F");

    // Row bottom border
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(marginLeft, y + rowHeight, marginLeft + tableW, y + rowHeight);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 20);

    cx = marginLeft;
    for (let i = 0; i < row.length; i++) {
      const cellTop = y + 5;
      if (i === 0) {
        // Description may wrap
        for (let li = 0; li < descLines.length; li++) {
          doc.text(descLines[li], cx + PAD_L, cellTop + li * 5);
        }
      } else {
        const tx =
          aligns[i] === "right"
            ? cx + colWidths[i] - PAD_L
            : aligns[i] === "center"
            ? cx + colWidths[i] / 2
            : cx + PAD_L;
        doc.text(row[i], tx, cellTop, { align: aligns[i] });
      }
      cx += colWidths[i];
    }

    y += rowHeight;
  }

  // Outer border
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.rect(marginLeft, startY, tableW, y - startY, "S");

  return y; // returns bottom Y
}

// ─── Shared document builder ─────────────────────────────────────────────────
function buildDoc(data: InvoiceData, isAdmin: boolean): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const margin = 18;

  // ── Header bar ───────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Agatsa Medical Technologies Pvt. Ltd.", margin, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 90);
  doc.text("Bengaluru, Karnataka, India  |  care@agatsa.com  |  agatsa.com", margin, 26);

  // Title (right)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(isAdmin ? 18 : 22);
  doc.setTextColor(0, 0, 0);
  doc.text(isAdmin ? "OPERATIONS INVOICE" : "INVOICE", W - margin, 20, { align: "right" });

  if (isAdmin) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text("INTERNAL USE ONLY", W - margin, 27, { align: "right" });
  }

  // Divider
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, 32, W - margin, 32);

  // ── Order meta ───────────────────────────────────────────────────────────────
  const metaY = 40;
  const col2 = 80;
  const col3 = 140;

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("ORDER ID", margin, metaY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(data.orderId, margin, metaY + 5);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text("DATE", col2, metaY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  doc.text(data.orderDate, col2, metaY + 5);

  if (data.paymentId) {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("PAYMENT ID", col3, metaY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(0, 0, 0);
    doc.text(data.paymentId, col3, metaY + 5);
  }

  // ── Bill To section ───────────────────────────────────────────────────────────
  const billY = 58;
  const rightCol = 115;

  // Left — Bill To
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("BILL TO", margin, billY);
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.2);
  doc.line(margin, billY + 1.5, margin + 28, billY + 1.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(data.customerName || "—", margin, billY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(50, 50, 50);
  let addrY = billY + 14;
  const billLines = [
    data.shippingAddress,
    [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
    data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
    data.customerEmail,
    data.customerPhone ?? "",
  ].filter(Boolean);

  billLines.forEach((line) => {
    doc.text(line, margin, addrY);
    addrY += 5;
  });

  // Right — Shipping Address (admin only, or repeat for customer)
  if (isAdmin) {
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("SHIP TO", rightCol, billY);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.2);
    doc.line(rightCol, billY + 1.5, rightCol + 22, billY + 1.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(data.customerName || "—", rightCol, billY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    let shipY = billY + 14;
    const shipLines = [
      data.shippingAddress,
      [data.shippingCity, data.shippingState].filter(Boolean).join(", "),
      data.shippingPincode ? `PIN: ${data.shippingPincode}` : "",
    ].filter(Boolean);
    shipLines.forEach((line) => {
      doc.text(line, rightCol, shipY);
      shipY += 5;
    });
  }

  // ── Items table ───────────────────────────────────────────────────────────────
  const tableY = Math.max(addrY + 8, 105);
  const usableW = W - margin * 2;
  // col widths: Description auto, Unit Price, Qty, Amount
  const colWidths = [usableW - 34 - 16 - 34, 34, 16, 34];

  const tableRows = data.items.map((item) => [
    item.variantTitle && item.variantTitle !== "Default Title"
      ? `${item.productName} (${item.variantTitle})`
      : item.productName,
    fmt(item.price),
    String(item.quantity),
    fmt(item.price * item.quantity),
  ]);

  const tableBottom = drawTable(doc, tableY, tableRows, colWidths, margin, usableW);

  // ── Totals ───────────────────────────────────────────────────────────────────
  const totalsX = W - margin - 70;
  let totY = tableBottom + 8;

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);

  doc.text("Subtotal", totalsX, totY);
  doc.text(fmt(data.subtotal), W - margin, totY, { align: "right" });
  totY += 6;

  if (data.discountAmount && data.discountAmount > 0) {
    doc.text(`Discount${data.couponCode ? ` (${data.couponCode})` : ""}`, totalsX, totY);
    doc.text(`- ${fmt(data.discountAmount)}`, W - margin, totY, { align: "right" });
    totY += 6;
  }

  doc.text("Shipping", totalsX, totY);
  doc.text("Free", W - margin, totY, { align: "right" });
  totY += 6;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.4);
  doc.line(totalsX, totY, W - margin, totY);
  totY += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(isAdmin ? "Grand Total" : "Total", totalsX, totY);
  doc.text(fmt(data.total), W - margin, totY, { align: "right" });
  totY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text("Payment received via Razorpay. Amount in INR.", totalsX, totY);

  // ── Footer ───────────────────────────────────────────────────────────────────
  const pageH = 297;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
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
    doc.text("Queries: care@agatsa.com  |  agatsa.com/support", margin, pageH - 9);
  }
  doc.text("Agatsa Medical Technologies Pvt. Ltd., Bengaluru, India", W - margin, pageH - 14, {
    align: "right",
  });

  return doc;
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function generateCustomerInvoicePdf(data: InvoiceData): Uint8Array {
  const doc = buildDoc(data, false);
  return doc.output("arraybuffer") as unknown as Uint8Array;
}

export function downloadCustomerInvoice(data: InvoiceData): void {
  buildDoc(data, false).save(`invoice-${data.orderId}.pdf`);
}

export function downloadAdminInvoice(data: InvoiceData): void {
  buildDoc(data, true).save(`operations-invoice-${data.orderId}.pdf`);
}
