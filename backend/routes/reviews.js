const express = require("express");
const router = express.Router();
const {
  getReviews,
  updateReviewStatus,
  replyToReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getReviews);
router.put("/:id/status", protect, updateReviewStatus);
router.post("/:id/reply", protect, replyToReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;
