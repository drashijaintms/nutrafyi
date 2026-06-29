const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");
const { protect } = require("../middleware/auth");

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to the newsletter
// @access  Public
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(200).json({ message: "You are already subscribed to our newsletter!" });
    }

    // Create new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Successfully subscribed to our newsletter!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/newsletter/count
// @desc    Get total subscribers count
// @access  Private (Admin)
router.get("/count", protect, async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
