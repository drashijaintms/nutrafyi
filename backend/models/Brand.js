const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    // Vendor Approval Workflow
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    approvalNote: { type: String, default: "" },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", brandSchema);
