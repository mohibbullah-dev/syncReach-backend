import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    headlineBefore: { type: String, default: "We bring" },
    headlineHighlight: { type: String, default: "the leads." },
    headlineLine2: { type: String, default: "You close the deal." },
    description: {
      type: String,
      default:
        "We help B2B businesses build qualified sales pipelines through strategic cold email and LinkedIn outreach, powered by AI driven personalisation, lead qualification, and appointment setting.",
    },
    mediaType: { type: String, enum: ["video", "image"], default: "video" },
    mediaUrl: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const HeroContent = mongoose.model("HeroContent", heroSchema);

export function defaultHeroPayload() {
  return {
    headlineBefore: "We bring",
    headlineHighlight: "the leads.",
    headlineLine2: "You close the deal.",
    description:
      "We help B2B businesses build qualified sales pipelines through strategic cold email and LinkedIn outreach, powered by AI driven personalisation, lead qualification, and appointment setting.",
    mediaType: "video",
    mediaUrl: "",
    posterUrl: "",
    published: true,
  };
}
