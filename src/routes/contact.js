const express = require("express");
const Contact = require("../models/Contact");
const { adminAuth } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Submit contact form
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 1 }),
    body("email").isEmail().normalizeEmail(),
    body("message").trim().isLength({ min: 10 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const contact = new Contact(req.body);
      await contact.save();

      res.status(201).json({
        message: "Message sent successfully! We will get back to you soon.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get all contact messages (admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const { isRead } = req.query;
    let query = {};

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const contacts = await Contact.find(query)
      .populate("respondedBy", "username")
      .sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark message as read (admin only)
router.put("/:id/read", adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Respond to message (admin only)
router.put(
  "/:id/respond",
  [adminAuth, body("response").trim().isLength({ min: 1 })],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const contact = await Contact.findByIdAndUpdate(
        req.params.id,
        {
          response: req.body.response,
          respondedAt: new Date(),
          respondedBy: req.user._id,
          isRead: true,
        },
        { new: true }
      ).populate("respondedBy", "username");

      if (!contact) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.json(contact);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete message (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
