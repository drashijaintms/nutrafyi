const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "nutrafyi_cloud",
  api_key: process.env.CLOUDINARY_API_KEY || "dummy_api_key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "dummy_api_secret",
});

// Configure Multer memory storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // If uploads folder doesn't exist, it'll be created or fallback to OS temp dir
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed!"));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Create uploads directory if it doesn't exist
const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload file helper
const uploadToCloudinary = async (filePath, folder = "nutrafyi") => {
  const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== "nutrafyi_cloud" && 
    process.env.CLOUDINARY_CLOUD_NAME !== "dummy" &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes("dummy");

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: folder,
      });
      // Remove local file
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Local file unlink error:", err);
      }
      return { url: result.secure_url, publicId: result.public_id };
    } catch (error) {
      console.error("Cloudinary upload failed, falling back to local storage:", error.message);
    }
  } else {
    console.log("Cloudinary is not configured. Falling back to local storage.");
  }

  // Fallback to local storage: keep the file in `uploads` folder and return the local URL
  const filename = path.basename(filePath);
  const port = process.env.PORT || 5000;
  const localUrl = `http://localhost:${port}/uploads/${filename}`;
  return { url: localUrl, publicId: null };
};

module.exports = { upload, uploadToCloudinary };
