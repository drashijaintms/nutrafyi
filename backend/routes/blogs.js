const express = require("express");
const router = express.Router();
const {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/cmsController");
const { protect } = require("../middleware/auth");

router.get("/", getBlogs); // Public view
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
