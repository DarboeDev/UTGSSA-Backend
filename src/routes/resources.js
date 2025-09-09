const express = require("express");
const Resource = require("../models/Resource");
const { adminAuth } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const {
  handleResourceUpload,
  deleteResourceFile,
} = require("../middleware/upload");

const router = express.Router();

// Get all resources
router.get("/", async (req, res) => {
  try {
    const { department, year, subject, type } = req.query;
    let query = { isActive: true };

    if (department && department !== "all") {
      query.department = department;
    }

    if (year && year !== "all") {
      query.year = year;
    }

    if (subject && subject !== "all") {
      query.subject = subject;
    }

    if (type && type !== "all") {
      query.type = type;
    }

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single resource
router.get("/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource || !resource.isActive) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Increment download count
    resource.downloadCount += 1;
    await resource.save();

    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create resource (admin only)
router.post(
  "/",
  [
    adminAuth,
    handleResourceUpload,
    body("title").trim().isLength({ min: 1 }),
    body("description").trim().isLength({ min: 1 }),
    body("type").isIn(["pdf", "link", "video", "document", "file"]),
    body("department").trim().isLength({ min: 1 }),
    body("subject").trim().isLength({ min: 1 }),
    body("year").trim().isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      // Validate based on resource type
      if (["link", "video"].includes(req.body.type) && !req.body.url) {
        return res
          .status(400)
          .json({ message: "URL is required for link and video resources" });
      }
      
      // For PDF/document, either a file upload or URL is required
      if (["pdf", "document"].includes(req.body.type) && !req.file && !req.body.url) {
        return res
          .status(400)
          .json({ message: `Please upload a file or provide a URL for ${req.body.type} resources` });
      }
      
      // If we reach here and there's no URL set, we need to reject the request
      if (!req.body.url) {
        return res
          .status(400)
          .json({ message: "URL is required for all resources" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If there was a file uploaded but validation failed, delete the file
        if (req.body.file) {
          deleteResourceFile(req.body.file);
        }
        return res.status(400).json({ errors: errors.array() });
      }

      const resource = new Resource(req.body);
      await resource.save();
      res.status(201).json(resource);
    } catch (error) {
      console.error(error);
      // If there was a file uploaded but saving failed, delete the file
      if (req.body.file) {
        deleteResourceFile(req.body.file);
      }
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update resource (admin only)
router.put("/:id", [adminAuth, handleResourceUpload], async (req, res) => {
  try {
    // Find the existing resource
    const existingResource = await Resource.findById(req.params.id);
    if (!existingResource) {
      // If there was a file uploaded but resource not found, delete the file
      if (req.body.file) {
        deleteResourceFile(req.body.file);
      }
      return res.status(404).json({ message: "Resource not found" });
    }

    // If we got a new file upload, delete the old one if exists
    if (req.body.file && existingResource.file && existingResource.file !== req.body.file) {
      deleteResourceFile(existingResource.file);
    }

    // Validate URL based on resource type
    if (["link", "video"].includes(req.body.type) && !req.body.url) {
      // If there was a file uploaded but validation failed, delete the file
      if (req.body.file) {
        deleteResourceFile(req.body.file);
      }
      return res
        .status(400)
        .json({ message: "URL is required for link and video resources" });
    }
    
    // For PDF/document, if we have a new file upload, we're good
    // If no new file, then the existing URL must be retained
    if (["pdf", "document"].includes(req.body.type)) {
      // If we don't have a file upload and no URL in the payload, use the existing URL
      if (!req.file && !req.body.url) {
        if (existingResource.url) {
          req.body.url = existingResource.url;
        } else {
          return res
            .status(400)
            .json({ message: `File upload or URL is required for ${req.body.type} resources` });
        }
      }
    }

    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(resource);
  } catch (error) {
    console.error(error);
    // If there was a file uploaded but update failed, delete the file
    if (req.body.file) {
      deleteResourceFile(req.body.file);
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Delete resource (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
