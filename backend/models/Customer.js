const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpending: {
      type: Number,
      default: 0,
    },
    addresses: [
      {
        addressType: {
          type: String,
          enum: ["Shipping", "Billing"],
          default: "Shipping",
        },
        address: String,
        city: String,
        state: String,
        zip: String,
        country: String,
      },
    ],
    activityHistory: [
      {
        action: String, // e.g. "LoggedIn", "Placed Order", "Left Review"
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
