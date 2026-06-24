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

module.exports = {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
