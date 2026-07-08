const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
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

// @desc    Get all products (admin panel — respects vendor scope)
// @route   GET /api/products/admin/all
// @access  Private
const getAdminProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, brand, stockStatus, status, sortBy, approvalStatus } = req.query;

    let query = { deleted: { $ne: true } };

    // Vendors only see their own products
    if (req.admin && req.admin.role === "vendor") {
      query.submittedBy = req.admin._id;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (stockStatus) query.stockStatus = stockStatus;
    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;

    let sortOptions = { createdAt: -1 };
    if (sortBy === "price_asc") sortOptions = { price: 1 };
    else if (sortBy === "price_desc") sortOptions = { price: -1 };
    else if (sortBy === "title_asc") sortOptions = { title: 1 };
    else if (sortBy === "title_desc") sortOptions = { title: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("submittedBy", "name email role")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({ products, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (with pagination, filters, sorting)
// @route   GET /api/products
// @access  Private (kept for backward compat)
const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, brand, stockStatus, status, sortBy } = req.query;

    let query = { deleted: { $ne: true }, approvalStatus: { $in: ["approved", null] } };

    // Filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = category; // slug
    }
    if (brand) {
      query.brand = brand;
    }
    if (stockStatus) {
      query.stockStatus = stockStatus;
    }
    if (status) {
      query.status = status;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default: newest
    if (sortBy === "price_asc") sortOptions = { price: 1 };
    else if (sortBy === "price_desc") sortOptions = { price: -1 };
    else if (sortBy === "title_asc") sortOptions = { title: 1 };
    else if (sortBy === "title_desc") sortOptions = { title: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Auto-generate slug
    if (productData.title && !productData.slug) {
      productData.slug = slugify(productData.title);
      // Ensure unique slug
      let slugExists = await Product.findOne({ slug: productData.slug });
      let counter = 1;
      while (slugExists) {
        productData.slug = `${slugify(productData.title)}-${counter}`;
        slugExists = await Product.findOne({ slug: productData.slug });
        counter++;
      }
    }

    // Set stock status based on stock count
    if (productData.stockQuantity !== undefined) {
      productData.stockStatus =
        productData.stockQuantity > 0 ? "In Stock" : "Out of Stock";
    }

    // Vendor approval workflow: vendors submit products as pending
    if (req.admin && req.admin.role === "vendor") {
      productData.approvalStatus = "pending";
      productData.submittedBy = req.admin._id;
    } else {
      // Super admin / other roles: auto-approve
      productData.approvalStatus = productData.approvalStatus || "approved";
      productData.submittedBy = req.admin._id;
    }

    const product = new Product(productData);
    const savedProduct = await product.save();

    // Create Initial Inventory Log
    if (savedProduct.stockQuantity > 0) {
      await Inventory.create({
        product: savedProduct._id,
        type: "Restock",
        quantityChange: savedProduct.stockQuantity,
        remainingStock: savedProduct.stockQuantity,
        note: "Initial stock load upon product creation.",
        adminRef: req.admin._id,
      });
    }

    // Log Activity
    await logAdminActivity(
      req.admin._id,
      "Create Product",
      `Created product: "${savedProduct.title}" (SKU: ${savedProduct.sku || "N/A"}) — Approval: ${savedProduct.approvalStatus}`
    );

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Vendor ownership check: vendors can only edit their own products
    if (req.admin.role === "vendor" && String(product.submittedBy) !== String(req.admin._id)) {
      return res.status(403).json({ message: "You can only edit your own products" });
    }

    const previousStock = product.stockQuantity;
    const updatedData = { ...req.body };

    // Recalculate slug if title is modified
    if (updatedData.title && updatedData.title !== product.title && !updatedData.slug) {
      updatedData.slug = slugify(updatedData.title);
    }

    // Recalculate stock status
    if (updatedData.stockQuantity !== undefined) {
      updatedData.stockStatus =
        updatedData.stockQuantity > 0 ? "In Stock" : "Out of Stock";
    }

    // If vendor edits a product, reset approval status to pending and clear rejection notes
    if (req.admin.role === "vendor") {
      updatedData.approvalStatus = "pending";
      updatedData.approvalNote = "";
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    // If stock count was modified, log inventory change
    if (
      updatedData.stockQuantity !== undefined &&
      updatedData.stockQuantity !== previousStock
    ) {
      const diff = updatedData.stockQuantity - previousStock;
      await Inventory.create({
        product: updatedProduct._id,
        type: "Manual Adjustment",
        quantityChange: diff,
        remainingStock: updatedProduct.stockQuantity,
        note: `Stock updated by Admin. Previous: ${previousStock}, New: ${updatedProduct.stockQuantity}`,
        adminRef: req.admin._id,
      });
    }

    // Log Activity
    await logAdminActivity(
      req.admin._id,
      "Update Product",
      `Updated product: "${updatedProduct.title}"`
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.deleted = true;
    product.deletedAt = new Date();
    await product.save();

    // Log Activity
    await logAdminActivity(
      req.admin._id,
      "Delete Product",
      `Deleted product: "${product.title}"`
    );

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk actions (delete, change status)
// @route   POST /api/products/bulk
// @access  Private
const bulkActions = async (req, res) => {
  const { ids, action, value } = req.body; // ids: array of ids, action: 'delete'|'status'|'stock', value: new status or value

  if (!ids || ids.length === 0) {
    return res.status(400).json({ message: "No product IDs supplied" });
  }

  try {
    if (action === "delete") {
      await Product.updateMany(
        { _id: { $in: ids } },
        { $set: { deleted: true, deletedAt: new Date() } }
      );

      await logAdminActivity(
        req.admin._id,
        "Bulk Delete Products",
        `Bulk deleted ${ids.length} products`
      );

      return res.json({ message: `Successfully deleted ${ids.length} products` });
    }

    if (action === "status") {
      await Product.updateMany(
        { _id: { $in: ids } },
        { $set: { status: value } }
      );

      await logAdminActivity(
        req.admin._id,
        "Bulk Status Update",
        `Set status of ${ids.length} products to "${value}"`
      );

      return res.json({ message: `Successfully updated ${ids.length} products to ${value}` });
    }

    res.status(400).json({ message: "Invalid bulk action" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkActions,
};
