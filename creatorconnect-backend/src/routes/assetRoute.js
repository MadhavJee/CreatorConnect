import express from "express";
import multer from "multer";
import { uploadAsset, getAssets, deleteAsset } from "../controller/assetController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // ← increased to 10MB
});

// ✅ Multer error handler middleware
const uploadMiddleware = (req, res, next) => {
    upload.single("file")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    success: false,
                    message: "File too large. Maximum size is 10MB"
                });
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};

router.get("/", protect, getAssets);
router.post("/upload", protect, uploadMiddleware, uploadAsset);  // ← use uploadMiddleware
router.delete("/:id", protect, deleteAsset);

export default router;