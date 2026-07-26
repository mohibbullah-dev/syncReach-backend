import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // "audio" kept briefly for legacy docs; API maps audio → image
    type: { type: String, enum: ["text", "image", "video", "audio"], required: true },
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    role: { type: String, default: "Customer" },
    avatar: { type: String, default: "" },
    body: { type: String, required: true },
    mediaUrl: { type: String },
    thumbnailUrl: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Review = mongoose.model("Review", reviewSchema);
