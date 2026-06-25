const Order = require("../models/Order");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const Customer = require("../models/Customer");
const Coupon = require("../models/Coupon");
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
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const orderObj = order.toObject();
    orderObj.items = orderObj.items.map(item => {
      if (item.product) {
        return {
          ...item,
          image: item.image || item.product.image || "",
          slug: item.slug || item.product.slug || "",
          product: item.product._id
        };
      }
      return item;
    });

    res.json(orderObj);
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

// @desc    Create a new order (storefront)
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      shippingDetails,
      billingDetails,
      paymentDetails,
      amount,
      appliedCoupon,
      currency,
      currencySymbol
    } = req.body;

    if (!customer || !items || items.length === 0 || !shippingDetails || !billingDetails || !amount) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // 1. Generate unique orderId
    let orderId;
    let isUnique = false;
    while (!isUnique) {
      orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
      const existing = await Order.findOne({ orderId });
      if (!existing) isUnique = true;
    }

    // 2. Process and verify items, update stock & log inventory
    const processedItems = [];
    const mongoose = require("mongoose");
    for (const item of items) {
      // Find product by ID or Slug
      let product = null;
      if (mongoose.Types.ObjectId.isValid(item.product)) {
        product = await Product.findById(item.product);
      }
      if (!product) {
        product = await Product.findOne({ slug: item.product });
      }

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.title}` });
      }

      // Update product stock
      const oldStock = product.stockQuantity;
      product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
      product.stockStatus = product.stockQuantity > 0 ? "In Stock" : "Out of Stock";
      await product.save();

      // Check if low stock threshold is reached
      if (product.manageStock && product.stockQuantity <= product.lowStockThreshold) {
        try {
          const Notification = require("../models/Notification");
          const exists = await Notification.findOne({
            type: "Low Stock",
            title: `Low Stock: ${product.title}`
          });
          if (!exists) {
            await Notification.create({
              type: "Low Stock",
              title: `Low Stock: ${product.title}`,
              message: `Product "${product.title}" has reached low stock threshold. Remaining: ${product.stockQuantity}`,
              link: "/inventory"
            });
          }
        } catch (notifErr) {
          console.error("Failed to create low stock notification:", notifErr);
        }
      }

      // Log inventory transaction
      await Inventory.create({
        product: product._id,
        type: "Sale",
        quantityChange: -item.quantity,
        remainingStock: product.stockQuantity,
        note: `Storefront order sale (Order: ${orderId})`,
      });

      processedItems.push({
        product: product._id,
        title: product.title,
        sku: product.sku || "",
        price: item.price,
        quantity: item.quantity,
        variation: item.variation || {},
        image: product.image || "",
        slug: product.slug || "",
      });
    }

    // 3. Find or Create Customer
    let customerDb = await Customer.findOne({ email: customer.email.toLowerCase() });
    if (!customerDb) {
      customerDb = new Customer({
        name: customer.name,
        email: customer.email.toLowerCase(),
        phone: customer.phone || "",
        totalOrders: 1,
        totalSpending: amount.total,
        addresses: [
          {
            addressType: "Shipping",
            address: shippingDetails.address,
            city: shippingDetails.city,
            state: shippingDetails.state,
            zip: shippingDetails.zip,
            country: shippingDetails.country,
          },
          {
            addressType: "Billing",
            address: billingDetails.address,
            city: billingDetails.city,
            state: billingDetails.state,
            zip: billingDetails.zip,
            country: billingDetails.country,
          }
        ],
        activityHistory: [
          {
            action: `Placed Order #${orderId}`,
            timestamp: new Date(),
          }
        ]
      });
    } else {
      customerDb.totalOrders += 1;
      customerDb.totalSpending += amount.total;
      customerDb.phone = customer.phone || customerDb.phone;
      
      const hasAddress = customerDb.addresses.some(
        (addr) =>
          addr.address === shippingDetails.address &&
          addr.city === shippingDetails.city &&
          addr.zip === shippingDetails.zip
      );
      if (!hasAddress) {
        customerDb.addresses.push({
          addressType: "Shipping",
          address: shippingDetails.address,
          city: shippingDetails.city,
          state: shippingDetails.state,
          zip: shippingDetails.zip,
          country: shippingDetails.country,
        });
      }

      customerDb.activityHistory.push({
        action: `Placed Order #${orderId}`,
        timestamp: new Date(),
      });
    }
    await customerDb.save();

    // 4. Update coupon usage count if valid
    if (appliedCoupon) {
      const couponObj = await Coupon.findOne({ code: appliedCoupon.toUpperCase() });
      if (couponObj) {
        couponObj.usageCount += 1;
        await couponObj.save();
      }
    }

    // 5. Create Order
    const newOrder = new Order({
      orderId,
      customer: {
        customerRef: customerDb._id,
        name: customer.name,
        email: customer.email.toLowerCase(),
        phone: customer.phone,
      },
      items: processedItems,
      shippingDetails,
      billingDetails,
      paymentDetails: {
        method: paymentDetails.method || "COD",
        transactionId: paymentDetails.transactionId || "",
        status: paymentDetails.status || "Pending",
      },
      amount: {
        subtotal: amount.subtotal,
        discount: amount.discount || 0,
        shipping: amount.shipping || 0,
        total: amount.total,
      },
      currency: currency || "USD",
      currencySymbol: currencySymbol || "$",
      status: "Pending",
    });

    await newOrder.save();

    try {
      const Notification = require("../models/Notification");
      await Notification.create({
        type: "New Order",
        title: "New Order Received",
        message: `Order #${orderId} placed for ${newOrder.currencySymbol}${amount.total.toFixed(2)}`,
        link: `/orders/${newOrder._id}`
      });
    } catch (notifErr) {
      console.error("Failed to create order notification:", notifErr);
    }

    res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track order status publicly
// @route   GET /api/orders/track/:orderId
// @access  Public
const trackOrderPublic = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({
      orderId: order.orderId,
      status: order.status,
      statusHistory: order.statusHistory,
      createdAt: order.createdAt,
      amount: {
        total: order.amount.total
      },
      currencySymbol: order.currencySymbol,
      items: order.items.map(item => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        slug: item.slug
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  downloadInvoice,
  createOrder,
  trackOrderPublic,
};
