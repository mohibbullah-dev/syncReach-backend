import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["video", "image"], required: true },
    mediaUrl: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: true },
);

const heroCarouselSchema = new mongoose.Schema(
  {
    autoplay: { type: Boolean, default: true },
    autoplayIntervalMs: { type: Number, default: 5000 },
    loop: { type: Boolean, default: true },
    showDots: { type: Boolean, default: true },
    showArrows: { type: Boolean, default: true },
    pauseOnHover: { type: Boolean, default: true },
  },
  { _id: false },
);

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
    slides: { type: [heroSlideSchema], default: [] },
    carousel: {
      type: heroCarouselSchema,
      default: () => ({
        autoplay: true,
        autoplayIntervalMs: 5000,
        loop: true,
        showDots: true,
        showArrows: true,
        pauseOnHover: true,
      }),
    },
    // Legacy single-media fields (migrated to slides on read)
    mediaType: { type: String, enum: ["video", "image"], default: "video" },
    mediaUrl: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const HeroContent = mongoose.model("HeroContent", heroSchema);

export function defaultHeroCarousel() {
  return {
    autoplay: true,
    autoplayIntervalMs: 5000,
    loop: true,
    showDots: true,
    showArrows: true,
    pauseOnHover: true,
  };
}

export function defaultHeroPayload() {
  return {
    headlineBefore: "We bring",
    headlineHighlight: "the leads.",
    headlineLine2: "You close the deal.",
    description:
      "We help B2B businesses build qualified sales pipelines through strategic cold email and LinkedIn outreach, powered by AI driven personalisation, lead qualification, and appointment setting.",
    slides: [],
    carousel: defaultHeroCarousel(),
    published: true,
  };
}
