const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const { protect, superAdminOnly } = require("../middleware/auth");
const { logAdminActivity } = require("../middleware/activityLogger");

// Get all administrators
router.get("/", protect, superAdminOnly, async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new administrator
router.post("/", protect, superAdminOnly, async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin with this email already exists" });
    }

    const admin = new Admin({
      name,
      email,
      password,
      role: role || "admin",
      permissions: permissions || {
        products: true,
        categories: true,
        brands: true,
        orders: true,
        customers: true,
        coupons: true,
        reviews: true,
        inventory: true,
        pages: true,
        blogs: true,
        settings: true
      }
    });

    const saved = await admin.save();

    await logAdminActivity(
      req.admin._id,
      "Create Administrator",
      `Created administrator: "${saved.name}" (${saved.email}) with role "${saved.role}"`
    );

    res.status(201).json({
      _id: saved._id,
      name: saved.name,
      email: saved.email,
      role: saved.role,
      permissions: saved.permissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update administrator
router.put("/:id", protect, superAdminOnly, async (req, res) => {
  const { name, email, password, role, permissions } = req.body;

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Administrator not found" });
    }

    // Don't allow changing email to an existing email of another user
    if (email && email.toLowerCase() !== admin.email) {
      const existing = await Admin.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ message: "Email is already in use by another account" });
      }
      admin.email = email;
    }

    if (name) admin.name = name;
    if (role) admin.role = role;
    if (permissions) admin.permissions = permissions;
    if (password) admin.password = password; // pre-save hook will hash it

    const updated = await admin.save();

    await logAdminActivity(
      req.admin._id,
      "Update Administrator",
      `Updated administrator: "${updated.name}" (${updated.email})`
    );

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      permissions: updated.permissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete administrator
router.delete("/:id", protect, superAdminOnly, async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Administrator not found" });
    }

    // Don't allow deleting yourself
    if (admin._id.toString() === req.admin._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own administrator account" });
    }

    await Admin.findByIdAndDelete(req.params.id);

    await logAdminActivity(
      req.admin._id,
      "Delete Administrator",
      `Deleted administrator account: "${admin.name}" (${admin.email})`
    );

    res.json({ message: "Administrator deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
