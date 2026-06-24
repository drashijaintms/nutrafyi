const express = require("express");
const router = express.Router();
const { upload, uploadToCloudinary } = require("../services/cloudinary");
const { protect } = require("../middleware/auth");

// @desc    Upload single image
// @route   POST /api/uploads
// @access  Private (Admin)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.path, "nutrafyi/products");

    res.json({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Upload multiple images (gallery)
// @route   POST /api/uploads/gallery
// @access  Private (Admin)
router.post("/gallery", protect, upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.path, "nutrafyi/gallery")
    );

    const results = await Promise.all(uploadPromises);

    res.json({
      urls: results.map((r) => r.url),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
