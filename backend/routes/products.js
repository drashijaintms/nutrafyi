const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkActions,
} = require("../controllers/productController");
const { protect, checkPermission } = require("../middleware/auth");

// Public routes (for customer-facing storefront)
router.get("/", async (req, res) => {
  try {
    // If query parameters are sent (like search/page), use the advanced getProducts controller
    if (Object.keys(req.query).length > 0) {
      return getProducts(req, res);
    }
    // Otherwise fallback to return all products for existing storefront compatibility
    const products = await Product.find({ status: { $ne: "Draft" } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/id/:id", getProductById);

router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Protected routes
router.get("/admin/all", protect, checkPermission("products"), getProducts);
router.post("/", protect, checkPermission("products"), createProduct);
router.put("/:id", protect, checkPermission("products"), updateProduct);
router.delete("/:id", protect, checkPermission("products"), deleteProduct);
router.post("/bulk", protect, checkPermission("products"), bulkActions);

module.exports = router;