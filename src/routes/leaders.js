const express = require("express");
const Leader = require("../models/Leader");
const { adminAuth } = require("../middleware/auth");
const { handleImageUpload, deleteImageFile } = require("../middleware/upload");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Get all leaders
router.get("/", async (req, res) => {
  console.log("Fetching all leaders");
  try {
    const leaders = await Leader.find({ isActive: true }).sort({
      order: 1,
      createdAt: -1,
    });
    console.log("Leaders fetched successfully");
    console.log(leaders);
    res.json(leaders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single leader
router.get("/:id", async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader || !leader.isActive) {
      return res.status(404).json({ message: "Leader not found" });
    }
    res.json(leader);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create leader (admin only)
router.post(
  "/",
  [
    adminAuth,
    handleImageUpload,
    body("name").trim().isLength({ min: 1 }),
    body("position").trim().isLength({ min: 1 }),
    body("bio").trim().isLength({ min: 1 }),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email must be valid if provided"),
    body("phone").optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const leader = new Leader(req.body);
      await leader.save();
      res.status(201).json(leader);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update leader (admin only)
router.put(
  "/:id",
  [
    adminAuth,
    handleImageUpload,
    body("name").optional().trim().isLength({ min: 1 }),
    body("position").optional().trim().isLength({ min: 1 }),
    body("bio").optional().trim().isLength({ min: 1 }),
    body("email")
      .optional()
      .isEmail()
      .withMessage("Email must be valid if provided"),
    body("phone").optional(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const oldLeader = await Leader.findById(req.params.id);
      if (!oldLeader) {
        return res.status(404).json({ message: "Leader not found" });
      }

      // If new image uploaded, delete old one
      if (req.file && oldLeader.image) {
        deleteImageFile(oldLeader.image);
      }

      const leader = await Leader.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      res.json(leader);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete leader (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const leader = await Leader.findById(req.params.id);
    if (!leader) {
      return res.status(404).json({ message: "Leader not found" });
    }

    // Delete associated image file
    if (leader.image) {
      deleteImageFile(leader.image);
    }

    await Leader.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json({ message: "Leader deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
