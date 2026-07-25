import mongoose from "mongoose";

const leverSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    kind: { type: String, enum: ["slider", "stepper", "toggle"], required: true },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 },
    step: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
  },
  { _id: false },
);

const customConfigSchema = new mongoose.Schema(
  {
    basePrice: { type: Number, default: 1500 },
    currencyPrefix: { type: String, default: "$", trim: true },
    unitLabel: { type: String, default: "/ month", trim: true },
    roundTo: { type: Number, default: 50 },
    estimateNote: {
      type: String,
      default: "Estimated monthly · final quote confirmed by team",
      trim: true,
    },
    defaults: { type: mongoose.Schema.Types.Mixed, default: {} },
    levers: { type: [leverSchema], default: [] },
  },
  { _id: false },
);

const pricingPlanSchema = new mongoose.Schema(
  {
    badge: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    desc: { type: String, required: true, trim: true },
    price: { type: String, default: "", trim: true },
    unit: { type: String, default: "/ month", trim: true },
    extrasBadge: { type: String, default: "", trim: true },
    extrasNote: { type: String, default: "", trim: true },
    features: { type: [String], default: [] },
    cta: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    planType: { type: String, enum: ["fixed", "custom"], default: "fixed" },
    customConfig: { type: customConfigSchema, default: undefined },
  },
  { timestamps: true },
);

export const PricingPlan = mongoose.model("PricingPlan", pricingPlanSchema);

/** Default CMS config for Custom quote builder */
export function defaultCustomConfig() {
  return {
    basePrice: 1500,
    currencyPrefix: "$",
    unitLabel: "/ month",
    roundTo: 50,
    estimateNote: "Estimated monthly · final quote confirmed by team",
    defaults: { emails: 50000, inboxes: 10, seats: 3, linkedin: false },
    levers: [
      {
        id: "emails",
        label: "Emails / month",
        kind: "slider",
        min: 25000,
        max: 200000,
        step: 25000,
        unitPrice: 0.008,
      },
      {
        id: "inboxes",
        label: "Warmed inboxes",
        kind: "stepper",
        min: 5,
        max: 50,
        step: 1,
        unitPrice: 40,
      },
      {
        id: "seats",
        label: "Seats",
        kind: "stepper",
        min: 1,
        max: 20,
        step: 1,
        unitPrice: 75,
      },
      {
        id: "linkedin",
        label: "LinkedIn outreach",
        kind: "toggle",
        min: 0,
        max: 1,
        step: 1,
        unitPrice: 300,
      },
    ],
  };
}
