const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Ensure upload directories exist (for local storage fallback)
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Create upload directories
ensureDirectoryExists("./uploads/images/leaders");
ensureDirectoryExists("./uploads/images/events");
ensureDirectoryExists("./uploads/images/news");
ensureDirectoryExists("./uploads/images/general");
ensureDirectoryExists("./uploads/resources");

// Determine if we should use Cloudinary or local storage
const useCloudinary = process.env.USE_CLOUDINARY === "true";

// Configure local storage
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "./uploads/images/general";

    // Determine upload path based on the route
    if (req.baseUrl.includes("/leaders")) {
      uploadPath = "./uploads/images/leaders";
    } else if (req.baseUrl.includes("/events")) {
      uploadPath = "./uploads/images/events";
    } else if (req.baseUrl.includes("/news")) {
      uploadPath = "./uploads/images/news";
    } else if (req.baseUrl.includes("/resources")) {
      uploadPath = "./uploads/resources";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // For resources route, allow PDFs and documents
  if (req.baseUrl.includes("/resources")) {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];

    if (
      allowedMimeTypes.includes(file.mimetype) ||
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, document, and image files are allowed!"), false);
    }
  }
  // For other routes, only allow images
  else if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Configure Cloudinary storage
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: (req, file) => {
      if (req.baseUrl.includes("/leaders")) return "utg-ssa/leaders";
      if (req.baseUrl.includes("/events")) return "utg-ssa/events";
      if (req.baseUrl.includes("/news")) return "utg-ssa/news";
      if (req.baseUrl.includes("/resources")) return "utg-ssa/resources";
      return "utg-ssa/general";
    },
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const filename = file.originalname.split(".")[0];
      return `${filename}-${uniqueSuffix}`;
    },
    resource_type: (req, file) => {
      if (req.baseUrl.includes("/resources")) {
        if (file.mimetype.startsWith("image/")) return "image";
        if (file.mimetype === "application/pdf") return "raw";
        return "auto";
      }
      return "image";
    }
  }
});

// Configure multer
const upload = multer({
  storage: useCloudinary ? cloudinaryStorage : localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Middleware for single file upload
const uploadSingle = (fieldName) => upload.single(fieldName);

// Image upload middleware
const handleImageUpload = (req, res, next) => {
  uploadSingle("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File too large. Maximum size is 5MB." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    // If file was uploaded, add the path to req.body
    if (req.file) {
      // If using Cloudinary, use the URL from Cloudinary directly
      if (useCloudinary && req.file.path) {
        req.body.image = req.file.path;
        console.log('Cloudinary image URL:', req.file.path);
      } else {
        // For local storage, construct the proper path
        req.body.image = `/uploads/${req.file.path
          .replace(/\\/g, "/")
          .replace("uploads/", "")}`;
        console.log('Local image path:', req.body.image);
      }
    }

    next();
  });
};

// Resource file upload middleware
const handleResourceUpload = (req, res, next) => {
  uploadSingle("file")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File too large. Maximum size is 5MB." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    // If file was uploaded, add the path to req.body
    if (req.file) {
      // If using Cloudinary, use the URL from Cloudinary directly
      if (useCloudinary && req.file.path) {
        req.body.file = req.file.path;
        console.log('Cloudinary file URL:', req.file.path);
      } else {
        // For local storage, construct the proper path
        req.body.file = `/uploads/${req.file.path
          .replace(/\\/g, "/")
          .replace("uploads/", "")}`;
        console.log('Local file path:', req.body.file);
      }
      
      // If resource type is pdf/document and file was uploaded, set URL to the file path
      if (["pdf", "document"].includes(req.body.type)) {
        req.body.url = req.body.file;
        console.log(`Setting URL for ${req.body.type} resource:`, req.body.url);
      } 
      // For link/video types, ensure URL exists
      else if (["link", "video"].includes(req.body.type) && !req.body.url) {
        return res.status(400).json({ message: "URL is required for non-file resources" });
      }
    }

    next();
  });
};

// Function to delete old image file
const deleteImageFile = (imagePath) => {
  if (
    imagePath &&
    imagePath !== "/images/dummy.jpg" &&
    !imagePath.startsWith("http")
  ) {
    const fullPath = path.join(
      __dirname,
      "..",
      "..",
      imagePath.replace(/^\//, "")
    );
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// Function to delete resource file
const deleteResourceFile = (filePath) => {
  // Handle Cloudinary resources
  if (filePath && filePath.includes('cloudinary.com')) {
    try {
      const publicId = filePath.split('/').pop().split('.')[0]; // Extract public ID
      if (publicId) {
        cloudinary.uploader.destroy(publicId);
      }
    } catch (err) {
      console.error("Error deleting from Cloudinary:", err);
    }
  }
  // Handle local files
  else if (filePath && !filePath.startsWith("http")) {
    const fullPath = path.join(
      __dirname,
      "..",
      "..",
      filePath.replace(/^\//, "")
    );
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

module.exports = {
  handleImageUpload,
  handleResourceUpload,
  deleteImageFile,
  deleteResourceFile,
};
