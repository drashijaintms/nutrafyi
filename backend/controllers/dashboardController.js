const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Review = require("../models/Review");
const Admin = require("../models/Admin");

// @desc    Get dashboard metrics & statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    // 1. Calculations for Total Revenue
    const completedOrders = await Order.find({
      status: { $nin: ["Cancelled", "Refunded"] },
    });

    const totalRevenue = completedOrders.reduce(
      (sum, order) => sum + (order.amount?.total || 0),
      0
    );

    // 2. Count statistics
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalBrands = await Brand.countDocuments();
    const totalReviews = await Review.countDocuments();

    // 3. Sales Analytics charts (Last 30 Days daily sales)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $nin: ["Cancelled", "Refunded"] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount.total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 4. Monthly sales (Last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlySalesAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          status: { $nin: ["Cancelled", "Refunded"] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$amount.total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 5. Recent Items lists
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentCustomers = await Customer.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentReviews = await Review.find()
      .populate("product", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // 6. Recent Admin Activities (from logs)
    const admins = await Admin.find().select("name activityLogs");
    let allActivities = [];
    admins.forEach((admin) => {
      admin.activityLogs.forEach((log) => {
        allActivities.push({
          adminName: admin.name,
          action: log.action,
          details: log.details,
          timestamp: log.timestamp,
        });
      });
    });
    // Sort allActivities descending
    allActivities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivities = allActivities.slice(0, 10);

    res.json({
      summary: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        totalCategories,
        totalBrands,
        totalReviews,
      },
      charts: {
        dailySales: dailySalesAgg.map((item) => ({
          date: item._id,
          revenue: item.revenue,
          orders: item.orders,
        })),
        monthlySales: monthlySalesAgg.map((item) => ({
          month: item._id,
          revenue: item.revenue,
          orders: item.orders,
        })),
      },
      recentOrders,
      recentCustomers,
      recentReviews,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
};
