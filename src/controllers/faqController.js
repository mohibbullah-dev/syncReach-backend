import { FaqItem } from "../models/FaqItem.js";

function mapFaq(doc) {
  const o = doc.toObject();
  return {
    id: o._id.toString(),
    question: o.question,
    answer: o.answer,
    sortOrder: o.sortOrder ?? 0,
    published: o.published !== false,
  };
}

function sanitizeBody(body = {}) {
  return {
    question: String(body.question || "").trim(),
    answer: String(body.answer || "").trim(),
    sortOrder: Number(body.sortOrder) || 0,
    published: body.published !== false,
  };
}

export async function listPublicFaq(req, res, next) {
  try {
    const items = await FaqItem.find({ published: true }).sort({ sortOrder: 1 });
    res.json(items.map(mapFaq));
  } catch (err) {
    next(err);
  }
}

export async function listFaq(req, res, next) {
  try {
    const items = await FaqItem.find().sort({ sortOrder: 1 });
    res.json(items.map(mapFaq));
  } catch (err) {
    next(err);
  }
}

export async function createFaq(req, res, next) {
  try {
    const payload = sanitizeBody(req.body);
    if (!payload.question || !payload.answer) {
      return res.status(400).json({ message: "Question and answer are required." });
    }
    const item = await FaqItem.create(payload);
    res.status(201).json(mapFaq(item));
  } catch (err) {
    next(err);
  }
}

export async function updateFaq(req, res, next) {
  try {
    const payload = sanitizeBody(req.body);
    if (!payload.question || !payload.answer) {
      return res.status(400).json({ message: "Question and answer are required." });
    }
    const item = await FaqItem.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "FAQ item not found." });
    res.json(mapFaq(item));
  } catch (err) {
    next(err);
  }
}

export async function deleteFaq(req, res, next) {
  try {
    const item = await FaqItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "FAQ item not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
