const express = require("express");
const News = require("../models/News");
const { adminAuth } = require("../middleware/auth");
const { handleImageUpload, deleteImageFile } = require("../middleware/upload");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// Get all news
router.get("/", async (req, res) => {
  try {
    const { limit = 10, category } = req.query;
    let query = { isPublished: true };

    if (category && category !== "all") {
      query.category = category;
    }

    const news = await News.find(query)
      .sort({ publishDate: -1 })
      .limit(parseInt(limit));

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single news
router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news || !news.isPublished) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create news (admin only)
router.post(
  "/",
  [
    adminAuth,
    handleImageUpload,
    body("title").trim().isLength({ min: 1 }),
    body("summary").trim().isLength({ min: 1 }),
    body("content").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const news = new News(req.body);
      await news.save();
      res.status(201).json(news);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update news (admin only)
router.put("/:id", [adminAuth, handleImageUpload], async (req, res) => {
  try {
    const oldNews = await News.findById(req.params.id);
    if (!oldNews) {
      return res.status(404).json({ message: "News not found" });
    }

    // If new image uploaded, delete old one
    if (req.file && oldNews.image) {
      deleteImageFile(oldNews.image);
    }

    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete news (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Delete associated image file
    if (news.image) {
      deleteImageFile(news.image);
    }

    await News.findByIdAndUpdate(
      req.params.id,
      { isPublished: false },
      { new: true }
    );

    res.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
