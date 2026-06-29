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

// GET ALL CATEGORIES (nested formatting and sorting)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ deleted: { $ne: true } }).sort({ order: 1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({
          category: category.slug,
        });

        return {
          ...category.toObject(),
          count,
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET SINGLE CATEGORY
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, deleted: { $ne: true } });
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD CATEGORY (Admin protected)
router.post("/", protect, async (req, res) => {
  try {
    const categoryData = { ...req.body };
    if (!categoryData.slug && categoryData.title) {
      categoryData.slug = slugify(categoryData.title);
    }

    const category = new Category(categoryData);
    const savedCategory = await category.save();

    await logAdminActivity(
      req.admin._id,
      "Create Category",
      `Created category: "${savedCategory.title}"`
    );

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE CATEGORY (Admin protected)
router.put("/:id", protect, async (req, res) => {
  try {
    const categoryData = { ...req.body };
    if (categoryData.title && !categoryData.slug) {
      categoryData.slug = slugify(categoryData.title);
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      categoryData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await logAdminActivity(
      req.admin._id,
      "Update Category",
      `Updated category: "${category.title}"`
    );

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE CATEGORY (Admin protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, deleted: { $ne: true } });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.deleted = true;
    category.deletedAt = new Date();
    await category.save();

    await logAdminActivity(
      req.admin._id,
      "Delete Category",
      `Deleted category: "${category.title}"`
    );

    res.json({
      message: "Category Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;