import { GalleryItem } from "../models/GalleryItem.js";

function mapItem(doc) {
  const o = doc.toObject();
  return {
    id: o._id.toString(),
    type: o.type,
    title: o.title,
    caption: o.caption,
    src: o.src,
    thumbnailUrl: o.thumbnailUrl,
    featured: o.featured,
    sortOrder: o.sortOrder,
    published: o.published,
  };
}

export async function listPublicGallery(req, res, next) {
  try {
    const items = await GalleryItem.find({ published: true }).sort({ sortOrder: 1 });
    res.json(items.map(mapItem));
  } catch (err) {
    next(err);
  }
}

export async function listGallery(req, res, next) {
  try {
    const items = await GalleryItem.find().sort({ sortOrder: 1 });
    res.json(items.map(mapItem));
  } catch (err) {
    next(err);
  }
}

export async function createGalleryItem(req, res, next) {
  try {
    const item = await GalleryItem.create(req.body);
    res.status(201).json(mapItem(item));
  } catch (err) {
    next(err);
  }
}

export async function updateGalleryItem(req, res, next) {
  try {
    const item = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Gallery item not found." });
    res.json(mapItem(item));
  } catch (err) {
    next(err);
  }
}

export async function deleteGalleryItem(req, res, next) {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Gallery item not found." });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
