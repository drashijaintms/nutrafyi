const Review = require("../models/Review");
const Product = require("../models/Product");
const { logAdminActivity } = require("../middleware/activityLogger");

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("product", "title slug image")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Moderate a review (approve/reject)
// @route   PUT /api/reviews/:id/status
// @access  Private
const updateReviewStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.status = status;
    await review.save();

    // Re-calculate product ratings if review is approved or changed status
    await recalculateProductRating(review.product);

    await logAdminActivity(
      req.admin._id,
      "Moderate Review",
      `Set status of review by ${review.customer.name} to "${status}"`
    );

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private
const replyToReview = async (req, res) => {
  const { reply } = req.body;

  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.reply = reply;
    review.replyDate = new Date();
    review.status = "Approved"; // auto approve upon replying
    await review.save();

    await recalculateProductRating(review.product);

    await logAdminActivity(
      req.admin._id,
      "Reply Review",
      `Replied to review by ${review.customer.name}`
    );

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recompute product ratings
    await recalculateProductRating(productId);

    await logAdminActivity(
      req.admin._id,
      "Delete Review",
      `Deleted review by ${review.customer.name}`
    );

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: Recalculate average rating and reviews count for a product
const recalculateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId, status: "Approved" });
    const count = reviews.length;
    const rating =
      count > 0
        ? parseFloat(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
          )
        : 0;

    await Product.findByIdAndUpdate(productId, {
      rating,
      reviews: count,
    });
  } catch (err) {
    console.error("Failed to recalculate rating for product:", productId, err.message);
  }
};

module.exports = {
  getReviews,
  updateReviewStatus,
  replyToReview,
  deleteReview,
};
