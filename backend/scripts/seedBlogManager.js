const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Admin = require("../models/Admin");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedBlogManager = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding Blog Manager...");

    const email = "blogmanager@nutrafyi.com";
    const existing = await Admin.findOne({ email });

    if (existing) {
      console.log(`Admin account (${email}) already exists. Updating permissions.`);
      existing.permissions = {
        products: false,
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
        blogs: true,
        settings: false
      };
      await existing.save();
      console.log("Permissions updated successfully.");
      process.exit();
    }

    const blogManager = new Admin({
      name: "Blog Editor",
      email,
      password: "blogeditorpass", // Hashed in pre-save hook
      role: "admin",
      permissions: {
        products: false,
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
        blogs: true,
        settings: false
      }
    });

    await blogManager.save();
    console.log("Blog Manager seeded successfully!");
    console.log("Email:", email);
    console.log("Password: blogeditorpass");
    process.exit();
  } catch (error) {
    console.error("Error seeding Blog Manager:", error.message);
    process.exit(1);
  }
};

seedBlogManager();
