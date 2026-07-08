const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");
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

// GET ALL CATEGORIES (for storefront - only approved)
router.get("/", async (req, res) => {
  try {
    const isAdminRequest = req.query.admin === "true";
    let query = { deleted: { $ne: true } };
    if (!isAdminRequest) {
      query.approvalStatus = { $in: ["approved", null] };
    }
    const categories = await Category.find(query).sort({ order: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({
          category: category.slug,
        });
        return { ...category.toObject(), count };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL CATEGORIES (admin panel — with vendor scope)
router.get("/admin/all", protect, async (req, res) => {
  try {
    let query = { deleted: { $ne: true } };
    // Vendors see approved categories + their own categories
    if (req.admin && req.admin.role === "vendor") {
      query.$or = [
        { approvalStatus: { $in: ["approved", null] } },
        { submittedBy: req.admin._id }
      ];
    }
    const categories = await Category.find(query)
      .populate("submittedBy", "name email role")
      .sort({ order: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ category: category.slug });
        return { ...category.toObject(), count };
      })
    );
    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET SINGLE CATEGORY
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      deleted: { $ne: true },
      approvalStatus: { $in: ["approved", null] }
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD CATEGORY (Admin protected)
router.post("/", protect, async (req, res) => {
  try {
    const categoryData = { ...req.body };
    if (!categoryData.slug && categoryData.title) {
      categoryData.slug = slugify(categoryData.title);
    }

    // Vendor approval workflow
    if (req.admin && req.admin.role === "vendor") {
      categoryData.approvalStatus = "pending";
      categoryData.submittedBy = req.admin._id;
    } else {
      categoryData.approvalStatus = categoryData.approvalStatus || "approved";
      categoryData.submittedBy = req.admin._id;
    }

    const category = new Category(categoryData);
    const savedCategory = await category.save();

    await logAdminActivity(
      req.admin._id,
      "Create Category",
      `Created category: "${savedCategory.title}" — Approval: ${savedCategory.approvalStatus}`
    );

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE CATEGORY (Admin protected)
router.put("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Vendor ownership check: vendors can only edit their own categories
    if (req.admin.role === "vendor" && String(category.submittedBy) !== String(req.admin._id)) {
      return res.status(403).json({ message: "You can only edit your own categories" });
    }

    const categoryData = { ...req.body };
    if (categoryData.title && !categoryData.slug) {
      categoryData.slug = slugify(categoryData.title);
    }

    // If vendor edits a category, reset approval status to pending and clear rejection notes
    if (req.admin.role === "vendor") {
      categoryData.approvalStatus = "pending";
      categoryData.approvalNote = "";
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      { new: true }
    );

    await logAdminActivity(
      req.admin._id,
      "Update Category",
      `Updated category: "${updatedCategory.title}"`
    );

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE CATEGORY (Admin protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, deleted: { $ne: true } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Vendor ownership check: vendors can only delete their own categories
    if (req.admin.role === "vendor" && String(category.submittedBy) !== String(req.admin._id)) {
      return res.status(403).json({ message: "You can only delete your own categories" });
    }

    category.deleted = true;
    category.deletedAt = new Date();
    await category.save();

    await logAdminActivity(
      req.admin._id,
      "Delete Category",
      `Deleted category: "${category.title}"`
    );

    res.json({ message: "Category Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;