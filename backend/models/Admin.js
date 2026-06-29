const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    permissions: {
      products: { type: Boolean, default: true },
      categories: { type: Boolean, default: true },
      brands: { type: Boolean, default: true },
      orders: { type: Boolean, default: true },
      customers: { type: Boolean, default: true },
      users_view: { type: Boolean, default: true },
      users_create: { type: Boolean, default: true },
      users_edit: { type: Boolean, default: true },
      users_delete: { type: Boolean, default: true },
      coupons: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
      inventory: { type: Boolean, default: true },
      pages: { type: Boolean, default: true },
      blogs: { type: Boolean, default: true },
      settings: { type: Boolean, default: true }
    },
    refreshToken: {
      type: String,
      default: "",
    },
    loginHistory: [
      {
        ip: String,
        userAgent: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    activityLogs: [
      {
        action: String,
        details: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
adminSchema.pre("save", function () {
  const admin = this;
  if (!admin.isModified("password")) return;

  const salt = bcrypt.genSaltSync(10);
  admin.password = bcrypt.hashSync(admin.password, salt);
});

// Compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
