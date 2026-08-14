import multer from "multer";

const MAX_FILE_SIZE_MB = 8;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Allowed: jpg, png, webp, gif, mp4, mov"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

export default upload;
