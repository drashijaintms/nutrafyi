const express = require("express");
const router = express.Router();
const { protect, superAdminOnly } = require("../middleware/auth");
const {
  getApprovals,
  approveProduct,
  rejectProduct,
  approveCategory,
  rejectCategory,
  getPendingCount,
} = require("../controllers/approvalController");

// All routes require superadmin
router.get("/", protect, superAdminOnly, getApprovals);
router.get("/count", protect, superAdminOnly, getPendingCount);
router.post("/products/:id/approve", protect, superAdminOnly, approveProduct);
router.post("/products/:id/reject", protect, superAdminOnly, rejectProduct);
router.post("/categories/:id/approve", protect, superAdminOnly, approveCategory);
router.post("/categories/:id/reject", protect, superAdminOnly, rejectCategory);

module.exports = router;
