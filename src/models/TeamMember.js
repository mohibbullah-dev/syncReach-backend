import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    img: { type: String, default: "" },
    facebookUrl: { type: String, default: "https://facebook.com" },
    linkedinUrl: { type: String, default: "https://linkedin.com" },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const TeamMember = mongoose.model("TeamMember", teamSchema);
