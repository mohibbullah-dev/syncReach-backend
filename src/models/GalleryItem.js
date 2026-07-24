import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["photo", "video"], required: true },
    title: { type: String, required: true, trim: true },
    caption: { type: String, default: "" },
    src: { type: String, required: true },
    thumbnailUrl: { type: String },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const GalleryItem = mongoose.model("GalleryItem", gallerySchema);
