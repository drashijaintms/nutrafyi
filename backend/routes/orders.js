const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  updateOrderStatus,
  downloadInvoice,
  createOrder,
  trackOrderPublic,
} = require("../controllers/orderController");
const { protect, checkPermission } = require("../middleware/auth");

router.get("/", protect, checkPermission("orders"), getOrders);
router.post("/", createOrder);
router.get("/track/:orderId", trackOrderPublic);
router.get("/:id", protect, checkPermission("orders"), getOrderById);
router.put("/:id/status", protect, checkPermission("orders"), updateOrderStatus);
router.get("/:id/invoice", protect, checkPermission("orders"), downloadInvoice);

module.exports = router;
