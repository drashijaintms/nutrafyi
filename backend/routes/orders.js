const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  downloadInvoice,
} = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);
router.get("/:id/invoice", protect, downloadInvoice);

module.exports = router;
