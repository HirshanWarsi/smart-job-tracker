const multer = require("multer");

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === "application/pdf";
  const isPdfName = (file.originalname || "").toLowerCase().endsWith(".pdf");
  if (isPdfMime || isPdfName) {
    return cb(null, true);
  }
  cb(new Error("Only PDF files are allowed"));
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_BYTES },
  fileFilter,
});

/**
 * Parses multipart/form-data with a single file field named `resume`.
 * Sends 400 on multer / validation errors so routes stay thin.
 */
function uploadResume(req, res, next) {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Resume file is too large (max 5 MB)",
          });
        }
        return res.status(400).json({
          message: err.message || "File upload failed",
        });
      }
      if (err.message === "Only PDF files are allowed") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(400).json({ message: "Invalid file upload" });
    }
    next();
  });
}

module.exports = { uploadResume };
