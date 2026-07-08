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
    const isVendor = req.admin && req.admin.role === "vendor";

    if (isVendor) {
      // Fetch vendor products list
      const vendorProductIds = await Product.find({ submittedBy: req.admin._id, deleted: { $ne: true } }).distinct("_id");

      // Completed orders containing vendor products
      const completedOrders = await Order.find({
        status: { $nin: ["Cancelled", "Refunded"] },
        "items.product": { $in: vendorProductIds }
      });

      let totalRevenue = 0;
      completedOrders.forEach(order => {
        order.items.forEach(item => {
          if (vendorProductIds.some(id => String(id) === String(item.product))) {
            totalRevenue += (item.price || 0) * (item.quantity || 0);
          }
        });
      });

      const totalOrders = await Order.countDocuments({
        "items.product": { $in: vendorProductIds }
      });

      const vendorOrders = await Order.find({
        "items.product": { $in: vendorProductIds }
      });
      const uniqueCustomerEmails = [...new Set(vendorOrders.map(o => o.customer?.email).filter(Boolean))];
      const totalCustomers = uniqueCustomerEmails.length;
      const totalProducts = vendorProductIds.length;

      // 30 days daily sales aggregation for vendor
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const vendorOrdersForCharts = await Order.find({
        createdAt: { $gte: thirtyDaysAgo },
        status: { $nin: ["Cancelled", "Refunded"] },
        "items.product": { $in: vendorProductIds }
      });

      const dailyMap = {};
      vendorOrdersForCharts.forEach(order => {
        const dateStr = order.createdAt.toISOString().slice(0, 10);
        if (!dailyMap[dateStr]) {
          dailyMap[dateStr] = { revenue: 0, orders: 0 };
        }
        dailyMap[dateStr].orders += 1;
        order.items.forEach(item => {
          if (vendorProductIds.some(id => String(id) === String(item.product))) {
            dailyMap[dateStr].revenue += (item.price || 0) * (item.quantity || 0);
          }
        });
      });

      const dailySalesAgg = Object.keys(dailyMap).sort().map(date => ({
        _id: date,
        revenue: dailyMap[date].revenue,
        orders: dailyMap[date].orders
      }));

      // 12 months monthly sales aggregation for vendor
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const vendorMonthlyOrders = await Order.find({
        createdAt: { $gte: twelveMonthsAgo },
        status: { $nin: ["Cancelled", "Refunded"] },
        "items.product": { $in: vendorProductIds }
      });

      const monthlyMap = {};
      vendorMonthlyOrders.forEach(order => {
        const monthStr = order.createdAt.toISOString().slice(0, 7);
        if (!monthlyMap[monthStr]) {
          monthlyMap[monthStr] = { revenue: 0, orders: 0 };
        }
        monthlyMap[monthStr].orders += 1;
        order.items.forEach(item => {
          if (vendorProductIds.some(id => String(id) === String(item.product))) {
            monthlyMap[monthStr].revenue += (item.price || 0) * (item.quantity || 0);
          }
        });
      });

      const monthlySalesAgg = Object.keys(monthlyMap).sort().map(month => ({
        _id: month,
        revenue: monthlyMap[month].revenue,
        orders: monthlyMap[month].orders
      }));

      // Recent orders containing vendor products
      const recentOrders = await Order.find({ "items.product": { $in: vendorProductIds } })
        .sort({ createdAt: -1 })
        .limit(5);

      // Top products for vendor
      const topProdMap = {};
      completedOrders.forEach(order => {
        order.items.forEach(item => {
          if (vendorProductIds.some(id => String(id) === String(item.product))) {
            const pId = String(item.product);
            if (!topProdMap[pId]) {
              topProdMap[pId] = {
                _id: pId,
                title: item.title,
                slug: item.slug,
                image: item.image,
                totalQty: 0,
                totalSales: 0
              };
            }
            topProdMap[pId].totalQty += item.quantity;
            topProdMap[pId].totalSales += (item.price || 0) * (item.quantity || 0);
          }
        });
      });

      const topProducts = Object.values(topProdMap)
        .sort((a, b) => b.totalQty - a.totalQty)
        .slice(0, 5);

      return res.json({
        summary: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          totalProducts,
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
        topProducts,
      });
    }

    // 1. Calculations for Total Revenue (Super Admin / Global)
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

    // 7. Maximum selling products & categories
    const topProducts = await Order.aggregate([
      { $match: { status: { $nin: ["Cancelled", "Refunded"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          title: { $first: "$items.title" },
          slug: { $first: "$items.slug" },
          image: { $first: "$items.image" },
          totalQty: { $sum: "$items.quantity" },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

    const topCategories = await Order.aggregate([
      { $match: { status: { $nin: ["Cancelled", "Refunded"] } } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDoc"
        }
      },
      { $unwind: { path: "$productDoc", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            $cond: {
              if: { $or: [{ $eq: ["$productDoc.categoryName", ""] }, { $not: ["$productDoc.categoryName"] }] },
              then: "Uncategorized",
              else: "$productDoc.categoryName"
            }
          },
          categorySlug: { $first: "$productDoc.category" },
          totalQty: { $sum: "$items.quantity" },
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

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
      topProducts,
      topCategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
};
