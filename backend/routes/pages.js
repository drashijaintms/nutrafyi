const express = require("express");
const router = express.Router();
const {
  getPages,
  createPage,
  updatePage,
  deletePage,
} = require("../controllers/cmsController");
const Page = require("../models/Page");
const { protect } = require("../middleware/auth");

router.get("/", getPages);

router.get("/:slug", async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, createPage);
router.put("/:id", protect, updatePage);
router.delete("/:id", protect, deletePage);

module.exports = router;
