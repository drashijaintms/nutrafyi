const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkActions,
} = require("../controllers/productController");
const { protect, checkPermission } = require("../middleware/auth");

// Public storefront routes — only show approved, non-draft products
router.get("/", async (req, res) => {
  try {
    if (Object.keys(req.query).length > 0) {
      return getProducts(req, res);
    }
    // Fallback: return all approved products for storefront
    const products = await Product.find({
      status: { $ne: "Draft" },
      approvalStatus: { $in: ["approved", null] },
      deleted: { $ne: true },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/id/:id", getProductById);

router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      approvalStatus: { $in: ["approved", null] },
      deleted: { $ne: true },
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Protected routes
router.get("/admin/all", protect, checkPermission("products"), getAdminProducts);
router.post("/", protect, checkPermission("products"), createProduct);
router.put("/:id", protect, checkPermission("products"), updateProduct);
router.delete("/:id", protect, checkPermission("products"), deleteProduct);
router.post("/bulk", protect, checkPermission("products"), bulkActions);

module.exports = router;