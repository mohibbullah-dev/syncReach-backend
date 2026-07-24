import { PricingPlan } from "../models/PricingPlan.js";

function mapPlan(doc) {
  const o = doc.toObject();
  return {
    id: o._id.toString(),
    badge: o.badge,
    name: o.name,
    desc: o.desc,
    price: o.price,
    unit: o.unit || "/ month",
    extrasBadge: o.extrasBadge || "",
    extrasNote: o.extrasNote || "",
    features: Array.isArray(o.features) ? o.features : [],
    cta: o.cta,
    featured: Boolean(o.featured),
    sortOrder: o.sortOrder ?? 0,
    published: o.published !== false,
  };
}

export async function listPublicPricing(req, res, next) {
  try {
    const items = await PricingPlan.find({ published: true }).sort({ sortOrder: 1 });
    res.json(items.map(mapPlan));
  } catch (err) {
    next(err);
  }
}

export async function listPricing(req, res, next) {
  try {
    const items = await PricingPlan.find().sort({ sortOrder: 1 });
    res.json(items.map(mapPlan));
  } catch (err) {
    next(err);
  }
}

export async function createPricingPlan(req, res, next) {
  try {
    const item = await PricingPlan.create(req.body);
    res.status(201).json(mapPlan(item));
  } catch (err) {
    next(err);
  }
}

export async function updatePricingPlan(req, res, next) {
  try {
    const item = await PricingPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Pricing plan not found." });
    res.json(mapPlan(item));
  } catch (err) {
    next(err);
  }
}

export async function deletePricingPlan(req, res, next) {
  try {
    const item = await PricingPlan.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Pricing plan not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
