import { PricingPlan, defaultCustomConfig } from "../models/PricingPlan.js";

function mapCustomConfig(cfg) {
  if (!cfg) return null;
  const o = typeof cfg.toObject === "function" ? cfg.toObject() : cfg;
  const levers = Array.isArray(o.levers)
    ? o.levers.map((l) => ({
        id: l.id,
        label: l.label,
        kind: l.kind,
        min: Number(l.min) || 0,
        max: Number(l.max) || 100,
        step: Number(l.step) || 1,
        unitPrice: Number(l.unitPrice) || 0,
      }))
    : [];
  if (!levers.length) return null;
  return {
    basePrice: Number(o.basePrice) || 0,
    currencyPrefix: o.currencyPrefix || "$",
    unitLabel: o.unitLabel || "/ month",
    roundTo: Number(o.roundTo) || 50,
    estimateNote:
      o.estimateNote || "Estimated monthly · final quote confirmed by team",
    defaults: o.defaults && typeof o.defaults === "object" ? o.defaults : {},
    levers,
  };
}

function looksLikeCustomPlan(o) {
  const badge = String(o.badge || "").trim().toLowerCase();
  const name = String(o.name || "").trim().toLowerCase();
  const price = String(o.price || "").trim().toLowerCase();
  if (o.planType === "custom") return true;
  if (Array.isArray(o.customConfig?.levers) && o.customConfig.levers.length > 0) return true;
  if (badge === "custom" || name === "custom") return true;
  if (price === "custom" || price === "quote") return true;
  return false;
}

function mapPlan(doc) {
  const o = doc.toObject();
  const planType = looksLikeCustomPlan(o) ? "custom" : "fixed";
  return {
    id: o._id.toString(),
    badge: o.badge,
    name: o.name,
    desc: o.desc,
    price: o.price || "",
    unit: o.unit || "/ month",
    extrasBadge: o.extrasBadge || "",
    extrasNote: o.extrasNote || "",
    features: Array.isArray(o.features) ? o.features : [],
    cta: o.cta,
    featured: Boolean(o.featured),
    sortOrder: o.sortOrder ?? 0,
    published: o.published !== false,
    planType,
    customConfig: planType === "custom" ? mapCustomConfig(o.customConfig) || defaultCustomConfig() : null,
  };
}

function sanitizeBody(body = {}) {
  const planType = body.planType === "custom" ? "custom" : "fixed";
  const payload = {
    badge: body.badge,
    name: body.name,
    desc: body.desc,
    price: planType === "custom" ? body.price || "Custom" : body.price,
    unit: body.unit || "/ month",
    extrasBadge: body.extrasBadge || "",
    extrasNote: body.extrasNote || "",
    features: Array.isArray(body.features) ? body.features : [],
    cta: body.cta,
    featured: Boolean(body.featured),
    sortOrder: Number(body.sortOrder) || 0,
    published: body.published !== false,
    planType,
  };

  if (planType === "custom") {
    const cfg = body.customConfig && typeof body.customConfig === "object"
      ? body.customConfig
      : defaultCustomConfig();
    payload.customConfig = {
      basePrice: Number(cfg.basePrice) || 0,
      currencyPrefix: cfg.currencyPrefix || "$",
      unitLabel: cfg.unitLabel || "/ month",
      roundTo: Number(cfg.roundTo) || 50,
      estimateNote: cfg.estimateNote || "Estimated monthly · final quote confirmed by team",
      defaults: cfg.defaults && typeof cfg.defaults === "object" ? cfg.defaults : {},
      levers: Array.isArray(cfg.levers) ? cfg.levers : defaultCustomConfig().levers,
    };
  } else {
    payload.customConfig = undefined;
  }

  return payload;
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
    const item = await PricingPlan.create(sanitizeBody(req.body));
    res.status(201).json(mapPlan(item));
  } catch (err) {
    next(err);
  }
}

export async function updatePricingPlan(req, res, next) {
  try {
    const payload = sanitizeBody(req.body);
    const item = await PricingPlan.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Pricing plan not found." });

    item.badge = payload.badge;
    item.name = payload.name;
    item.desc = payload.desc;
    item.price = payload.price;
    item.unit = payload.unit;
    item.extrasBadge = payload.extrasBadge;
    item.extrasNote = payload.extrasNote;
    item.features = payload.features;
    item.cta = payload.cta;
    item.featured = payload.featured;
    item.sortOrder = payload.sortOrder;
    item.published = payload.published;
    item.planType = payload.planType;
    if (payload.planType === "custom") {
      item.customConfig = payload.customConfig;
    } else {
      item.customConfig = undefined;
    }
    item.markModified("customConfig");
    await item.save();
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
