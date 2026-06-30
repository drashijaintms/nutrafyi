const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  toggleWishlist,
  addAddress,
  forgotPasswordUser,
} = require("../controllers/userController");
const { protectUser } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPasswordUser);
router.get("/profile", protectUser, getUserProfile);
router.post("/wishlist", protectUser, toggleWishlist);
router.post("/address", protectUser, addAddress);

module.exports = router;
