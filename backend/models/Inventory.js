const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    type: {
      type: String,
      enum: ["Restock", "Sale", "Return", "Manual Adjustment"],
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    remainingStock: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    adminRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
