const express = require("express");
const router = express.Router();

const Category = require("../models/Category");

// GET ALL CATEGORIES
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD CATEGORY
router.post("/", async (req, res) => {
  try {
    const category = new Category(req.body);

    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE CATEGORY
router.put("/:id", async (req, res) => {
  try {
    const category =
      await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE CATEGORY
router.delete("/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(
      req.params.id
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