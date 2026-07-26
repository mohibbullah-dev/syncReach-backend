import { Review } from "../models/Review.js";

function normalizeReviewType(type) {
  if (type === "audio") return "image";
  if (type === "image" || type === "video" || type === "text") return type;
  return "text";
}

function mapReview(doc) {
  const o = doc.toObject();
  return {
    id: o._id.toString(),
    type: normalizeReviewType(o.type),
    name: o.name,
    username: o.username,
    role: o.role,
    avatar: o.avatar || "",
    body: o.body,
    mediaUrl: o.mediaUrl,
    thumbnailUrl: o.thumbnailUrl,
    rating: o.rating,
    featured: o.featured,
    published: o.published,
  };
}

function sanitizeBody(body = {}) {
  const type = normalizeReviewType(body.type);
  return {
    type,
    name: body.name,
    username: body.username,
    role: body.role,
    avatar: body.avatar,
    body: body.body,
    mediaUrl: body.mediaUrl,
    thumbnailUrl: body.thumbnailUrl,
    rating: body.rating,
    featured: body.featured,
    published: body.published,
  };
}

/** Public: published reviews */
export async function listPublicReviews(req, res, next) {
  try {
    const filter = { published: true };
    if (req.query.featured === "true") filter.featured = true;
    if (req.query.type) {
      const t = normalizeReviewType(String(req.query.type));
      filter.type = t === "image" ? { $in: ["image", "audio"] } : t;
    }
    const items = await Review.find(filter).sort({ createdAt: -1 });
    res.json(items.map(mapReview));
  } catch (err) {
    next(err);
  }
}

/** Portal: all reviews */
export async function listReviews(req, res, next) {
  try {
    const items = await Review.find().sort({ createdAt: -1 });
    res.json(items.map(mapReview));
  } catch (err) {
    next(err);
  }
}

export async function createReview(req, res, next) {
  try {
    const item = await Review.create(sanitizeBody(req.body));
    res.status(201).json(mapReview(item));
  } catch (err) {
    next(err);
  }
}

export async function updateReview(req, res, next) {
  try {
    const item = await Review.findByIdAndUpdate(req.params.id, sanitizeBody(req.body), {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Review not found." });
    res.json(mapReview(item));
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const item = await Review.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Review not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
