const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const { logAdminActivity } = require("../middleware/activityLogger");

const getApprovals = async (req, res) => {
  try {
    const type = req.query.type;
    const status = req.query.status || "pending";
    let products = [];
    let categories = [];
    let brands = [];
    if (!type || type === "products") {
      products = await Product.find({ approvalStatus: status, deleted: { "$ne": true } })
        .populate("submittedBy", "name email role").sort({ createdAt: -1 });
    }
    if (!type || type === "categories") {
      categories = await Category.find({ approvalStatus: status, deleted: { "$ne": true } })
        .populate("submittedBy", "name email role").sort({ createdAt: -1 });
    }
    if (!type || type === "brands") {
      brands = await Brand.find({ approvalStatus: status })
        .populate("submittedBy", "name email role").sort({ createdAt: -1 });
    }
    const pendingProductsCount = await Product.countDocuments({ approvalStatus: "pending", deleted: { "$ne": true } });
    const pendingCategoriesCount = await Category.countDocuments({ approvalStatus: "pending", deleted: { "$ne": true } });
    const pendingBrandsCount = await Brand.countDocuments({ approvalStatus: "pending" });
    res.json({
      products,
      categories,
      brands,
      pendingCount: pendingProductsCount + pendingCategoriesCount + pendingBrandsCount,
      pendingProductsCount,
      pendingCategoriesCount,
      pendingBrandsCount,
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const approveProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { approvalStatus: "approved", approvalNote: "" }, { new: true }).populate("submittedBy", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    await logAdminActivity(req.admin._id, "Approve Product", "Approved: " + product.title);
    res.json({ message: "Product approved successfully", product });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const rejectProduct = async (req, res) => {
  try {
    const note = req.body.note;
    const product = await Product.findByIdAndUpdate(req.params.id, { approvalStatus: "rejected", approvalNote: note || "Rejected by super admin" }, { new: true }).populate("submittedBy", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    await logAdminActivity(req.admin._id, "Reject Product", "Rejected: " + product.title + " Reason: " + (note || "No reason given"));
    res.json({ message: "Product rejected", product });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const approveCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { approvalStatus: "approved", approvalNote: "" }, { new: true }).populate("submittedBy", "name email");
    if (!category) return res.status(404).json({ message: "Category not found" });
    await logAdminActivity(req.admin._id, "Approve Category", "Approved: " + category.title);
    res.json({ message: "Category approved successfully", category });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const rejectCategory = async (req, res) => {
  try {
    const note = req.body.note;
    const category = await Category.findByIdAndUpdate(req.params.id, { approvalStatus: "rejected", approvalNote: note || "Rejected by super admin" }, { new: true }).populate("submittedBy", "name email");
    if (!category) return res.status(404).json({ message: "Category not found" });
    await logAdminActivity(req.admin._id, "Reject Category", "Rejected: " + category.title + " Reason: " + (note || "No reason given"));
    res.json({ message: "Category rejected", category });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const approveBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, { approvalStatus: "approved", approvalNote: "" }, { new: true }).populate("submittedBy", "name email");
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    await logAdminActivity(req.admin._id, "Approve Brand", "Approved: " + brand.name);
    res.json({ message: "Brand approved successfully", brand });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const rejectBrand = async (req, res) => {
  try {
    const note = req.body.note;
    const brand = await Brand.findByIdAndUpdate(req.params.id, { approvalStatus: "rejected", approvalNote: note || "Rejected by super admin" }, { new: true }).populate("submittedBy", "name email");
    if (!brand) return res.status(404).json({ message: "Brand not found" });
    await logAdminActivity(req.admin._id, "Reject Brand", "Rejected: " + brand.name + " Reason: " + (note || "No reason given"));
    res.json({ message: "Brand rejected", brand });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getPendingCount = async (req, res) => {
  try {
    const productCount = await Product.countDocuments({ approvalStatus: "pending", deleted: { "$ne": true } });
    const categoryCount = await Category.countDocuments({ approvalStatus: "pending", deleted: { "$ne": true } });
    const brandCount = await Brand.countDocuments({ approvalStatus: "pending" });
    res.json({ pendingCount: productCount + categoryCount + brandCount, productCount, categoryCount, brandCount });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
  getApprovals,
  approveProduct,
  rejectProduct,
  approveCategory,
  rejectCategory,
  approveBrand,
  rejectBrand,
  getPendingCount,
};
