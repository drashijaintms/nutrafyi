const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Admin = require("../models/Admin");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: "admin@nutrafyi.com" });
    if (adminExists) {
      console.log("Admin account (admin@nutrafyi.com) already exists. Skipping.");
      process.exit();
    }

    // Create super admin
    const admin = new Admin({
      name: "System Administrator",
      email: "admin@nutrafyi.com",
      password: "adminpassword123", // Will be hashed by mongoose pre-save hook
      role: "superadmin",
    });

    await admin.save();
    console.log("Superadmin seeded successfully!");
    console.log("Email: admin@nutrafyi.com");
    console.log("Password: adminpassword123");

    process.exit();
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
