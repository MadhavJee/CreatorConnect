import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    url: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    size: {
        type: Number
    },
    format: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Asset", assetSchema);