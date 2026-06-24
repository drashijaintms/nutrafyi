const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const { logAdminActivity } = require("../middleware/activityLogger");

// @desc    Get low stock and out of stock reports
// @route   GET /api/inventory/status
// @access  Private
const getInventoryStatus = async (req, res) => {
  try {
    // Out of Stock: stock = 0
    const outOfStock = await Product.find({ stockQuantity: 0 }).select(
      "title sku stockQuantity lowStockThreshold image"
    );

    // Low Stock: stock <= lowStockThreshold and stock > 0
    const lowStock = await Product.find({
      $expr: {
        $and: [
          { $gt: ["$stockQuantity", 0] },
          { $lte: ["$stockQuantity", "$lowStockThreshold"] },
        ],
      },
    }).select("title sku stockQuantity lowStockThreshold image");

    res.json({
      outOfStock,
      lowStock,
      counts: {
        outOfStockCount: outOfStock.length,
        lowStockCount: lowStock.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stock history logs
// @route   GET /api/inventory/logs
// @access  Private
const getInventoryLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Inventory.countDocuments();
    const logs = await Inventory.find()
      .populate("product", "title sku image")
      .populate("adminRef", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      logs,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually adjust inventory of a product
// @route   POST /api/inventory/adjust
// @access  Private
const adjustStock = async (req, res) => {
  const { productId, quantityChange, note } = req.body;

  if (!productId || quantityChange === undefined) {
    return res.status(400).json({ message: "Product ID and quantity change required" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newStock = Math.max(0, product.stockQuantity + quantityChange);
    product.stockQuantity = newStock;
    product.stockStatus = newStock > 0 ? "In Stock" : "Out of Stock";
    await product.save();

    const log = await Inventory.create({
      product: productId,
      type: "Manual Adjustment",
      quantityChange,
      remainingStock: newStock,
      note: note || "Manual administrative adjustment",
      adminRef: req.admin._id,
    });

    await logAdminActivity(
      req.admin._id,
      "Adjust Inventory",
      `Adjusted stock for "${product.title}" by ${quantityChange} units (New stock: ${newStock})`
    );

    res.status(201).json({
      message: "Inventory adjusted successfully",
      product,
      log,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInventoryStatus,
  getInventoryLogs,
  adjustStock,
};
