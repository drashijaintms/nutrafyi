const PDFDocument = require("pdfkit");

/**
 * Generates an invoice PDF for an order and writes it to the provided stream.
 * @param {Object} order - The order document from Mongoose.
 * @param {Stream} writeStream - Writable stream (like HTTP res or file stream).
 */
const generateInvoicePDF = (order, writeStream) => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  doc.pipe(writeStream);

  // --- HEADER ---
  doc.fontSize(20).text("NUTRAFYI INC.", 50, 50, { align: "left" });
  doc.fontSize(10).text("Email: support@nutrafyi.com | Phone: +1 800 555 0199", 50, 75);
  doc.text("Address: 100 Innovation Way, Suite 400, NY 10001", 50, 90);

  doc.fontSize(24).text("INVOICE", 400, 50, { align: "right" });
  doc.fontSize(10).text(`Invoice #: INV-${order.orderId}`, 400, 80, { align: "right" });
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 95, { align: "right" });

  doc.moveDown(2);

  // --- BILL TO / SHIP TO ---
  const billing = order.billingDetails || {};
  const shipping = order.shippingDetails || {};

  doc.fontSize(12).font("Helvetica-Bold").text("Bill To:", 50, 140);
  doc.fontSize(10).font("Helvetica")
     .text(order.customer.name, 50, 155)
     .text(order.customer.email, 50, 170)
     .text(order.customer.phone, 50, 185)
     .text(`${billing.address || ""}, ${billing.city || ""}, ${billing.state || ""} - ${billing.zip || ""}`, 50, 200);

  doc.fontSize(12).font("Helvetica-Bold").text("Ship To:", 300, 140);
  doc.fontSize(10).font("Helvetica")
     .text(order.customer.name, 300, 155)
     .text(`${shipping.address || ""}, ${shipping.city || ""}, ${shipping.state || ""} - ${shipping.zip || ""}`, 300, 170)
     .text(shipping.country || "", 300, 185);

  doc.moveDown(3);

  // --- ITEMS TABLE ---
  let tableTop = 240;
  doc.font("Helvetica-Bold");
  doc.text("Item Description", 50, tableTop);
  doc.text("SKU", 250, tableTop);
  doc.text("Price", 350, tableTop, { width: 60, align: "right" });
  doc.text("Qty", 420, tableTop, { width: 40, align: "right" });
  doc.text("Total", 480, tableTop, { width: 60, align: "right" });

  // Draw line under table header
  doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).stroke();

  const curSym = order.currencySymbol || "$";

  doc.font("Helvetica");
  let currentY = tableTop + 25;

  (order.items || []).forEach((item) => {
    // Wrap text if needed
    doc.text(item.title, 50, currentY, { width: 190 });
    doc.text(item.sku || "N/A", 250, currentY);
    doc.text(`${curSym}${item.price.toFixed(2)}`, 350, currentY, { width: 60, align: "right" });
    doc.text(item.quantity.toString(), 420, currentY, { width: 40, align: "right" });
    doc.text(`${curSym}${(item.price * item.quantity).toFixed(2)}`, 480, currentY, { width: 60, align: "right" });

    currentY += 25;
  });

  doc.moveTo(50, currentY).lineTo(540, currentY).stroke();
  currentY += 15;

  // --- TOTALS ---
  const amount = order.amount || {};
  doc.font("Helvetica-Bold");

  doc.text("Subtotal:", 350, currentY, { width: 100, align: "right" });
  doc.font("Helvetica").text(`${curSym}${(amount.subtotal || 0).toFixed(2)}`, 480, currentY, { width: 60, align: "right" });
  currentY += 20;

  if (amount.discount > 0) {
    doc.font("Helvetica-Bold").text("Discount:", 350, currentY, { width: 100, align: "right" });
    doc.font("Helvetica").text(`-${curSym}${(amount.discount || 0).toFixed(2)}`, 480, currentY, { width: 60, align: "right" });
    currentY += 20;
  }

  doc.font("Helvetica-Bold").text("Shipping:", 350, currentY, { width: 100, align: "right" });
  doc.font("Helvetica").text(`${curSym}${(amount.shipping || 0).toFixed(2)}`, 480, currentY, { width: 60, align: "right" });
  currentY += 20;

  doc.font("Helvetica-Bold").text("Total Due:", 350, currentY, { width: 100, align: "right" });
  doc.fontSize(12).font("Helvetica-Bold").text(`${curSym}${(amount.total || 0).toFixed(2)}`, 480, currentY - 2, { width: 60, align: "right" });

  // --- FOOTER ---
  doc.fontSize(10).font("Helvetica")
     .text("Thank you for shopping with NutraFyi!", 50, 750, { align: "center" });

  doc.end();
};

module.exports = { generateInvoicePDF };
