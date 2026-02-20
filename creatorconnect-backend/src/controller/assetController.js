import cloudinary from "../config/cloudnary.js";
import Asset from "../models/assetModel.js";
import fs from "fs";

// Upload asset
export const uploadAsset = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Upload to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `creatorconnect/${req.user._id}`,
        });

        // ✅ Delete local file after uploading to cloudinary
        fs.unlinkSync(req.file.path);

        const asset = await Asset.create({
            user: req.user._id,
            url: result.secure_url,
            publicId: result.public_id,
            filename: req.file.originalname,
            size: result.bytes,
            format: result.format
        });

        res.status(201).json({ success: true, asset });
    } catch (error) {
        // ✅ Delete local file if upload fails too
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all assets of logged in user
export const getAssets = async (req, res) => {
    try {
        const assets = await Asset.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, assets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete asset
export const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({ success: false, message: "Asset not found" });
        }

        if (asset.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        // Delete from cloudinary
        await cloudinary.uploader.destroy(asset.publicId);

        // Delete from DB
        await Asset.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Asset deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};