const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const Role = require("../models/Role");
const Admin = require("../models/Admin");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedRoles = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing.");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding Roles...");

    const rolesData = [
      {
        name: "Administrator",
        description: "Full administrative access",
        permissions: {
          products: { view: true, edit: true, delete: true },
          categories: { view: true, edit: true, delete: true },
          brands: { view: true, edit: true, delete: true },
          orders: { view: true, edit: true, delete: true },
          customers: { view: true, edit: true, delete: true },
          coupons: { view: true, edit: true, delete: true },
          reviews: { view: true, edit: true, delete: true },
          inventory: { view: true, edit: true, delete: true },
          cmsPages: { view: true, edit: true, delete: true },
          cmsBlogs: { view: true, edit: true, delete: true },
          roles: { view: true, edit: true, delete: true },
          settings: { view: true, edit: true, delete: true },
          trashBin: { view: true, edit: true, delete: true }
        }
      },
      {
        name: "Editor",
        description: "Publish and manage content",
        permissions: {
          products: { view: false, edit: false, delete: false },
          categories: { view: true, edit: true, delete: true },
          brands: { view: false, edit: false, delete: false },
          orders: { view: false, edit: false, delete: false },
          customers: { view: false, edit: false, delete: false },
          coupons: { view: false, edit: false, delete: false },
          reviews: { view: false, edit: false, delete: false },
          inventory: { view: false, edit: false, delete: false },
          cmsPages: { view: true, edit: true, delete: true },
          cmsBlogs: { view: true, edit: true, delete: true },
          roles: { view: false, edit: false, delete: false },
          settings: { view: false, edit: false, delete: false },
          trashBin: { view: true, edit: true, delete: true }
        }
      },
      {
        name: "Author",
        description: "Write and edit content",
        permissions: {
          products: { view: false, edit: false, delete: false },
          categories: { view: false, edit: false, delete: false },
          brands: { view: false, edit: false, delete: false },
          orders: { view: false, edit: false, delete: false },
          customers: { view: false, edit: false, delete: false },
          coupons: { view: false, edit: false, delete: false },
          reviews: { view: false, edit: false, delete: false },
          inventory: { view: false, edit: false, delete: false },
          cmsPages: { view: true, edit: true, delete: false },
          cmsBlogs: { view: true, edit: true, delete: false },
          roles: { view: false, edit: false, delete: false },
          settings: { view: false, edit: false, delete: false },
          trashBin: { view: false, edit: false, delete: false }
        }
      },
      {
        name: "Admin",
        description: "Administrator role with full access",
        permissions: {
          products: { view: true, edit: true, delete: true },
          categories: { view: true, edit: true, delete: true },
          brands: { view: true, edit: true, delete: true },
          orders: { view: true, edit: true, delete: true },
          customers: { view: true, edit: true, delete: true },
          coupons: { view: true, edit: true, delete: true },
          reviews: { view: true, edit: true, delete: true },
          inventory: { view: true, edit: true, delete: true },
          cmsPages: { view: true, edit: true, delete: true },
          cmsBlogs: { view: true, edit: true, delete: true },
          roles: { view: true, edit: true, delete: true },
          settings: { view: true, edit: true, delete: true },
          trashBin: { view: true, edit: true, delete: true }
        }
      }
    ];

    const seededRoles = {};

    // Clear old roles structure first so that Mongoose schema changes apply cleanly
    await Role.deleteMany({});
    console.log("Cleared existing roles from database.");

    for (const r of rolesData) {
      const roleDoc = new Role(r);
      await roleDoc.save();
      console.log(`Seeded role: ${r.name}`);
      seededRoles[r.name] = roleDoc;
    }

    // Update existing Admin documents to link them to these new roles
    const admins = await Admin.find();
    for (const admin of admins) {
      let assignedRole = null;
      if (admin.role === "superadmin" || admin.role === "Administrator") {
        assignedRole = seededRoles["Administrator"];
      } else if (admin.email === "blogmanager@nutrafyi.com") {
        assignedRole = seededRoles["Editor"];
      } else if (admin.role === "admin" || admin.role === "Admin") {
        assignedRole = seededRoles["Admin"];
      } else if (admin.role === "editor" || admin.role === "Editor") {
        assignedRole = seededRoles["Editor"];
      } else {
        assignedRole = seededRoles["Admin"];
      }

      if (assignedRole) {
        admin.roleId = assignedRole._id;
        admin.role = assignedRole.name;
        await admin.save();
        console.log(`Linked user ${admin.email} to role: ${assignedRole.name}`);
      }
    }

    console.log("Roles and User mappings successfully updated!");
    process.exit();
  } catch (error) {
    console.error("Error seeding Roles:", error.message);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await seedRoles();
};

runSeeder();
