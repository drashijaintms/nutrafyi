const Order = require("../models/Order");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const { generateInvoicePDF } = require("../utils/invoiceHelper");
const { logAdminActivity } = require("../middleware/activityLogger");

// @desc    Get all orders (with paging & filters)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, paymentStatus, search } = req.query;

    let query = {};

    if (status) query.status = status;
    if (paymentStatus) query["paymentDetails.status"] = paymentStatus;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const oldStatus = order.status;
    if (oldStatus === status) {
      return res.status(400).json({ message: `Order is already "${status}"` });
    }

    // Update Status
    order.status = status;
    order.statusHistory.push({
      status,
      note: note || `Order status updated from ${oldStatus} to ${status}.`,
    });

    // Handle payment status auto-updates
    if (status === "Delivered" && order.paymentDetails.method === "COD") {
      order.paymentDetails.status = "Paid";
    }

    // Rollback stock if order is Cancelled or Refunded and was not cancelled/refunded previously
    if (
      (status === "Cancelled" || status === "Refunded") &&
      oldStatus !== "Cancelled" &&
      oldStatus !== "Refunded"
    ) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const oldStock = product.stockQuantity;
          product.stockQuantity += item.quantity;
          product.stockStatus = product.stockQuantity > 0 ? "In Stock" : "Out of Stock";
          await product.save();

          // Log inventory transaction
          await Inventory.create({
            product: product._id,
            type: "Return",
            quantityChange: item.quantity,
            remainingStock: product.stockQuantity,
            note: `Stock restored from order ${status} (Order: ${order.orderId})`,
            adminRef: req.admin._id,
          });
        }
      }
    }

    // Deduct stock if order goes from Cancelled/Refunded back to active statuses (edge case recovery)
    if (
      (oldStatus === "Cancelled" || oldStatus === "Refunded") &&
      status !== "Cancelled" &&
      status !== "Refunded"
    ) {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const oldStock = product.stockQuantity;
          product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
          product.stockStatus = product.stockQuantity > 0 ? "In Stock" : "Out of Stock";
          await product.save();

          // Log inventory transaction
          await Inventory.create({
            product: product._id,
            type: "Sale",
            quantityChange: -item.quantity,
            remainingStock: product.stockQuantity,
            note: `Stock deducted on reactivation from cancelled/refunded status (Order: ${order.orderId})`,
            adminRef: req.admin._id,
          });
        }
      }
    }

    await order.save();

    // Log admin activity
    await logAdminActivity(
      req.admin._id,
      "Update Order Status",
      `Updated Order #${order.orderId} status to "${status}"`
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download invoice PDF
// @route   GET /api/orders/:id/invoice
// @access  Private
const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order.orderId}.pdf`
    );

    generateInvoicePDF(order, res);
  } catch (error) {
    console.error("PDF generation failed:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  downloadInvoice,
};
