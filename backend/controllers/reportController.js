const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");

// Helper to date ranges
const getDateRange = (filter) => {
  const now = new Date();
  const start = new Date();

  if (filter === "daily") {
    start.setHours(0, 0, 0, 0);
  } else if (filter === "weekly") {
    start.setDate(now.getDate() - 7);
  } else if (filter === "monthly") {
    start.setMonth(now.getMonth() - 1);
  } else if (filter === "yearly") {
    start.setFullYear(now.getFullYear() - 1);
  } else {
    // Default 30 days
    start.setDate(now.getDate() - 30);
  }
  return { start, end: now };
};

// @desc    Get Revenue sales reports
// @route   GET /api/reports/revenue
// @access  Private
const getRevenueReport = async (req, res) => {
  const { filter } = req.query; // daily, weekly, monthly, yearly
  const { start, end } = getDateRange(filter);

  try {
    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      status: { $nin: ["Cancelled", "Refunded"] },
    });

    const totalSales = orders.reduce((sum, o) => sum + o.amount.total, 0);
    const totalSubtotal = orders.reduce((sum, o) => sum + o.amount.subtotal, 0);
    const totalDiscount = orders.reduce((sum, o) => sum + o.amount.discount, 0);
    const totalShipping = orders.reduce((sum, o) => sum + o.amount.shipping, 0);
    const ordersCount = orders.length;

    res.json({
      totalSales,
      totalSubtotal,
      totalDiscount,
      totalShipping,
      ordersCount,
      averageOrderValue: ordersCount > 0 ? totalSales / ordersCount : 0,
      filter,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Product reports (Top selling products)
// @route   GET /api/reports/products
// @access  Private
const getProductReport = async (req, res) => {
  try {
    // Aggregate top selling products from completed orders
    const topProducts = await Order.aggregate([
      { $match: { status: { $nin: ["Cancelled", "Refunded"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          title: { $first: "$items.title" },
          sku: { $first: "$items.sku" },
          unitsSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { unitsSold: -1 } },
      { $limit: 10 },
    ]);

    res.json({ topProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Customer reports (new vs returning)
// @route   GET /api/reports/customers
// @access  Private
const getCustomerReport = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();

    // Customers with > 1 orders are returning
    const returningCustomers = await Customer.countDocuments({
      totalOrders: { $gt: 1 },
    });

    const newCustomers = totalCustomers - returningCustomers;

    res.json({
      totalCustomers,
      newCustomers,
      returningCustomers,
      returningRatio: totalCustomers > 0 ? returningCustomers / totalCustomers : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export sales data to CSV
// @route   GET /api/reports/export
// @access  Private
const exportCSV = async (req, res) => {
  const { type } = req.query; // sales, products, customers

  try {
    let csvData = "";
    let filename = "";

    if (type === "products") {
      const topProducts = await Order.aggregate([
        { $match: { status: { $nin: ["Cancelled", "Refunded"] } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            title: { $first: "$items.title" },
            sku: { $first: "$items.sku" },
            unitsSold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { unitsSold: -1 } },
      ]);

      filename = "Product-Sales-Report.csv";
      csvData = "Product ID,Product Name,SKU,Units Sold,Total Revenue\n";
      topProducts.forEach((p) => {
        csvData += `"${p._id}","${p.title.replace(/"/g, '""')}","${p.sku}",${p.unitsSold},${p.revenue.toFixed(2)}\n`;
      });
    } else {
      // Default: Sales/Revenue export
      const orders = await Order.find({
        status: { $nin: ["Cancelled", "Refunded"] },
      }).sort({ createdAt: -1 });

      filename = "Sales-Report.csv";
      csvData = "Order ID,Customer Name,Customer Email,Date,Subtotal,Discount,Shipping,Total,Payment Method,Status\n";
      orders.forEach((o) => {
        csvData += `"${o.orderId}","${o.customer.name}","${o.customer.email}","${o.createdAt.toLocaleDateString()}",${o.amount.subtotal},${o.amount.discount},${o.amount.shipping},${o.amount.total},"${o.paymentDetails.method}","${o.status}"\n`;
      });
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.status(200).send(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRevenueReport,
  getProductReport,
  getCustomerReport,
  exportCSV,
};
