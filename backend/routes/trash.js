const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const Page = require("../models/Page");
const Category = require("../models/Category");
const Product = require("../models/Product");
const { protect, superAdminOnly } = require("../middleware/auth");
const { logAdminActivity } = require("../middleware/activityLogger");

// Get all deleted items grouped by type
router.get("/", protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ deleted: true }).sort({ deletedAt: -1 });
    const pages = await Page.find({ deleted: true }).sort({ deletedAt: -1 });
    const categories = await Category.find({ deleted: true }).sort({ deletedAt: -1 });
    const products = await Product.find({ deleted: true }).sort({ deletedAt: -1 });

    res.json({
      blogs,
      pages,
      categories,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restore a soft-deleted item
router.put("/restore/:type/:id", protect, superAdminOnly, async (req, res) => {
  const { type, id } = req.params;

  let model;
  if (type === "blog") model = Blog;
  else if (type === "page") model = Page;
  else if (type === "category") model = Category;
  else if (type === "product") model = Product;
  else return res.status(400).json({ message: "Invalid item type supplied" });

  try {
    const item = await model.findByIdAndUpdate(
      id,
      { deleted: false, deletedAt: null },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const title = item.title || item.name || "Unnamed Item";
    await logAdminActivity(
      req.admin._id,
      "Restore Trash Item",
      `Restored ${type} post/item: "${title}"`
    );

    res.json({ message: `${type} restored successfully`, item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Permanently delete an item
router.delete("/permanent/:type/:id", protect, superAdminOnly, async (req, res) => {
  const { type, id } = req.params;

  let model;
  if (type === "blog") model = Blog;
  else if (type === "page") model = Page;
  else if (type === "category") model = Category;
  else if (type === "product") model = Product;
  else return res.status(400).json({ message: "Invalid item type supplied" });

  try {
    const item = await model.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const title = item.title || item.name || "Unnamed Item";
    await logAdminActivity(
      req.admin._id,
      "Permanent Delete",
      `Permanently deleted ${type} post/item: "${title}"`
    );

    res.json({ message: `${type} permanently deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
