import mongoose from "mongoose";

const pricingPlanSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    unit: { type: String, default: "/ month", trim: true },
    extrasBadge: { type: String, default: "", trim: true },
    extrasNote: { type: String, default: "", trim: true },
    features: { type: [String], default: [] },
    cta: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const PricingPlan = mongoose.model("PricingPlan", pricingPlanSchema);
