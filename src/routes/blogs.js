const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/images/blogs/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const { category, tag, search, published } = req.query;
    let filter = {};

    if (published !== undefined) {
      filter.isPublished = published === "true";
    } else {
      filter.isPublished = true; // Default to published blogs
    }

    if (category) {
      filter.category = category;
    }

    if (tag) {
      filter.tags = { $in: [tag] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await Blog.find(filter)
      .sort({ publishDate: -1, createdAt: -1 })
      .select("-__v");

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
});

// Get single blog
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
});

// Create new blog
router.post("/", upload.single("thumbnail"), async (req, res) => {
  try {
    const blogData = {
      ...req.body,
    };

    // Handle thumbnail upload
    if (req.file) {
      blogData.thumbnail = `/uploads/images/blogs/${req.file.filename}`;
    }

    // Parse tags if they come as string
    if (req.body.tags && typeof req.body.tags === "string") {
      blogData.tags = req.body.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Validation Error: " + error.message,
    });
  }
});

// Update blog
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    const updateData = { ...req.body };

    // Handle thumbnail upload
    if (req.file) {
      updateData.thumbnail = `/uploads/images/blogs/${req.file.filename}`;
    }

    // Parse tags if they come as string
    if (req.body.tags && typeof req.body.tags === "string") {
      updateData.tags = req.body.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Update Error: " + error.message,
    });
  }
});

// Delete blog
router.delete("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
});

// Like/Unlike blog
router.post("/:id/like", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    blog.likes += 1;
    await blog.save();

    res.json({
      success: true,
      data: { likes: blog.likes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
});

// Get popular blogs (by views and likes)
router.get("/featured/popular", async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ views: -1, likes: -1 })
      .limit(6)
      .select("-content -__v");

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
});

// Get recent blogs
router.get("/featured/recent", async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishDate: -1, createdAt: -1 })
      .limit(6)
      .select("-content -__v");

    res.json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error: " + error.message,
    });
  }
});

module.exports = router;
