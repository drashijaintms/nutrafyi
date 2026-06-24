const express = require("express");
const router = express.Router();
const {
  getInventoryStatus,
  getInventoryLogs,
  adjustStock,
} = require("../controllers/inventoryController");
const { protect } = require("../middleware/auth");

router.get("/status", protect, getInventoryStatus);
router.get("/logs", protect, getInventoryLogs);
router.post("/adjust", protect, adjustStock);

module.exports = router;
