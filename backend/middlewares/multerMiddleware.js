import multer from "multer";
import path from "path";

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/images/"); // Folder where images will be stored
  },
  filename: function (req, file, cb) {
    // Save file with a unique name
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter for validation
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed."), false);
  }
};

// Configure Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
});

export default upload;
