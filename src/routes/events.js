const express = require("express");
const Event = require("../models/Event");
const { adminAuth } = require("../middleware/auth");
const { handleImageUpload, deleteImageFile } = require("../middleware/upload");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const { highlighted, upcoming } = req.query;
    let query = { isActive: true };

    if (highlighted === "true") {
      query.isHighlighted = true;
    }

    if (upcoming === "true") {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event || !event.isActive) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create event (admin only)
router.post(
  "/",
  [
    adminAuth,
    handleImageUpload,
    body("title").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
    body("date").isISO8601(),
    body("time").trim().isLength({ min: 1 }),
    body("location").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const event = new Event(req.body);
      await event.save();
      res.status(201).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update event (admin only)
router.put("/:id", [adminAuth, handleImageUpload], async (req, res) => {
  try {
    const oldEvent = await Event.findById(req.params.id);
    if (!oldEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If new image uploaded, delete old one
    if (req.file && oldEvent.image) {
      deleteImageFile(oldEvent.image);
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete event (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete associated image file
    if (event.image) {
      deleteImageFile(event.image);
    }

    await Event.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
