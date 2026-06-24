const express = require("express");
const router = express.Router();
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/cmsController");
const { protect } = require("../middleware/auth");

router.get("/", getBanners); // Public view
router.post("/", protect, createBanner);
router.put("/:id", protect, updateBanner);
router.delete("/:id", protect, deleteBanner);

module.exports = router;
