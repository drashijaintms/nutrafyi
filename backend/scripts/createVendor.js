/**
 * Vendor Seeder Script
 * Run: node backend/scripts/createVendor.js
 * Creates a test vendor account for the approval workflow
 */
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Admin = require("../models/Admin");

async function createVendor() {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existing = await Admin.findOne({ email: "vendor@nutrafyi.com" });
    if (existing) {
      console.log("Vendor already exists:", existing.email, "| Role:", existing.role);
      await mongoose.disconnect();
      return;
    }

    const vendor = new Admin({
      name: "NutraFYI Vendor",
      email: "vendor@nutrafyi.com",
      password: "Vendor@123",
      role: "vendor",
      permissions: {
        products: true,
        categories: true,
        brands: false,
        orders: false,
        customers: false,
        users_view: false,
        users_create: false,
        users_edit: false,
        users_delete: false,
        coupons: false,
        reviews: false,
        inventory: false,
        pages: false,
        blogs: false,
        settings: false,
      },
    });

    await vendor.save();
    console.log("Vendor account created successfully!");
    console.log("Email: vendor@nutrafyi.com");
    console.log("Password: Vendor@123");
    console.log("Role: vendor");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

createVendor();
