import { HeroContent, defaultHeroCarousel, defaultHeroPayload } from "../models/HeroContent.js";

function normalizeSlides(doc) {
  const o = doc?.toObject ? doc.toObject() : doc;
  if (!o) return [];

  if (Array.isArray(o.slides) && o.slides.length > 0) {
    return o.slides
      .map((slide, index) => ({
        id: slide._id?.toString() || `slide_${index}`,
        type: slide.type === "image" ? "image" : "video",
        mediaUrl: slide.mediaUrl ?? "",
        posterUrl: slide.posterUrl ?? "",
        sortOrder: Number(slide.sortOrder) || index,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  if (o.mediaUrl) {
    return [
      {
        id: "legacy",
        type: o.mediaType === "image" ? "image" : "video",
        mediaUrl: o.mediaUrl ?? "",
        posterUrl: o.posterUrl ?? "",
        sortOrder: 0,
      },
    ];
  }

  return [];
}

function normalizeCarousel(doc) {
  const defaults = defaultHeroCarousel();
  const o = doc?.toObject ? doc.toObject() : doc;
  const c = o?.carousel ?? {};
  return {
    autoplay: c.autoplay !== false,
    autoplayIntervalMs: Math.max(2000, Number(c.autoplayIntervalMs) || defaults.autoplayIntervalMs),
    loop: c.loop !== false,
    showDots: c.showDots !== false,
    showArrows: c.showArrows !== false,
    pauseOnHover: c.pauseOnHover !== false,
  };
}

function mapHero(doc) {
  if (!doc) return { ...defaultHeroPayload() };
  const o = doc.toObject();
  return {
    id: o._id.toString(),
    headlineBefore: o.headlineBefore ?? "We bring",
    headlineHighlight: o.headlineHighlight ?? "the leads.",
    headlineLine2: o.headlineLine2 ?? "You close the deal.",
    description: o.description ?? defaultHeroPayload().description,
    slides: normalizeSlides(doc),
    carousel: normalizeCarousel(doc),
    published: o.published !== false,
  };
}

function sanitizeSlides(slides = []) {
  if (!Array.isArray(slides)) return [];
  return slides
    .map((slide, index) => ({
      type: slide.type === "image" ? "image" : "video",
      mediaUrl: String(slide.mediaUrl || "").trim(),
      posterUrl: String(slide.posterUrl || "").trim(),
      sortOrder: Number(slide.sortOrder) ?? index,
    }))
    .filter((slide) => slide.mediaUrl)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((slide, index) => ({ ...slide, sortOrder: index }));
}

function sanitizeCarousel(body = {}) {
  const defaults = defaultHeroCarousel();
  const c = body.carousel ?? {};
  return {
    autoplay: c.autoplay !== false,
    autoplayIntervalMs: Math.max(
      2000,
      Math.min(30000, Number(c.autoplayIntervalMs) || defaults.autoplayIntervalMs),
    ),
    loop: c.loop !== false,
    showDots: c.showDots !== false,
    showArrows: c.showArrows !== false,
    pauseOnHover: c.pauseOnHover !== false,
  };
}

function sanitizeBody(body = {}) {
  return {
    headlineBefore: String(body.headlineBefore || "").trim(),
    headlineHighlight: String(body.headlineHighlight || "").trim(),
    headlineLine2: String(body.headlineLine2 || "").trim(),
    description: String(body.description || "").trim(),
    slides: sanitizeSlides(body.slides),
    carousel: sanitizeCarousel(body),
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
      doc.markModified("slides");
      doc.markModified("carousel");
      await doc.save();
    } else {
      doc = await HeroContent.create(payload);
    }
    res.json(mapHero(doc));
  } catch (err) {
    next(err);
  }
}
