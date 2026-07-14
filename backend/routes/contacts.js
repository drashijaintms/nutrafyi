const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Contact = require("../models/Contact");
const { protect } = require("../middleware/auth");

// @route   POST /api/contacts
// @desc    Submit contact message, save to DB, and send email notification
// @access  Public
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to Database
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    // Check SMTP Config in Environment Variables
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      try {
        let transporter;

        if (process.env.SMTP_HOST) {
          transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });
        } else {
          // Default to Gmail if host is not specified
          transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          });
        }

        const mailOptions = {
          from: smtpUser,
          to: "drashijain.tms@gmail.com",
          replyTo: email,
          subject: `Contact Form Submission: ${subject}`,
          text: `You have received a new contact form message.

Details:
---------------------------------------------
Name:    ${name}
Email:   ${email}
Subject: ${subject}

Message:
${message}
---------------------------------------------
This message has also been saved to the Admin Panel.`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to drashijain.tms@gmail.com from ${email}`);
      } catch (mailError) {
        console.error("Failed to send contact notification email:", mailError.message);
        // Do not return error, proceed since data is saved successfully in DB
      }
    } else {
      console.log("======================================================================");
      console.log("WARNING: SMTP credentials (SMTP_USER/SMTP_PASS) not set in backend/.env");
      console.log("Logging email details to console instead of sending:");
      console.log(`To: drashijain.tms@gmail.com`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Subject: Contact Form Submission: ${subject}`);
      console.log(`Message:\n${message}`);
      console.log("======================================================================");
    }

    res.status(201).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/contacts
// @desc    Retrieve all contact messages for admin view
// @access  Private (Admin)
router.get("/", protect, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact message by ID
// @access  Private (Admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
