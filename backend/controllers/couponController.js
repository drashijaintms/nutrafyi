const Coupon = require("../models/Coupon");
const { logAdminActivity } = require("../middleware/activityLogger");

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private
const createCoupon = async (req, res) => {
  try {
    const couponExists = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (couponExists) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = new Coupon({
      ...req.body,
      code: req.body.code.toUpperCase(),
    });

    const savedCoupon = await coupon.save();

    await logAdminActivity(
      req.admin._id,
      "Create Coupon",
      `Created coupon: "${savedCoupon.code}"`
    );

    res.status(201).json(savedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (req.body.code && req.body.code.toUpperCase() !== coupon.code) {
      const codeExists = await Coupon.findOne({ code: req.body.code.toUpperCase() });
      if (codeExists) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
      req.body.code = req.body.code.toUpperCase();
    }

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    await logAdminActivity(
      req.admin._id,
      "Update Coupon",
      `Updated coupon: "${updatedCoupon.code}"`
    );

    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    await Coupon.findByIdAndDelete(req.params.id);

    await logAdminActivity(
      req.admin._id,
      "Delete Coupon",
      `Deleted coupon: "${coupon.code}"`
    );

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate a coupon code (public)
// @route   GET /api/coupons/validate/:code
// @access  Public
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const subtotal = parseFloat(req.query.subtotal) || 0;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is inactive" });
    }

    const now = new Date();
    if (now < new Date(coupon.startDate)) {
      return res.status(400).json({ message: "Coupon is not active yet" });
    }
    if (now > new Date(coupon.endDate)) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum spend of $${coupon.minOrderAmount.toFixed(2)} required for this coupon` 
      });
    }

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscount: coupon.maxDiscount,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};
