const express = require("express");
const router = express.Router();
const {
  login,
  refreshToken,
  logout,
  getProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logout);
router.get("/profile", protect, getProfile);

module.exports = router;
