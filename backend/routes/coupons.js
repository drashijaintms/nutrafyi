const express = require("express");
const router = express.Router();
const {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getCoupons);
router.post("/", protect, createCoupon);
router.put("/:id", protect, updateCoupon);
router.delete("/:id", protect, deleteCoupon);

module.exports = router;
