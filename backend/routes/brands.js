const express = require("express");
const router = express.Router();
const Brand = require("../models/Brand");
const { protect } = require("../middleware/auth");
const { logAdminActivity } = require("../middleware/activityLogger");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// GET ALL BRANDS (Public storefront - only approved)
router.get("/", async (req, res) => {
  try {
    const isAdminRequest = req.query.admin === "true";
    let query = {};
    if (!isAdminRequest) {
      query.approvalStatus = { $in: ["approved", null] };
    }
    const brands = await Brand.find(query).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL BRANDS (admin panel — with vendor scope)
router.get("/admin/all", protect, async (req, res) => {
  try {
    let query = {};
    const brands = await Brand.find(query)
      .populate("submittedBy", "name email role")
      .sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET BRAND BY ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findOne({
      _id: req.params.id,
      approvalStatus: { $in: ["approved", null] }
    });
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE BRAND (Admin protected)
router.post("/", protect, async (req, res) => {
  try {
    const brandData = { ...req.body };
    if (!brandData.slug && brandData.name) {
      brandData.slug = slugify(brandData.name);
    }

    // Vendor approval workflow
    if (req.admin && req.admin.role === "vendor") {
      brandData.approvalStatus = "pending";
      brandData.submittedBy = req.admin._id;
    } else {
      brandData.approvalStatus = brandData.approvalStatus || "approved";
      brandData.submittedBy = req.admin._id;
    }

    const brand = new Brand(brandData);
    const savedBrand = await brand.save();

    await logAdminActivity(
      req.admin._id,
      "Create Brand",
      `Created brand: "${savedBrand.name}" — Approval: ${savedBrand.approvalStatus}`
    );

    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE BRAND (Admin protected)
router.put("/:id", protect, async (req, res) => {
  try {
    // Vendors do not have permission to edit brands
    if (req.admin.role === "vendor") {
      return res.status(403).json({ message: "Vendors do not have permission to edit brands." });
    }

    const brandData = { ...req.body };
    if (brandData.name && !brandData.slug) {
      brandData.slug = slugify(brandData.name);
    }

    const brand = await Brand.findByIdAndUpdate(req.params.id, brandData, {
      new: true,
    });
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    await logAdminActivity(
      req.admin._id,
      "Update Brand",
      `Updated brand: "${brand.name}"`
    );

    res.json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE BRAND (Admin protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    // Vendors do not have permission to delete brands
    if (req.admin.role === "vendor") {
      return res.status(403).json({ message: "Vendors do not have permission to delete brands." });
    }

    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    await Brand.findByIdAndDelete(req.params.id);

    await logAdminActivity(
      req.admin._id,
      "Delete Brand",
      `Deleted brand: "${brand.name}"`
    );

    res.json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
