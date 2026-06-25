const mongoose = require("mongoose");
const Product = require("../models/Product");

const connectDB = async () => {
  try {
    console.log("Trying to connect...");

    const conn = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );

    // Auto-migrate legacy products missing a status field
    const result = await Product.updateMany(
      { status: { $exists: false } },
      { $set: { status: "Published" } }
    );
    if (result.modifiedCount > 0) {
      console.log(`✅ Seeded status='Published' for ${result.modifiedCount} legacy products.`);
    }

    // Auto-migrate stock levels and stock statuses
    const stockQtyResult = await Product.updateMany(
      { stockQuantity: { $exists: false } },
      { $set: { stockQuantity: 20 } }
    );
    if (stockQtyResult.modifiedCount > 0) {
      console.log(`✅ Set stockQuantity=20 for ${stockQtyResult.modifiedCount} legacy products.`);
    }

    const inStockResult = await Product.updateMany(
      { stockQuantity: { $gt: 0 }, stockStatus: { $ne: "In Stock" } },
      { $set: { stockStatus: "In Stock" } }
    );
    const outOfStockResult = await Product.updateMany(
      { stockQuantity: { $lte: 0 }, stockStatus: { $ne: "Out of Stock" } },
      { $set: { stockStatus: "Out of Stock" } }
    );
    if (inStockResult.modifiedCount > 0 || outOfStockResult.modifiedCount > 0) {
      console.log(`✅ Synced stockStatus (In Stock: ${inStockResult.modifiedCount}, Out of Stock: ${outOfStockResult.modifiedCount})`);
    }

    // Seed default coupons if collection is empty
    const Coupon = require("../models/Coupon");
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const defaultCoupons = [
        {
          code: "WELCOME10",
          discountType: "Percentage",
          discountAmount: 10,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          usageLimit: 100,
          usageCount: 0,
          minOrderAmount: 0,
          isActive: true,
        },
        {
          code: "NUTRA20",
          discountType: "Percentage",
          discountAmount: 20,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          usageLimit: 50,
          usageCount: 0,
          minOrderAmount: 50,
          isActive: true,
        },
        {
          code: "OFF5",
          discountType: "Fixed",
          discountAmount: 5,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
          usageLimit: 200,
          usageCount: 0,
          minOrderAmount: 30,
          isActive: true,
        }
      ];
      await Coupon.insertMany(defaultCoupons);
      console.log("✅ Seeded default coupons into the database.");
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;