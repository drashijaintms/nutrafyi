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
    password: {
      type: String,
      default: "",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
customerSchema.pre("save", async function () {
  const customer = this;
  if (!customer.isModified("password") || !customer.password) return;

  const bcrypt = require("bcryptjs");
  const salt = bcrypt.genSaltSync(10);
  customer.password = bcrypt.hashSync(customer.password, salt);
});

// Compare password
customerSchema.methods.comparePassword = async function (enteredPassword) {
  const bcrypt = require("bcryptjs");
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Customer", customerSchema);
