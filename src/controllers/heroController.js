import { HeroContent, defaultHeroPayload } from "../models/HeroContent.js";

function mapHero(doc) {
  if (!doc) return { ...defaultHeroPayload() };
  const o = doc.toObject();
  return {
    id: o._id.toString(),
    headlineBefore: o.headlineBefore ?? "We bring",
    headlineHighlight: o.headlineHighlight ?? "the leads.",
    headlineLine2: o.headlineLine2 ?? "You close the deal.",
    description: o.description ?? defaultHeroPayload().description,
    mediaType: o.mediaType === "image" ? "image" : "video",
    mediaUrl: o.mediaUrl ?? "",
    posterUrl: o.posterUrl ?? "",
    published: o.published !== false,
  };
}

function sanitizeBody(body = {}) {
  const mediaType = body.mediaType === "image" ? "image" : "video";
  return {
    headlineBefore: String(body.headlineBefore || "").trim(),
    headlineHighlight: String(body.headlineHighlight || "").trim(),
    headlineLine2: String(body.headlineLine2 || "").trim(),
    description: String(body.description || "").trim(),
    mediaType,
    mediaUrl: String(body.mediaUrl || "").trim(),
    posterUrl: String(body.posterUrl || "").trim(),
    published: body.published !== false,
  };
}

async function getSingleton() {
  return HeroContent.findOne().sort({ createdAt: 1 });
}

export async function getPublicHero(req, res, next) {
  try {
    const doc = await getSingleton();
    if (!doc || doc.published === false) {
      return res.json(mapHero(null));
    }
    res.json(mapHero(doc));
  } catch (err) {
    next(err);
  }
}

export async function getHero(req, res, next) {
  try {
    const doc = await getSingleton();
    res.json(mapHero(doc));
  } catch (err) {
    next(err);
  }
}

export async function upsertHero(req, res, next) {
  try {
    const payload = sanitizeBody(req.body);
    if (!payload.headlineBefore || !payload.headlineHighlight || !payload.headlineLine2) {
      return res.status(400).json({ message: "Headline fields are required." });
    }
    if (!payload.description) {
      return res.status(400).json({ message: "Description is required." });
    }

    let doc = await getSingleton();
    if (doc) {
      Object.assign(doc, payload);
      await doc.save();
    } else {
      doc = await HeroContent.create(payload);
    }
    res.json(mapHero(doc));
  } catch (err) {
    next(err);
  }
}
