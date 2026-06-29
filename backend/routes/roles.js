const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const Admin = require("../models/Admin");
const { protect, checkPermission, superAdminOnly } = require("../middleware/auth");
const { logAdminActivity } = require("../middleware/activityLogger");

// Get all roles
router.get("/", protect, checkPermission("roles_view"), async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });
    
    const rolesWithCounts = roles.map(role => {
      let enabledCount = 0;
      const permObj = role.permissions ? role.permissions.toObject() : {};
      for (const key in permObj) {
        if (permObj[key]) {
          if (permObj[key].view) enabledCount++;
          if (permObj[key].edit) enabledCount++;
          if (permObj[key].delete) enabledCount++;
        }
      }
      return {
        ...role.toObject(),
        enabledCount
      };
    });
    
    res.json(rolesWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single role
router.get("/:id", protect, checkPermission("roles_view"), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new role
router.post("/", protect, checkPermission("roles_create"), async (req, res) => {
  const { name, description, permissions } = req.body;
  if (!name) return res.status(400).json({ message: "Role name is required" });
  
  try {
    const existing = await Role.findOne({ name });
    if (existing) return res.status(400).json({ message: "Role with this name already exists" });
    
    const role = new Role({ name, description, permissions });
    const saved = await role.save();
    
    await logAdminActivity(req.admin._id, "Create Role", `Created role: "${saved.name}"`);
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update role
router.put("/:id", protect, checkPermission("roles_edit"), async (req, res) => {
  const { name, description, permissions } = req.body;
  
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    
    if (name && name !== role.name) {
      const existing = await Role.findOne({ name });
      if (existing) return res.status(400).json({ message: "Another role with this name already exists" });
      role.name = name;
    }
    
    if (description !== undefined) role.description = description;
    if (permissions) role.permissions = permissions;
    
    const saved = await role.save();
    await logAdminActivity(req.admin._id, "Update Role", `Updated role: "${saved.name}"`);
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete role
router.delete("/:id", protect, checkPermission("roles_delete"), async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    
    // Check if any admin users are assigned to this role
    const assignedUser = await Admin.findOne({ roleId: role._id });
    if (assignedUser) {
      return res.status(400).json({ message: `Cannot delete role. It is currently assigned to user: ${assignedUser.name}` });
    }
    
    await Role.findByIdAndDelete(req.params.id);
    await logAdminActivity(req.admin._id, "Delete Role", `Deleted role: "${role.name}"`);
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
