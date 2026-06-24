const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["Percentage", "Fixed"],
      default: "Percentage",
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited usage
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    minOrderAmount: {
      type: Number,
      default: 0, // minimum spend required
    },
    maxDiscount: {
      type: Number,
      default: null, // maximum discount cap (specifically for percentage coupons)
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
