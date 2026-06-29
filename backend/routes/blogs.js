const express = require("express");
const router = express.Router();
const {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
  incrementBlogViews,
} = require("../controllers/cmsController");
const { protect } = require("../middleware/auth");

router.get("/", getBlogs); // Public view
router.get("/:slug", getBlogBySlug);
router.post("/:slug/view", incrementBlogViews);
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;
