const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { protect, checkPermission } = require("../middleware/auth");

router.get("/", protect, checkPermission("users_view"), getCustomers);
router.get("/:id", protect, checkPermission("users_view"), getCustomerById);
router.post("/", protect, checkPermission("users_create"), createCustomer);
router.put("/:id", protect, checkPermission("users_edit"), updateCustomer);
router.delete("/:id", protect, checkPermission("users_delete"), deleteCustomer);

module.exports = router;
