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

// GET ALL BRANDS (Public)
router.get("/", async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET BRAND BY ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
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

    const brand = new Brand(brandData);
    const savedBrand = await brand.save();

    await logAdminActivity(
      req.admin._id,
      "Create Brand",
      `Created brand: "${savedBrand.name}"`
    );

    res.status(201).json(savedBrand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE BRAND (Admin protected)
router.put("/:id", protect, async (req, res) => {
  try {
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
