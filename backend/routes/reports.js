const express = require("express");
const router = express.Router();
const {
  getRevenueReport,
  getProductReport,
  getCustomerReport,
  exportCSV,
} = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

router.get("/revenue", protect, getRevenueReport);
router.get("/products", protect, getProductReport);
router.get("/customers", protect, getCustomerReport);
router.get("/export", protect, exportCSV);

module.exports = router;
